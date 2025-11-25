import React from 'react';
import { ArrowLeft, Flame, Lock } from 'lucide-react';
import { Badge } from '../App';

interface StreaksScreenProps {
  streakCount: number;
  badges: Badge[];
  onBack: () => void;
}

export function StreaksScreen({ streakCount, badges, onBack }: StreaksScreenProps) {
  return (
    <div className="h-full bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 flex flex-col">
      {/* Header */}
      <div className="p-6 pt-16 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-800">
          Streaks & Badges
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Streak Display */}
        <div className="bg-gradient-to-r from-orange-400 to-yellow-400 rounded-3xl p-8 mb-8 text-center shadow-xl">
          <div className="flex justify-center mb-4">
            <Flame className="w-20 h-20 text-white" />
          </div>
          <p className="text-white/90 mb-2">Current Streak</p>
          <h2 className="text-white mb-2">
            {streakCount} Days
          </h2>
          <p className="text-white/80">
            Keep it going! 🎯
          </p>
        </div>

        {/* Badges Section */}
        <div className="mb-4">
          <h3 className="text-gray-700 mb-4">
            Your Badges
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`rounded-3xl p-6 text-center transition-all ${
                badge.unlocked
                  ? 'bg-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-100 opacity-60'
              }`}
            >
              <div className="text-5xl mb-3 relative">
                {badge.unlocked ? (
                  <span>{badge.icon}</span>
                ) : (
                  <div className="relative">
                    <span className="opacity-30">{badge.icon}</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                )}
              </div>
              <p className={badge.unlocked ? 'text-gray-800' : 'text-gray-500'}>
                {badge.name}
              </p>
              <p className="text-gray-400 mt-1">
                {badge.description}
              </p>
            </div>
          ))}
        </div>

        {/* Motivational Text */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-3xl p-6 mt-6">
          <p className="text-purple-700 text-center">
            ✨ Unlock more badges by maintaining your streak!
          </p>
        </div>
      </div>
    </div>
  );
}
