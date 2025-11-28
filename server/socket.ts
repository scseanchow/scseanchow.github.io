import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  Room,
  Player,
  SocketEvents,
  CreateRoomPayload,
  JoinRoomPayload,
  StartGamePayload,
  SubmitAnswerPayload,
  RoomCreatedPayload,
  JoinSuccessPayload,
  ReconnectSuccessPayload,
  PlayerUpdatePayload,
  ErrorPayload,
  GameStartedPayload,
  createDefaultPlayer,
  createDefaultRoom,
} from '../shared/types';

// ============================================
// In-Memory Storage
// ============================================

// Map of room code -> Room
const rooms = new Map<string, Room>();

// Map of sessionToken -> { roomCode, socketId }
// Allows finding a player's room by their session token
const playerSessions = new Map<string, { roomCode: string; socketId: string }>();

// Cleanup timeout handles for disconnected players
const cleanupTimeouts = new Map<string, NodeJS.Timeout>();

// Configuration
const DISCONNECT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes before permanent removal

// ============================================
// Utility Functions
// ============================================

/**
 * Generate a random room code (4 characters, uppercase)
 */
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Avoid confusing chars like 0/O, 1/I/L
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  // Ensure uniqueness
  if (rooms.has(code)) {
    return generateRoomCode();
  }
  return code;
}

/**
 * Find a player by session token within a room
 */
function findPlayerBySessionToken(room: Room, sessionToken: string): Player | undefined {
  return room.players.find(p => p.sessionToken === sessionToken);
}

/**
 * Find a player by socket ID within a room
 */
function findPlayerBySocketId(room: Room, socketId: string): Player | undefined {
  return room.players.find(p => p.socketId === socketId);
}

/**
 * Find which room a socket is in by checking sessionToken mapping
 */
function findRoomBySessionToken(sessionToken: string): Room | undefined {
  const session = playerSessions.get(sessionToken);
  if (session) {
    return rooms.get(session.roomCode);
  }
  return undefined;
}

/**
 * Emit error to a specific socket
 */
function emitError(socket: Socket, code: string, message: string): void {
  const payload: ErrorPayload = { code, message };
  socket.emit(SocketEvents.ERROR, payload);
}

/**
 * Broadcast player update to entire room
 */
function broadcastPlayerUpdate(
  io: Server,
  room: Room,
  event: PlayerUpdatePayload['event'],
  affectedPlayerId?: string
): void {
  const payload: PlayerUpdatePayload = {
    players: room.players,
    event,
    affectedPlayerId,
  };
  io.to(room.code).emit(SocketEvents.PLAYER_UPDATE, payload);
}

/**
 * Cancel cleanup timeout for a player
 */
function cancelCleanupTimeout(sessionToken: string): void {
  const timeout = cleanupTimeouts.get(sessionToken);
  if (timeout) {
    clearTimeout(timeout);
    cleanupTimeouts.delete(sessionToken);
    console.log(`[Cleanup] Cancelled removal timeout for: ${sessionToken.slice(0, 8)}...`);
  }
}

/**
 * Schedule cleanup for a disconnected player
 */
function schedulePlayerCleanup(
  io: Server,
  room: Room,
  player: Player
): void {
  // Cancel any existing timeout
  cancelCleanupTimeout(player.sessionToken);

  const timeout = setTimeout(() => {
    console.log(`[Cleanup] Removing player ${player.username} (${player.sessionToken.slice(0, 8)}...) after timeout`);
    
    // Remove player from room
    room.players = room.players.filter(p => p.sessionToken !== player.sessionToken);
    
    // Remove session mapping
    playerSessions.delete(player.sessionToken);
    cleanupTimeouts.delete(player.sessionToken);

    // If room is empty, delete it
    if (room.players.length === 0) {
      rooms.delete(room.code);
      console.log(`[Cleanup] Deleted empty room: ${room.code}`);
    } else {
      // Broadcast that player was removed
      broadcastPlayerUpdate(io, room, 'LEFT', player.sessionToken);
      
      // If removed player was host, assign new host
      if (player.isHost && room.players.length > 0) {
        const newHost = room.players.find(p => p.isOnline) || room.players[0];
        newHost.isHost = true;
        room.hostId = newHost.sessionToken;
        console.log(`[Room ${room.code}] New host: ${newHost.username}`);
        broadcastPlayerUpdate(io, room, 'SCORE_UPDATE'); // Trigger UI refresh
      }
    }
  }, DISCONNECT_TIMEOUT_MS);

  cleanupTimeouts.set(player.sessionToken, timeout);
  console.log(`[Cleanup] Scheduled removal of ${player.username} in ${DISCONNECT_TIMEOUT_MS / 1000}s`);
}

// ============================================
// Socket Handler Setup
// ============================================

export function setupSocketHandlers(httpServer: HttpServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // ============================================
    // CREATE_ROOM Handler
    // ============================================
    socket.on(SocketEvents.CREATE_ROOM, (payload: CreateRoomPayload) => {
      const { username, sessionToken } = payload;

      if (!username || !sessionToken) {
        emitError(socket, 'INVALID_PAYLOAD', 'Username and session token are required');
        return;
      }

      // Check if player is already in a room
      const existingRoom = findRoomBySessionToken(sessionToken);
      if (existingRoom) {
        emitError(socket, 'ALREADY_IN_ROOM', 'You are already in a room. Leave first.');
        return;
      }

      // Create room code and host player
      const roomCode = generateRoomCode();
      const host = createDefaultPlayer(sessionToken, socket.id, username, true);
      const room = createDefaultRoom(roomCode, host);

      // Store room and session mapping
      rooms.set(roomCode, room);
      playerSessions.set(sessionToken, { roomCode, socketId: socket.id });

      // Join socket to room
      socket.join(roomCode);

      // Send success response
      const response: RoomCreatedPayload = { room, player: host };
      socket.emit(SocketEvents.ROOM_CREATED, response);

      console.log(`[Room] Created room ${roomCode} by ${username}`);
    });

    // ============================================
    // JOIN_ROOM Handler - With Session Recovery
    // ============================================
    socket.on(SocketEvents.JOIN_ROOM, (payload: JoinRoomPayload) => {
      const { roomCode, username, sessionToken } = payload;

      if (!roomCode || !sessionToken) {
        emitError(socket, 'INVALID_PAYLOAD', 'Room code and session token are required');
        return;
      }

      // 1. Look up the room
      const room = rooms.get(roomCode.toUpperCase());
      if (!room) {
        emitError(socket, 'ROOM_NOT_FOUND', 'Room not found');
        return;
      }

      // 2. Check if player with this sessionToken already exists in the room
      const existingPlayer = findPlayerBySessionToken(room, sessionToken);

      if (existingPlayer) {
        // ============================================
        // SCENARIO A: RECONNECTION
        // ============================================
        console.log(`[Session] Reconnecting player: ${existingPlayer.username} (${sessionToken.slice(0, 8)}...)`);

        // Cancel any pending cleanup timeout
        cancelCleanupTimeout(sessionToken);

        // Leave any previous socket room (in case of stale connections)
        const previousSession = playerSessions.get(sessionToken);
        if (previousSession && previousSession.socketId !== socket.id) {
          // The old socket might still be around, leave it from the room
          const oldSocket = io.sockets.sockets.get(previousSession.socketId);
          if (oldSocket) {
            oldSocket.leave(room.code);
          }
        }

        // CRITICAL: Update socketId to the NEW socket.id
        existingPlayer.socketId = socket.id;
        existingPlayer.isOnline = true;
        existingPlayer.lastSeenAt = Date.now();

        // Update session mapping with new socket ID
        playerSessions.set(sessionToken, { roomCode: room.code, socketId: socket.id });

        // Join the new socket to the room
        socket.join(room.code);

        // Emit RECONNECT_SUCCESS to the client
        const reconnectResponse: ReconnectSuccessPayload = {
          room,
          player: existingPlayer,
          message: 'Welcome back! Your session has been restored.',
        };
        socket.emit(SocketEvents.RECONNECT_SUCCESS, reconnectResponse);

        // Broadcast to room that player is back online
        broadcastPlayerUpdate(io, room, 'RECONNECTED', sessionToken);

        console.log(`[Session] Player ${existingPlayer.username} reconnected to room ${room.code}`);

      } else {
        // ============================================
        // SCENARIO B: NEW PLAYER
        // ============================================

        if (!username) {
          emitError(socket, 'INVALID_PAYLOAD', 'Username is required for new players');
          return;
        }

        // Check room capacity
        if (room.players.length >= room.settings.maxPlayers) {
          emitError(socket, 'ROOM_FULL', 'Room is full');
          return;
        }

        // Check if game already started and late join is disabled
        if (room.status !== 'WAITING' && !room.settings.allowLateJoin) {
          emitError(socket, 'GAME_IN_PROGRESS', 'Game already started');
          return;
        }

        // Check if username is taken in this room
        const usernameTaken = room.players.some(
          p => p.username.toLowerCase() === username.toLowerCase()
        );
        if (usernameTaken) {
          emitError(socket, 'USERNAME_TAKEN', 'Username already taken in this room');
          return;
        }

        // Create new player
        const newPlayer = createDefaultPlayer(sessionToken, socket.id, username, false);
        room.players.push(newPlayer);

        // Store session mapping
        playerSessions.set(sessionToken, { roomCode: room.code, socketId: socket.id });

        // Join socket to room
        socket.join(room.code);

        // Send success response to joining player
        const joinResponse: JoinSuccessPayload = { room, player: newPlayer };
        socket.emit(SocketEvents.JOIN_SUCCESS, joinResponse);

        // Broadcast to room that a new player joined
        broadcastPlayerUpdate(io, room, 'JOINED', sessionToken);

        console.log(`[Room ${room.code}] ${username} joined (${room.players.length} players)`);
      }
    });

    // ============================================
    // LEAVE_ROOM Handler
    // ============================================
    socket.on(SocketEvents.LEAVE_ROOM, (payload: { roomCode: string; sessionToken: string }) => {
      const { roomCode, sessionToken } = payload;

      const room = rooms.get(roomCode);
      if (!room) return;

      const player = findPlayerBySessionToken(room, sessionToken);
      if (!player) return;

      // Cancel any cleanup timeout
      cancelCleanupTimeout(sessionToken);

      // Remove player from room
      room.players = room.players.filter(p => p.sessionToken !== sessionToken);
      
      // Remove session mapping
      playerSessions.delete(sessionToken);

      // Leave socket room
      socket.leave(roomCode);

      if (room.players.length === 0) {
        // Delete empty room
        rooms.delete(roomCode);
        console.log(`[Room ${roomCode}] Deleted (empty)`);
      } else {
        // If leaving player was host, assign new host
        if (player.isHost) {
          const newHost = room.players.find(p => p.isOnline) || room.players[0];
          newHost.isHost = true;
          room.hostId = newHost.sessionToken;
          console.log(`[Room ${roomCode}] New host: ${newHost.username}`);
        }

        // Broadcast player left
        broadcastPlayerUpdate(io, room, 'LEFT', sessionToken);
      }

      console.log(`[Room ${roomCode}] ${player.username} left`);
    });

    // ============================================
    // START_GAME Handler
    // ============================================
    socket.on(SocketEvents.START_GAME, (payload: StartGamePayload) => {
      const { roomCode, sessionToken } = payload;

      const room = rooms.get(roomCode);
      if (!room) {
        emitError(socket, 'ROOM_NOT_FOUND', 'Room not found');
        return;
      }

      // Verify host
      if (room.hostId !== sessionToken) {
        emitError(socket, 'NOT_HOST', 'Only the host can start the game');
        return;
      }

      // Check minimum players
      const onlinePlayers = room.players.filter(p => p.isOnline);
      if (onlinePlayers.length < 2) {
        emitError(socket, 'NOT_ENOUGH_PLAYERS', 'Need at least 2 online players to start');
        return;
      }

      // Start the game
      room.status = 'PLAYING';
      room.currentRound = 1;

      const response: GameStartedPayload = {
        room,
        round: room.currentRound,
      };
      io.to(roomCode).emit(SocketEvents.GAME_STARTED, response);

      console.log(`[Room ${roomCode}] Game started!`);
    });

    // ============================================
    // SUBMIT_ANSWER Handler
    // ============================================
    socket.on(SocketEvents.SUBMIT_ANSWER, (payload: SubmitAnswerPayload) => {
      const { roomCode, answer, sessionToken } = payload;

      const room = rooms.get(roomCode);
      if (!room) return;

      const player = findPlayerBySessionToken(room, sessionToken);
      if (!player) return;

      // Process answer (this would depend on your game logic)
      console.log(`[Room ${roomCode}] ${player.username} submitted: ${answer}`);

      // Update score (example logic)
      // player.score += calculateScore(answer, room);

      // Broadcast score update
      broadcastPlayerUpdate(io, room, 'SCORE_UPDATE', sessionToken);
    });

    // ============================================
    // DISCONNECT Handler - Session Recovery Logic
    // ============================================
    socket.on(SocketEvents.DISCONNECT, (reason: string) => {
      console.log(`[Socket] Client disconnected: ${socket.id} (${reason})`);

      // Find which player this socket belongs to
      for (const [sessionToken, session] of Array.from(playerSessions.entries())) {
        if (session.socketId === socket.id) {
          const room = rooms.get(session.roomCode);
          if (!room) continue;

          const player = findPlayerBySessionToken(room, sessionToken);
          if (!player) continue;

          // ============================================
          // DO NOT remove player immediately!
          // Instead, mark as offline and schedule cleanup
          // ============================================
          player.isOnline = false;
          player.lastSeenAt = Date.now();

          console.log(`[Session] Player ${player.username} went offline in room ${room.code}`);

          // Broadcast that player disconnected (UI can show offline status)
          broadcastPlayerUpdate(io, room, 'DISCONNECTED', sessionToken);

          // Schedule cleanup timeout - player will be removed if they don't reconnect
          schedulePlayerCleanup(io, room, player);

          break; // Found the player, no need to continue
        }
      }
    });
  });

  console.log('[Socket] Socket.io server initialized');
  return io;
}

// ============================================
// Server Entry Point (for standalone use)
// ============================================

export function createSocketServer(port: number = 3001): void {
  const http = require('http');
  const httpServer = http.createServer();
  
  setupSocketHandlers(httpServer);
  
  httpServer.listen(port, () => {
    console.log(`[Server] Socket.io server listening on port ${port}`);
  });
}

// Export for testing and direct use
export { rooms, playerSessions, cleanupTimeouts };
