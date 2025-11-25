import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface MoodLoggingScreenProps {
  onSubmit: (mood: string, emoji: string, intensity: number, note?: string) => void;
  onBack: () => void;
}

interface MoodOption {
  mood: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export function MoodLoggingScreen({ onSubmit, onBack }: MoodLoggingScreenProps) {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [intensity, setIntensity] = useState(50);
  const [note, setNote] = useState('');

  const moods: MoodOption[] = [
    { mood: 'happy', emoji: '😊', color: 'text-yellow-600', bgColor: 'from-yellow-100 to-orange-100' },
    { mood: 'calm', emoji: '😌', color: 'text-blue-600', bgColor: 'from-blue-100 to-cyan-100' },
    { mood: 'sad', emoji: '😢', color: 'text-blue-700', bgColor: 'from-blue-200 to-indigo-200' },
    { mood: 'stressed', emoji: '😰', color: 'text-red-600', bgColor: 'from-red-100 to-pink-100' },
    { mood: 'tired', emoji: '😴', color: 'text-purple-600', bgColor: 'from-purple-100 to-pink-100' },
    { mood: 'energized', emoji: '🤩', color: 'text-green-600', bgColor: 'from-green-100 to-emerald-100' },
  ];

  const handleSubmit = () => {
    if (selectedMood) {
      onSubmit(selectedMood.mood, selectedMood.emoji, intensity, note);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col relative">
      {/* Header */}
      <div className="p-6 pt-16 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-800">
          How are you feeling?
        </h1>
      </div>

      {/* Mood Selection */}
      <div className="flex-1 px-6 pb-40 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.mood}
              onClick={() => setSelectedMood(mood)}
              className={`aspect-square rounded-3xl bg-gradient-to-br ${mood.bgColor} flex flex-col items-center justify-center gap-2 transition-all ${
                selectedMood?.mood === mood.mood 
                  ? 'scale-105 shadow-xl ring-4 ring-purple-300' 
                  : 'hover:scale-105 shadow-md'
              }`}
            >
              <span className="text-5xl">{mood.emoji}</span>
              <span className={`${mood.color} capitalize`}>
                {mood.mood}
              </span>
            </button>
          ))}
        </div>

        {/* Intensity Slider */}
        {selectedMood && (
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-700">Intensity</p>
              <span className="bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-purple-700">
                {intensity}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full h-3 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full appearance-none cursor-pointer"
              style={{
                accentColor: '#c084fc'
              }}
            />
            <div className="flex justify-between mt-2">
              <span className="text-gray-400">Low</span>
              <span className="text-gray-400">High</span>
            </div>
          </div>
        )}

        {/* Note Input */}
        {selectedMood && (
          <div className="bg-white rounded-3xl p-6 shadow-lg mb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-700">Note</p>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full h-20 bg-gray-100 rounded-3xl p-4 resize-none"
              placeholder="Add a note (optional)"
            />
          </div>
        )}

        {/* Submit Button - Right after notes with same spacing */}
        {selectedMood && (
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              background: 'linear-gradient(to right, #a855f7, #ec4899)',
              color: 'white',
              padding: '20px',
              borderRadius: '24px',
              fontWeight: '600',
              fontSize: '18px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              border: 'none',
              cursor: 'pointer',
              marginBottom: '120px',
              display: 'block'
            }}
          >
            Submit Mood
          </button>
        )}
      </div>
    </div>
  );
}