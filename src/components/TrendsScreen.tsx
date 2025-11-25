import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MoodLog } from '../App';

interface TrendsScreenProps {
  moodLogs: MoodLog[];
}

export function TrendsScreen({ moodLogs }: TrendsScreenProps) {
  const [activeTab, setActiveTab] = useState<'mood' | 'consistency' | 'summary'>('mood');

  // Helper function to parse date string (YYYY-MM-DD) to Date object
  const parseDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // Prepare mood data for chart - sort by date and format
  const moodData = [...moodLogs]
    .sort((a, b) => {
      const dateA = parseDate(a.date);
      const dateB = parseDate(b.date);
      return dateA.getTime() - dateB.getTime();
    })
    .map((log) => {
      const date = parseDate(log.date);
      const dayLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        day: dayLabel,
        intensity: log.intensity,
        date: log.date,
        mood: log.mood,
      };
    });

  // Calculate consistency data (logs per day of week)
  const dayOfWeekCounts: { [key: string]: number } = {
    'Sun': 0,
    'Mon': 0,
    'Tue': 0,
    'Wed': 0,
    'Thu': 0,
    'Fri': 0,
    'Sat': 0,
  };

  moodLogs.forEach(log => {
    const date = parseDate(log.date);
    const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
    if (dayOfWeekCounts.hasOwnProperty(dayOfWeek)) {
      dayOfWeekCounts[dayOfWeek]++;
    }
  });

  // Order days starting from Sunday (standard week format)
  const consistencyData = [
    { day: 'Sun', logs: dayOfWeekCounts['Sun'] },
    { day: 'Mon', logs: dayOfWeekCounts['Mon'] },
    { day: 'Tue', logs: dayOfWeekCounts['Tue'] },
    { day: 'Wed', logs: dayOfWeekCounts['Wed'] },
    { day: 'Thu', logs: dayOfWeekCounts['Thu'] },
    { day: 'Fri', logs: dayOfWeekCounts['Fri'] },
    { day: 'Sat', logs: dayOfWeekCounts['Sat'] },
  ];

  // Calculate mood counts from actual logs
  const moodCounts = {
    happy: moodLogs.filter(log => log.mood === 'happy').length,
    calm: moodLogs.filter(log => log.mood === 'calm').length,
    stressed: moodLogs.filter(log => log.mood === 'stressed').length,
    sad: moodLogs.filter(log => log.mood === 'sad').length,
    tired: moodLogs.filter(log => log.mood === 'tired').length,
    energized: moodLogs.filter(log => log.mood === 'energized').length,
  };

  // Calculate summary statistics
  const totalLogs = moodLogs.length;
  const averageIntensity = moodLogs.length > 0
    ? Math.round(moodLogs.reduce((sum, log) => sum + log.intensity, 0) / moodLogs.length)
    : 0;
  
  // Find most logged mood
  const moodEntries = Object.entries(moodCounts);
  const mostLoggedMood = moodEntries.reduce((max, [mood, count]) => 
    count > max.count ? { mood, count } : max, 
    { mood: 'happy', count: 0 }
  );

  // Get emoji for mood
  const moodEmojis: { [key: string]: string } = {
    happy: '😊',
    calm: '😌',
    stressed: '😰',
    sad: '😢',
    tired: '😴',
    energized: '🤩',
  };

  const mostLoggedEmoji = moodEmojis[mostLoggedMood.mood] || '😊';
  const mostLoggedLabel = mostLoggedMood.mood.charAt(0).toUpperCase() + mostLoggedMood.mood.slice(1);

  // Calculate this week's logs (Sunday to Saturday)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek); // Go back to Sunday
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
  endOfWeek.setHours(23, 59, 59, 999);

  const thisWeekLogs = moodLogs.filter(log => {
    const logDate = parseDate(log.date);
    logDate.setHours(0, 0, 0, 0);
    return logDate >= startOfWeek && logDate <= endOfWeek;
  }).length;

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col pb-24">
      {/* Header */}
      <div className="p-6 pt-16">
        <h1 className="text-gray-800 mb-2">
          Trends & Analytics
        </h1>
        <p className="text-gray-600">
          Track your emotional wellness journey
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 mb-6">
        <div className="bg-white rounded-2xl p-1.5 shadow-sm flex gap-1">
          <button
            onClick={() => setActiveTab('mood')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'mood'
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Mood Trend
          </button>
          <button
            onClick={() => setActiveTab('consistency')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'consistency'
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Consistency
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex-1 py-3 rounded-xl transition-all ${
              activeTab === 'summary'
                ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Summary
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {activeTab === 'mood' && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-gray-700 mb-4">
              Mood Intensity Over Time
            </h3>
            {moodData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value}%`,
                      'Intensity'
                    ]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="url(#colorGradient)" 
                    strokeWidth={3}
                    dot={{ fill: '#c084fc', r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#c084fc" />
                      <stop offset="100%" stopColor="#f472b6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                <p>No mood data yet. Start logging to see your trends!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'consistency' && (
          <div className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="text-gray-700 mb-4">
              Weekly Logging Frequency
            </h3>
            {totalLogs > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={consistencyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number) => [`${value} ${value === 1 ? 'log' : 'logs'}`, '']}
                  />
                  <Bar 
                    dataKey="logs" 
                    fill="url(#barGradient)" 
                    radius={[8, 8, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-gray-500">
                <p>No logging data yet. Start logging to see your consistency!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-gray-700 mb-4">
                Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Logs</span>
                  <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">{totalLogs} {totalLogs === 1 ? 'log' : 'logs'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">This Week</span>
                  <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full">{thisWeekLogs} {thisWeekLogs === 1 ? 'log' : 'logs'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Intensity</span>
                  <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full">{averageIntensity}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Most Logged</span>
                  <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full">{mostLoggedEmoji} {mostLoggedLabel}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="text-gray-700 mb-4">
                Mood Distribution
              </h3>
              <div className="space-y-3">
                {moodCounts.happy > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">😊</span>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-orange-400 h-full rounded-full"
                          style={{ width: `${totalLogs > 0 ? (moodCounts.happy / totalLogs) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-600 w-12 text-right">{moodCounts.happy}</span>
                  </div>
                )}
                {moodCounts.calm > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">😌</span>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full rounded-full"
                          style={{ width: `${totalLogs > 0 ? (moodCounts.calm / totalLogs) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-600 w-12 text-right">{moodCounts.calm}</span>
                  </div>
                )}
                {moodCounts.stressed > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">😰</span>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-red-400 to-pink-400 h-full rounded-full"
                          style={{ width: `${totalLogs > 0 ? (moodCounts.stressed / totalLogs) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-600 w-12 text-right">{moodCounts.stressed}</span>
                  </div>
                )}
                {moodCounts.sad > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">😢</span>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full"
                          style={{ width: `${totalLogs > 0 ? (moodCounts.sad / totalLogs) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-600 w-12 text-right">{moodCounts.sad}</span>
                  </div>
                )}
                {moodCounts.tired > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">😴</span>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-full rounded-full"
                          style={{ width: `${totalLogs > 0 ? (moodCounts.tired / totalLogs) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-600 w-12 text-right">{moodCounts.tired}</span>
                  </div>
                )}
                {moodCounts.energized > 0 && (
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🤩</span>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-emerald-400 h-full rounded-full"
                          style={{ width: `${totalLogs > 0 ? (moodCounts.energized / totalLogs) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-gray-600 w-12 text-right">{moodCounts.energized}</span>
                  </div>
                )}
                {totalLogs === 0 && (
                  <p className="text-gray-500 text-center py-4">No mood logs yet. Start logging to see your trends!</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
