import React from 'react';
import { ArrowLeft, Heart, Sparkles, Sun } from 'lucide-react';
import { getRotatingQuote, getRotatingStressedMessage, getRotatingTiredMessage, getRotatingHappyMessage, getRotatingAffirmations } from '../utils/quotes';

interface MotivationalScreenProps {
  onBack: () => void;
}

export function MotivationalScreen({ onBack }: MotivationalScreenProps) {
  const dailyQuote = getRotatingQuote();
  const affirmations = getRotatingAffirmations();

  const moodBasedMessages = [
    {
      icon: <Heart className="w-6 h-6 text-pink-500" />,
      title: "When feeling stressed",
      message: getRotatingStressedMessage(),
      gradient: "from-pink-100 to-rose-100"
    },
    {
      icon: <Sun className="w-6 h-6 text-yellow-500" />,
      title: "When feeling tired",
      message: getRotatingTiredMessage(),
      gradient: "from-yellow-100 to-amber-100"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-purple-500" />,
      title: "When feeling happy",
      message: getRotatingHappyMessage(),
      gradient: "from-purple-100 to-violet-100"
    },
  ];

  return (
    <div className="h-full bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 flex flex-col">
      {/* Header */}
      <div className="p-6 pt-16 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-800">
          Daily Inspiration
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Daily Quote */}
        <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl p-8 mb-6 shadow-xl">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 rounded-full p-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <p className="text-white text-center mb-4 leading-relaxed">
            "{dailyQuote.quote}"
          </p>
          <p className="text-white/80 text-center">
            — {dailyQuote.author}
          </p>
        </div>

        {/* Mood-Based Messages */}
        <div className="mb-4">
          <h3 className="text-gray-700 mb-4">
            Messages for You
          </h3>
        </div>

        <div className="space-y-4">
          {moodBasedMessages.map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${item.gradient} rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white rounded-full p-2">
                  {item.icon}
                </div>
                <p className="text-gray-700">
                  {item.title}
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed">
                {item.message}
              </p>
            </div>
          ))}
        </div>

        {/* Affirmations Section */}
        <div className="mt-6 bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="text-gray-700 mb-4">
            Daily Affirmations
          </h3>
          <ul className="space-y-3">
            {affirmations.map((affirmation, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-purple-400">✨</span>
                <span className="text-gray-600">{affirmation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
