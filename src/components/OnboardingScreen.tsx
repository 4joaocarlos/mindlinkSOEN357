import React from 'react';
import { Sparkles, TrendingUp, Award } from 'lucide-react';

interface OnboardingScreenProps {
  onGetStarted: () => void;
}

export function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  const [step, setStep] = React.useState(0);

  const screens = [
    {
      icon: <Sparkles className="w-20 h-20 text-purple-400" />,
      title: "Welcome to MindLink",
      description: "Your personal companion for emotional wellness and mood tracking",
      gradient: "from-purple-100 to-pink-100"
    },
    {
      icon: <TrendingUp className="w-20 h-20 text-blue-400" />,
      title: "Track Your Mood",
      description: "Log how you're feeling every day with simple emoji selections",
      gradient: "from-blue-100 to-cyan-100"
    },
    {
      icon: <Award className="w-20 h-20 text-green-400" />,
      title: "Build Streaks",
      description: "Stay motivated with daily streaks and unlock achievement badges",
      gradient: "from-green-100 to-emerald-100"
    }
  ];

  const currentScreen = screens[step];

  return (
    <div className={`h-full bg-gradient-to-br ${currentScreen.gradient} flex flex-col items-center justify-between p-8 pt-20`}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="mb-8 animate-pulse">
          {currentScreen.icon}
        </div>
        <h1 className="text-gray-800 mb-4 max-w-xs">
          {currentScreen.title}
        </h1>
        <p className="text-gray-600 max-w-sm">
          {currentScreen.description}
        </p>
      </div>

      <div className="w-full space-y-4">
        <div className="flex justify-center gap-2 mb-6">
          {screens.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === step ? 'w-8 bg-purple-400' : 'w-2 bg-purple-200'
              }`}
            />
          ))}
        </div>

        {step < screens.length - 1 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full bg-gradient-to-r from-purple-400 to-pink-400 text-white py-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Next
          </button>
        ) : (
          <button
            onClick={onGetStarted}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Get Started
          </button>
        )}

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full text-gray-600 py-3"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}
