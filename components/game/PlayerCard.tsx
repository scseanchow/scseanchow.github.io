'use client';

import { Player } from '@/shared/types';
import { cn } from '@/lib/cn';
import { Crown, Wifi, WifiOff } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isCurrentPlayer?: boolean;
  showScore?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Player card component with online/offline status styling
 * 
 * When a player is offline:
 * - Grayscale filter applied
 * - 50% opacity
 * - "Disconnected" indicator shown
 */
export function PlayerCard({
  player,
  isCurrentPlayer = false,
  showScore = false,
  size = 'md',
}: PlayerCardProps) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const avatarSizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  // Generate avatar color from username
  const avatarColor = player.avatarColor || generateAvatarColor(player.username);

  return (
    <div
      className={cn(
        'relative flex items-center gap-3 rounded-xl border-2 transition-all duration-300',
        sizeClasses[size],
        // Online styling
        player.isOnline && [
          'bg-white/10 border-white/20',
          isCurrentPlayer && 'border-emerald-500/50 bg-emerald-500/10 ring-2 ring-emerald-500/20',
        ],
        // Offline styling - grayscale, reduced opacity
        !player.isOnline && [
          'bg-gray-500/5 border-gray-500/20',
          'grayscale opacity-50',
        ],
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex items-center justify-center rounded-full font-bold uppercase',
          avatarSizes[size],
          player.isOnline ? avatarColor : 'bg-gray-500 text-gray-300',
        )}
      >
        {player.username.charAt(0)}
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-semibold truncate',
            player.isOnline ? 'text-white' : 'text-gray-400',
          )}>
            {player.username}
          </span>

          {/* Host Crown */}
          {player.isHost && (
            <Crown className="w-4 h-4 text-amber-400 flex-shrink-0" />
          )}

          {/* Current Player Badge */}
          {isCurrentPlayer && (
            <span className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full flex-shrink-0">
              You
            </span>
          )}
        </div>

        {/* Score (if shown) */}
        {showScore && (
          <div className={cn(
            'text-sm',
            player.isOnline ? 'text-white/60' : 'text-gray-500',
          )}>
            Score: {player.score}
          </div>
        )}
      </div>

      {/* Connection Status Indicator */}
      <div className="flex items-center gap-2">
        {player.isOnline ? (
          <div className="flex items-center gap-1 text-emerald-400">
            <Wifi className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Online</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-red-400">
            <WifiOff className="w-4 h-4 animate-pulse" />
            <span className="text-xs hidden sm:inline">Offline</span>
          </div>
        )}
      </div>

      {/* Offline Overlay Badge */}
      {!player.isOnline && (
        <div className="absolute -top-2 -right-2 px-2 py-0.5 bg-red-500/90 text-white text-xs rounded-full font-medium shadow-lg">
          Disconnected
        </div>
      )}
    </div>
  );
}

/**
 * Generate a consistent color based on username
 */
function generateAvatarColor(username: string): string {
  const colors = [
    'bg-rose-500 text-white',
    'bg-pink-500 text-white',
    'bg-fuchsia-500 text-white',
    'bg-purple-500 text-white',
    'bg-violet-500 text-white',
    'bg-indigo-500 text-white',
    'bg-blue-500 text-white',
    'bg-sky-500 text-white',
    'bg-cyan-500 text-white',
    'bg-teal-500 text-white',
    'bg-emerald-500 text-white',
    'bg-green-500 text-white',
    'bg-lime-500 text-gray-900',
    'bg-yellow-500 text-gray-900',
    'bg-amber-500 text-gray-900',
    'bg-orange-500 text-white',
  ];

  // Simple hash to get consistent color
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
}

export default PlayerCard;
