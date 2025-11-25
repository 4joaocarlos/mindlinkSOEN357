import React from 'react';
import { CheckCircle, Flame } from 'lucide-react';
import { MoodLog } from '../App';

interface FeedbackScreenProps {
  mood: MoodLog | null;
  streakCount: number;
  onBackToHome: () => void;
}

export function FeedbackScreen({ mood, streakCount, onBackToHome }: FeedbackScreenProps) {
  const encouragingMessages = [
    "Nice job staying consistent!",
    "You're building a great habit!",
    "Keep up the amazing work!",
    "Every log brings you closer to your goals!",
    "You're doing fantastic!",
  ];

  const message = encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)];

  return (
    <div className="h-full bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex flex-col items-center justify-center p-8">
      {/* Success Icon */}
      <div className="mb-8 animate-in zoom-in duration-500">
        <CheckCircle className="w-24 h-24 text-green-500" strokeWidth={1.5} />
      </div>

      {/* Mood Emoji */}
      {mood && (
        <div className="text-8xl mb-6 animate-in zoom-in duration-300 delay-100">
          {mood.emoji}
        </div>
      )}

      {/* Success Message */}
      <h1 className="text-gray-800 mb-3 text-center">
        Mood Logged!
      </h1>
      
      <p className="text-gray-600 text-center mb-8 max-w-sm">
        {message}
      </p>

      {/* Streak Info */}
      <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg flex items-center gap-4 animate-in slide-in-from-bottom-4 duration-300 delay-200">
        <div className="bg-gradient-to-br from-orange-100 to-yellow-100 rounded-full p-4">
          <Flame className="w-8 h-8 text-orange-500" />
        </div>
        <div>
          <p className="text-gray-600">Your Streak</p>
          <p className="text-orange-600">{streakCount} days strong!</p>
        </div>
      </div>

      {/* Back to Home Button */}
      <button
        onClick={onBackToHome}
        className="w-full max-w-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white py-5 rounded-3xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
      >
        Back to Home
      </button>
    </div>
  );
}
