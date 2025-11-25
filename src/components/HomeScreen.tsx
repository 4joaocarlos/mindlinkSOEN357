import React from 'react';
import { Flame, ChevronRight, BookOpen } from 'lucide-react';

interface HomeScreenProps {
  userName: string | null;
  streakCount: number;
  onLogMood: () => void;
  onViewStreaks: () => void;
  onViewMotivational: () => void;
  onViewJournal: () => void;
}

export function HomeScreen({ userName, streakCount, onLogMood, onViewStreaks, onViewMotivational, onViewJournal }: HomeScreenProps) {
  const motivationalQuotes = [
    "Every day is a fresh start. Make it count! 💚",
    "You're doing great. Keep showing up for yourself! 🌟",
    "Small steps lead to big changes. ✨",
    "Your feelings are valid. Take time to understand them. 🌸",
    "Progress, not perfection. You've got this! 💪"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-6 pt-16 pb-24 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-800">
          {userName ? `Hey ${userName}, how are you feeling today?` : 'How are you feeling today?'}
        </h1>
      </div>

      {/* Streak Badge */}
      <div 
        onClick={onViewStreaks}
        className="bg-gradient-to-r from-orange-100 to-yellow-100 rounded-3xl p-6 mb-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-3">
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
          <div>
            <p className="text-gray-600">Current Streak</p>
            <p className="text-orange-600">{streakCount} days</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </div>

      {/* Log Mood Button */}
      <button
        onClick={onLogMood}
        className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-5 rounded-3xl mb-6 transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
      >
        Log Your Mood
      </button>

      {/* Motivational Quote */}
      <div 
        onClick={onViewMotivational}
        className="bg-white rounded-3xl p-6 shadow-sm cursor-pointer hover:shadow-lg transition-shadow mb-4"
      >
        <p className="text-purple-600 mb-2">💭 Daily Inspiration</p>
        <p className="text-gray-700">
          {randomQuote}
        </p>
      </div>

      {/* Journal Button */}
      <div 
        onClick={onViewJournal}
        className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-3xl p-6 mb-6 flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow"
      >
        <div className="flex items-center gap-4">
          <div className="bg-white rounded-full p-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <p className="text-gray-600">My Journal</p>
            <p className="text-amber-700">View your notes</p>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-gray-400" />
      </div>
    </div>
  );
}