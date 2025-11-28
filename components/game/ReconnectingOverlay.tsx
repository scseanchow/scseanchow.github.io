'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

interface ReconnectingOverlayProps {
  isVisible: boolean;
  message?: string;
}

/**
 * Full-screen overlay shown when the socket disconnects unexpectedly.
 * Reassures the player that their progress is safe and reconnection is in progress.
 */
export function ReconnectingOverlay({
  isVisible,
  message = 'Reconnecting...',
}: ReconnectingOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="relative max-w-md mx-4 p-8 bg-gradient-to-b from-gray-800 to-gray-900 rounded-2xl border border-white/10 shadow-2xl"
          >
            {/* Animated WiFi Icon */}
            <div className="relative flex justify-center mb-6">
              {/* Pulsing background circles */}
              <motion.div
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.1, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-24 h-24 bg-amber-500/30 rounded-full"
              />
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.2, 0.05, 0.2],
                }}
                transition={{
                  duration: 2,
                  delay: 0.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-32 h-32 bg-amber-500/20 rounded-full"
              />

              {/* WiFi icon container */}
              <div className="relative w-20 h-20 flex items-center justify-center bg-gradient-to-br from-amber-500 to-orange-600 rounded-full shadow-lg">
                <motion.div
                  animate={{ rotate: [0, 0, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <WifiOff className="w-10 h-10 text-white" />
                </motion.div>
              </div>
            </div>

            {/* Main Message */}
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                {message}
              </h2>
              
              <p className="text-gray-400 mb-4">
                Don't worry! Your progress is safe.
              </p>

              <p className="text-sm text-gray-500">
                We're trying to restore your connection...
              </p>
            </div>

            {/* Progress Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    delay: i * 0.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="w-2 h-2 bg-amber-500 rounded-full"
                />
              ))}
            </div>

            {/* Helpful tip */}
            <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-start gap-3">
                <Wifi className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p className="font-medium text-gray-300 mb-1">Session Recovery Active</p>
                  <p>Your session token is saved. Even if the page refreshes, you'll be reconnected to your game automatically.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ReconnectingOverlay;
