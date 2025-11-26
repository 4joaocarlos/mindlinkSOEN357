import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { journalAPI, MoodLog } from '../utils/api';

interface JournalScreenProps {
  moodLogs: MoodLog[];
  onBack: () => void;
}

export function JournalScreen({ moodLogs, onBack }: JournalScreenProps) {
  const [journalEntries, setJournalEntries] = useState<MoodLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJournalEntries = async () => {
      try {
        const response = await journalAPI.getEntries();
        if (response.success && response.data) {
          setJournalEntries(response.data);
        }
      } catch (error) {
        console.error('Error loading journal entries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadJournalEntries();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="h-full bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <div className="p-6 pt-16 flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-800">
          Journal Entries
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading journal entries...</div>
          </div>
        ) : journalEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="bg-white rounded-full p-6 mb-4">
              <BookOpen className="w-12 h-12 text-orange-400" />
            </div>
            <h3 className="text-gray-700 mb-2">
              No Journal Entries Yet
            </h3>
            <p className="text-gray-500">
              Start adding notes when you log your moods to build your personal journal
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {journalEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-4xl">{entry.emoji}</span>
                  <div className="flex-1">
                    <p className="text-gray-800 capitalize">
                      {entry.mood}
                    </p>
                    <p className="text-gray-500">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <span className="bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full text-purple-700">
                    {entry.intensity}%
                  </span>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4">
                  <p className="text-gray-700 leading-relaxed">
                    {entry.note}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
