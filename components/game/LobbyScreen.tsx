'use client';

import { motion } from 'framer-motion';
import { Room, Player } from '@/shared/types';
import { PlayerCard } from './PlayerCard';
import { ReconnectingOverlay } from './ReconnectingOverlay';
import { cn } from '@/lib/cn';
import {
  Copy,
  Check,
  Users,
  Play,
  LogOut,
  Settings,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { useState, useCallback } from 'react';

interface LobbyScreenProps {
  room: Room;
  currentPlayer: Player | null;
  isHost: boolean;
  isConnected: boolean;
  isReconnecting: boolean;
  onStartGame: () => void;
  onLeaveRoom: () => void;
}

/**
 * Lobby screen showing all players in the room.
 * 
 * Features:
 * - Room code with copy functionality
 * - Player list with online/offline status
 * - Offline players shown with grayscale + reduced opacity
 * - Host controls to start the game
 * - Reconnecting overlay when connection is lost
 */
export function LobbyScreen({
  room,
  currentPlayer,
  isHost,
  isConnected,
  isReconnecting,
  onStartGame,
  onLeaveRoom,
}: LobbyScreenProps) {
  const [copied, setCopied] = useState(false);

  // Copy room code to clipboard
  const copyRoomCode = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(room.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [room.code]);

  // Count online/offline players
  const onlinePlayers = room.players.filter(p => p.isOnline);
  const offlinePlayers = room.players.filter(p => !p.isOnline);
  const canStartGame = isHost && onlinePlayers.length >= 2;

  return (
    <>
      {/* Reconnecting Overlay */}
      <ReconnectingOverlay isVisible={isReconnecting} />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4 sm:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Game Lobby
            </h1>
            <p className="text-gray-400">
              Waiting for players to join...
            </p>
          </motion.div>

          {/* Room Code Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-8 p-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-2xl border border-white/10"
          >
            <p className="text-sm text-gray-400 mb-2 uppercase tracking-wide">
              Room Code
            </p>
            <div className="flex items-center gap-4">
              <span className="text-4xl sm:text-5xl font-mono font-bold tracking-widest text-white">
                {room.code}
              </span>
              <button
                onClick={copyRoomCode}
                className={cn(
                  'p-3 rounded-xl transition-all duration-200',
                  copied
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-white/10 text-white hover:bg-white/20',
                )}
                title="Copy room code"
              >
                {copied ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <Copy className="w-6 h-6" />
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Share this code with friends to join
            </p>
          </motion.div>

          {/* Connection Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400">
                {room.players.length} / {room.settings.maxPlayers} Players
              </span>
            </div>
            <div className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full text-sm',
              isConnected
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400',
            )}>
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span>Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 animate-pulse" />
                  <span>Disconnected</span>
                </>
              )}
            </div>
          </motion.div>

          {/* Players List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3 mb-8"
          >
            {/* Online Players */}
            {onlinePlayers.map((player, index) => (
              <motion.div
                key={player.sessionToken}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <PlayerCard
                  player={player}
                  isCurrentPlayer={player.sessionToken === currentPlayer?.sessionToken}
                  showScore={false}
                  size="md"
                />
              </motion.div>
            ))}

            {/* Offline Players Section */}
            {offlinePlayers.length > 0 && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                  <WifiOff className="w-4 h-4" />
                  Disconnected Players ({offlinePlayers.length})
                </p>
                {offlinePlayers.map((player, index) => (
                  <motion.div
                    key={player.sessionToken}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="mb-3"
                  >
                    <PlayerCard
                      player={player}
                      isCurrentPlayer={false}
                      showScore={false}
                      size="md"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Host Controls */}
          {isHost && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20 mb-6"
            >
              <p className="text-amber-400 text-sm mb-3 font-medium">
                Host Controls
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={onStartGame}
                  disabled={!canStartGame || !isConnected}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200',
                    canStartGame && isConnected
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-lg shadow-emerald-500/25'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed',
                  )}
                >
                  <Play className="w-5 h-5" />
                  Start Game
                </button>
                <button
                  onClick={() => {/* Open settings modal */}}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-200"
                >
                  <Settings className="w-5 h-5" />
                  <span className="sm:hidden">Settings</span>
                </button>
              </div>
              {!canStartGame && (
                <p className="text-sm text-gray-500 mt-2">
                  {onlinePlayers.length < 2
                    ? `Need at least 2 online players to start (${onlinePlayers.length}/2)`
                    : 'Ready to start!'}
                </p>
              )}
            </motion.div>
          )}

          {/* Leave Room Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button
              onClick={onLeaveRoom}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              Leave Room
            </button>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default LobbyScreen;
