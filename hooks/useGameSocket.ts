'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  GameState,
  Room,
  SocketEvents,
  JoinRoomPayload,
  CreateRoomPayload,
  JoinSuccessPayload,
  ReconnectSuccessPayload,
  PlayerUpdatePayload,
  RoomCreatedPayload,
  ErrorPayload,
  GameStartedPayload,
  StartGamePayload,
} from '@/shared/types';

// ============================================
// Session Token Management
// ============================================

const SESSION_TOKEN_KEY = 'player_session_token';
const LAST_ROOM_KEY = 'player_last_room';

/**
 * Get or create a persistent session token.
 * This token survives page refreshes and reconnections.
 */
function getOrCreateSessionToken(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  let token = localStorage.getItem(SESSION_TOKEN_KEY);
  
  if (!token) {
    // Generate a new UUID for this player
    token = crypto.randomUUID();
    localStorage.setItem(SESSION_TOKEN_KEY, token);
    console.log('[Session] Created new session token:', token.slice(0, 8) + '...');
  } else {
    console.log('[Session] Using existing session token:', token.slice(0, 8) + '...');
  }
  
  return token;
}

/**
 * Store the last room code for potential auto-rejoin
 */
function saveLastRoom(roomCode: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LAST_ROOM_KEY, roomCode);
  }
}

/**
 * Get the last room code the player was in
 */
function getLastRoom(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LAST_ROOM_KEY);
  }
  return null;
}

/**
 * Clear last room on intentional leave
 */
function clearLastRoom(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LAST_ROOM_KEY);
  }
}

// ============================================
// Initial Game State
// ============================================

const initialGameState: GameState = {
  room: null,
  currentPlayer: null,
  view: 'HOME',
  isConnected: false,
  isReconnecting: false,
  error: null,
};

// ============================================
// Socket Configuration
// ============================================

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

const SOCKET_OPTIONS = {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
};

// ============================================
// Main Hook
// ============================================

export function useGameSocket() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const socketRef = useRef<Socket | null>(null);
  const sessionTokenRef = useRef<string>('');
  const reconnectAttemptRef = useRef<boolean>(false);

  // ---- Initialize Session Token ----
  useEffect(() => {
    sessionTokenRef.current = getOrCreateSessionToken();
  }, []);

  // ---- Socket Connection Management ----
  const connect = useCallback(() => {
    if (socketRef.current?.connected) {
      console.log('[Socket] Already connected');
      return;
    }

    console.log('[Socket] Connecting to:', SOCKET_URL);
    
    const socket = io(SOCKET_URL, SOCKET_OPTIONS);
    socketRef.current = socket;

    // ---- Connection Events ----

    socket.on(SocketEvents.CONNECT, () => {
      console.log('[Socket] Connected with ID:', socket.id);
      setGameState(prev => ({
        ...prev,
        isConnected: true,
        isReconnecting: false,
        error: null,
      }));

      // Attempt auto-rejoin if we have a last room
      const lastRoom = getLastRoom();
      if (lastRoom && reconnectAttemptRef.current) {
        console.log('[Session] Attempting auto-rejoin to room:', lastRoom);
        // The username will come from the server's stored player data
        socket.emit(SocketEvents.JOIN_ROOM, {
          roomCode: lastRoom,
          username: '', // Server will use stored username for reconnecting players
          sessionToken: sessionTokenRef.current,
        } as JoinRoomPayload);
      }
      reconnectAttemptRef.current = false;
    });

    socket.on(SocketEvents.DISCONNECT, (reason) => {
      console.log('[Socket] Disconnected:', reason);
      setGameState(prev => ({
        ...prev,
        isConnected: false,
        isReconnecting: reason !== 'io client disconnect', // Not intentional disconnect
      }));

      // Mark that we should try to reconnect on next connect
      if (reason !== 'io client disconnect') {
        reconnectAttemptRef.current = true;
      }
    });

    socket.on(SocketEvents.CONNECT_ERROR, (error) => {
      console.error('[Socket] Connection error:', error.message);
      setGameState(prev => ({
        ...prev,
        isConnected: false,
        error: 'Failed to connect to server',
      }));
    });

    // ---- Game Events ----

    socket.on(SocketEvents.ROOM_CREATED, (payload: RoomCreatedPayload) => {
      console.log('[Game] Room created:', payload.room.code);
      saveLastRoom(payload.room.code);
      setGameState(prev => ({
        ...prev,
        room: payload.room,
        currentPlayer: payload.player,
        view: 'LOBBY',
        error: null,
      }));
    });

    socket.on(SocketEvents.JOIN_SUCCESS, (payload: JoinSuccessPayload) => {
      console.log('[Game] Joined room:', payload.room.code);
      saveLastRoom(payload.room.code);
      setGameState(prev => ({
        ...prev,
        room: payload.room,
        currentPlayer: payload.player,
        view: 'LOBBY',
        error: null,
      }));
    });

    // ---- CRITICAL: Session Recovery Handler ----
    socket.on(SocketEvents.RECONNECT_SUCCESS, (payload: ReconnectSuccessPayload) => {
      console.log('[Session] Reconnected successfully!', payload.message);
      saveLastRoom(payload.room.code);
      
      // Immediately restore game state and route to appropriate view
      setGameState(prev => ({
        ...prev,
        room: payload.room,
        currentPlayer: payload.player,
        // Route directly to GAME if game is in progress, otherwise LOBBY
        view: payload.room.status === 'PLAYING' ? 'GAME' : 'LOBBY',
        isReconnecting: false,
        error: null,
      }));
    });

    socket.on(SocketEvents.PLAYER_UPDATE, (payload: PlayerUpdatePayload) => {
      console.log('[Game] Player update:', payload.event, payload.affectedPlayerId);
      setGameState(prev => {
        if (!prev.room) return prev;
        
        // Update current player if they're in the list
        const updatedCurrentPlayer = payload.players.find(
          p => p.sessionToken === sessionTokenRef.current
        );

        return {
          ...prev,
          room: {
            ...prev.room,
            players: payload.players,
          },
          currentPlayer: updatedCurrentPlayer || prev.currentPlayer,
        };
      });
    });

    socket.on(SocketEvents.GAME_STARTED, (payload: GameStartedPayload) => {
      console.log('[Game] Game started! Round:', payload.round);
      setGameState(prev => ({
        ...prev,
        room: payload.room,
        view: 'GAME',
      }));
    });

    socket.on(SocketEvents.GAME_ENDED, (room: Room) => {
      console.log('[Game] Game ended');
      setGameState(prev => ({
        ...prev,
        room,
        view: 'RESULTS',
      }));
    });

    socket.on(SocketEvents.ERROR, (payload: ErrorPayload) => {
      console.error('[Game] Error:', payload.code, payload.message);
      setGameState(prev => ({
        ...prev,
        error: payload.message,
      }));
    });

    socket.connect();
  }, []);

  // ---- Disconnect ----
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    clearLastRoom();
    setGameState(initialGameState);
  }, []);

  // ---- Create Room ----
  const createRoom = useCallback((username: string) => {
    if (!socketRef.current?.connected) {
      console.error('[Game] Cannot create room: not connected');
      return;
    }

    const payload: CreateRoomPayload = {
      username,
      sessionToken: sessionTokenRef.current,
    };

    socketRef.current.emit(SocketEvents.CREATE_ROOM, payload);
  }, []);

  // ---- Join Room ----
  const joinRoom = useCallback((roomCode: string, username: string) => {
    if (!socketRef.current?.connected) {
      console.error('[Game] Cannot join room: not connected');
      return;
    }

    const payload: JoinRoomPayload = {
      roomCode: roomCode.toUpperCase(),
      username,
      sessionToken: sessionTokenRef.current, // Always include session token
    };

    console.log('[Game] Joining room with session token:', sessionTokenRef.current.slice(0, 8) + '...');
    socketRef.current.emit(SocketEvents.JOIN_ROOM, payload);
  }, []);

  // ---- Leave Room ----
  const leaveRoom = useCallback(() => {
    if (socketRef.current?.connected && gameState.room) {
      socketRef.current.emit(SocketEvents.LEAVE_ROOM, {
        roomCode: gameState.room.code,
        sessionToken: sessionTokenRef.current,
      });
    }
    clearLastRoom();
    setGameState(prev => ({
      ...prev,
      room: null,
      currentPlayer: null,
      view: 'HOME',
    }));
  }, [gameState.room]);

  // ---- Start Game (Host Only) ----
  const startGame = useCallback(() => {
    if (!socketRef.current?.connected || !gameState.room) {
      console.error('[Game] Cannot start game: not connected or no room');
      return;
    }

    const payload: StartGamePayload = {
      roomCode: gameState.room.code,
      sessionToken: sessionTokenRef.current,
    };

    socketRef.current.emit(SocketEvents.START_GAME, payload);
  }, [gameState.room]);

  // ---- Submit Answer ----
  const submitAnswer = useCallback((answer: string) => {
    if (!socketRef.current?.connected || !gameState.room) {
      console.error('[Game] Cannot submit answer: not connected or no room');
      return;
    }

    socketRef.current.emit(SocketEvents.SUBMIT_ANSWER, {
      roomCode: gameState.room.code,
      answer,
      sessionToken: sessionTokenRef.current,
    });
  }, [gameState.room]);

  // ---- Clear Error ----
  const clearError = useCallback(() => {
    setGameState(prev => ({ ...prev, error: null }));
  }, []);

  // ---- Navigate to View ----
  const navigateTo = useCallback((view: GameState['view']) => {
    setGameState(prev => ({ ...prev, view }));
  }, []);

  // ---- Get Session Token (for debugging) ----
  const getSessionToken = useCallback(() => {
    return sessionTokenRef.current;
  }, []);

  // ---- Auto-connect on mount ----
  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    // State
    gameState,
    isHost: gameState.currentPlayer?.isHost ?? false,
    
    // Actions
    connect,
    disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    submitAnswer,
    clearError,
    navigateTo,
    
    // Session
    getSessionToken,
  };
}

export default useGameSocket;
