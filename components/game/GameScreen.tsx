'use client';

import { motion } from 'framer-motion';
import { Room, Player } from '@/shared/types';
import { PlayerCard } from './PlayerCard';
import { ReconnectingOverlay } from './ReconnectingOverlay';
import { cn } from '@/lib/cn';
import {
  Trophy,
  Users,
  Send,
  Wifi,
  WifiOff,
  Timer,
} from 'lucide-react';
import { useState, useCallback } from 'react';

interface GameScreenProps {
  room: Room;
  currentPlayer: Player | null;
  isConnected: boolean;
  isReconnecting: boolean;
  onSubmitAnswer: (answer: string) => void;
}

/**
 * Main game screen shown during active gameplay.
 * 
 * Features:
 * - Current round and timer display
 * - Leaderboard showing all players with scores
 * - Offline players shown with grayscale styling
 * - Answer submission form
 * - Reconnecting overlay when connection is lost
 */
export function GameScreen({
  room,
  currentPlayer,
  isConnected,
  isReconnecting,
  onSubmitAnswer,
}: GameScreenProps) {
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sort players by score (descending)
  const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
  const onlinePlayers = sortedPlayers.filter(p => p.isOnline);
  const offlinePlayers = sortedPlayers.filter(p => !p.isOnline);

  // Handle answer submission
  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!answer.trim() || isSubmitting || !isConnected) return;

    setIsSubmitting(true);
    onSubmitAnswer(answer.trim());
    setAnswer('');
    
    // Reset submitting state after a brief delay
    setTimeout(() => setIsSubmitting(false), 500);
  }, [answer, isSubmitting, isConnected, onSubmitAnswer]);

  // Get current player's rank
  const currentRank = currentPlayer
    ? sortedPlayers.findIndex(p => p.sessionToken === currentPlayer.sessionToken) + 1
    : 0;

  return (
    <>
      {/* Reconnecting Overlay - Shows when connection is lost */}
      <ReconnectingOverlay 
        isVisible={isReconnecting} 
        message="Reconnecting to game..."
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900/20 to-gray-900 text-white">
        {/* Header Bar */}
        <div className="sticky top-0 z-40 bg-gray-900/90 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            {/* Round Info */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-indigo-400">
                <Timer className="w-5 h-5" />
                <span className="font-semibold">
                  Round {room.currentRound} / {room.maxRounds}
                </span>
              </div>
            </div>

            {/* Connection Status */}
            <div className={cn(
              'flex items-center gap-2 px-3 py-1 rounded-full text-sm',
              isConnected
                ? 'bg-emerald-500/20 text-emerald-400'
                : 'bg-red-500/20 text-red-400 animate-pulse',
            )}>
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4" />
                  <span className="hidden sm:inline">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4" />
                  <span className="hidden sm:inline">Reconnecting...</span>
                </>
              )}
            </div>

            {/* Room Code */}
            <div className="text-sm text-gray-400">
              Room: <span className="font-mono font-bold text-white">{room.code}</span>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Game Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Player Stats */}
              {currentPlayer && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 rounded-xl border border-white/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Your Score</p>
                      <p className="text-3xl font-bold text-white">
                        {currentPlayer.score}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Rank</p>
                      <p className="text-3xl font-bold text-amber-400">
                        #{currentRank}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Game Content Area (placeholder for actual game content) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 bg-white/5 rounded-2xl border border-white/10 min-h-[300px] flex items-center justify-center"
              >
                <div className="text-center text-gray-400">
                  <p className="text-lg mb-2">Game Content Area</p>
                  <p className="text-sm">Questions and interactive content go here</p>
                </div>
              </motion.div>

              {/* Answer Submission */}
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="flex gap-3"
              >
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  disabled={!isConnected}
                  className={cn(
                    'flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200',
                    !isConnected && 'opacity-50 cursor-not-allowed',
                  )}
                />
                <button
                  type="submit"
                  disabled={!answer.trim() || isSubmitting || !isConnected}
                  className={cn(
                    'px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200',
                    answer.trim() && isConnected
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed',
                  )}
                >
                  <Send className="w-5 h-5" />
                  <span className="hidden sm:inline">Submit</span>
                </button>
              </motion.form>
            </div>

            {/* Leaderboard Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Leaderboard Header */}
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Leaderboard
                </h2>
                <span className="text-sm text-gray-400 flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {room.players.length}
                </span>
              </div>

              {/* Online Players */}
              <div className="space-y-2">
                {onlinePlayers.map((player, index) => (
                  <motion.div
                    key={player.sessionToken}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="relative"
                  >
                    {/* Rank Badge */}
                    <div className={cn(
                      'absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold z-10',
                      index === 0 && 'bg-amber-500 text-white',
                      index === 1 && 'bg-gray-300 text-gray-700',
                      index === 2 && 'bg-amber-700 text-white',
                      index > 2 && 'bg-gray-700 text-gray-300',
                    )}>
                      {index + 1}
                    </div>
                    <div className="ml-4">
                      <PlayerCard
                        player={player}
                        isCurrentPlayer={player.sessionToken === currentPlayer?.sessionToken}
                        showScore={true}
                        size="sm"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Offline Players */}
              {offlinePlayers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                    <WifiOff className="w-3 h-3" />
                    Disconnected ({offlinePlayers.length})
                  </p>
                  <div className="space-y-2">
                    {offlinePlayers.map((player) => (
                      <div key={player.sessionToken} className="ml-4">
                        <PlayerCard
                          player={player}
                          isCurrentPlayer={false}
                          showScore={true}
                          size="sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GameScreen;
