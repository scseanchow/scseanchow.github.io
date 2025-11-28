// ============================================
// Shared Types for Multiplayer Game
// Session Recovery with Token-Based Identity
// ============================================

// ---- Player Types ----

export interface Player {
  id: string;                    // Internal player ID (can be same as sessionToken)
  socketId: string;              // Current socket.id (changes on reconnect)
  sessionToken: string;          // UUID, persistent across reconnections
  username: string;
  score: number;
  isOnline: boolean;             // Track connection status
  isHost: boolean;
  avatarColor?: string;
  joinedAt: number;              // Timestamp when player first joined
  lastSeenAt?: number;           // Timestamp of last activity (for cleanup)
}

// ---- Room Types ----

export type RoomStatus = 'WAITING' | 'PLAYING' | 'FINISHED';

export interface Room {
  id: string;
  code: string;                  // 4-6 character room code
  hostId: string;                // sessionToken of the host
  players: Player[];
  status: RoomStatus;
  currentRound: number;
  maxRounds: number;
  settings: RoomSettings;
  createdAt: number;
}

export interface RoomSettings {
  maxPlayers: number;
  roundTimeLimit: number;        // seconds
  allowLateJoin: boolean;
}

// ---- Game State ----

export type ViewState = 'HOME' | 'LOBBY' | 'GAME' | 'RESULTS';

export interface GameState {
  room: Room | null;
  currentPlayer: Player | null;
  view: ViewState;
  isConnected: boolean;
  isReconnecting: boolean;
  error: string | null;
}

// ---- Socket Event Payloads ----

// Client -> Server

export interface CreateRoomPayload {
  username: string;
  sessionToken: string;
}

export interface JoinRoomPayload {
  roomCode: string;
  username: string;
  sessionToken: string;          // Required for session recovery
}

export interface SubmitAnswerPayload {
  roomCode: string;
  answer: string;
  sessionToken: string;
}

export interface StartGamePayload {
  roomCode: string;
  sessionToken: string;          // Must match host's token
}

// Server -> Client

export interface RoomCreatedPayload {
  room: Room;
  player: Player;
}

export interface JoinSuccessPayload {
  room: Room;
  player: Player;
}

export interface ReconnectSuccessPayload {
  room: Room;
  player: Player;
  message: string;
}

export interface PlayerUpdatePayload {
  players: Player[];
  event: 'JOINED' | 'LEFT' | 'RECONNECTED' | 'DISCONNECTED' | 'SCORE_UPDATE';
  affectedPlayerId?: string;
}

export interface GameStartedPayload {
  room: Room;
  round: number;
}

export interface ErrorPayload {
  code: string;
  message: string;
}

// ---- Socket Event Names ----

export const SocketEvents = {
  // Client -> Server
  CREATE_ROOM: 'CREATE_ROOM',
  JOIN_ROOM: 'JOIN_ROOM',
  LEAVE_ROOM: 'LEAVE_ROOM',
  START_GAME: 'START_GAME',
  SUBMIT_ANSWER: 'SUBMIT_ANSWER',
  
  // Server -> Client
  ROOM_CREATED: 'ROOM_CREATED',
  JOIN_SUCCESS: 'JOIN_SUCCESS',
  RECONNECT_SUCCESS: 'RECONNECT_SUCCESS',    // Session recovery event
  PLAYER_UPDATE: 'PLAYER_UPDATE',
  GAME_STARTED: 'GAME_STARTED',
  ROUND_UPDATE: 'ROUND_UPDATE',
  GAME_ENDED: 'GAME_ENDED',
  ERROR: 'ERROR',
  
  // Built-in Socket.io events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
} as const;

export type SocketEventName = typeof SocketEvents[keyof typeof SocketEvents];

// ---- Utility Types ----

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export function createDefaultPlayer(
  sessionToken: string,
  socketId: string,
  username: string,
  isHost: boolean = false
): Player {
  return {
    id: sessionToken,
    socketId,
    sessionToken,
    username,
    score: 0,
    isOnline: true,
    isHost,
    joinedAt: Date.now(),
    lastSeenAt: Date.now(),
  };
}

export function createDefaultRoom(code: string, host: Player): Room {
  return {
    id: crypto.randomUUID?.() || `room_${Date.now()}`,
    code,
    hostId: host.sessionToken,
    players: [host],
    status: 'WAITING',
    currentRound: 0,
    maxRounds: 10,
    settings: {
      maxPlayers: 8,
      roundTimeLimit: 30,
      allowLateJoin: true,
    },
    createdAt: Date.now(),
  };
}
