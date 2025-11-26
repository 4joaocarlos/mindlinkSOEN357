// Mock API for testing without backend
export const mockAPI = {
  register: async (data: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock successful registration
    return {
      success: true,
      data: {
        user: {
          id: '1',
          name: data.name,
          email: data.email,
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-12345'
      }
    };
  },

  login: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      data: {
        user: {
          id: '1',
          name: 'Test User',
          email: data.email,
          createdAt: new Date().toISOString()
        },
        token: 'mock-jwt-token-12345'
      }
    };
  },

  createLog: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: {
        id: Date.now().toString(),
        date: data.date,
        mood: data.mood,
        emoji: data.emoji,
        intensity: data.intensity,
        note: data.note,
        createdAt: new Date().toISOString()
      }
    };
  },

  getDashboard: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          createdAt: new Date().toISOString()
        },
        stats: {
          currentStreak: 3,
          longestStreak: 7,
          totalLogs: 15,
          lastLogDate: new Date().toISOString().split('T')[0]
        },
        badges: [
          {
            id: '1',
            badgeId: '1',
            name: 'Beginner',
            icon: '🌱',
            unlocked: true,
            description: 'Started your journey',
            unlockedAt: new Date().toISOString()
          },
          {
            id: '2',
            badgeId: '2',
            name: '3-Day Streak',
            icon: '🔥',
            unlocked: true,
            description: 'Logged 3 days in a row',
            unlockedAt: new Date().toISOString()
          }
        ],
        recentLogs: [
          {
            id: '1',
            date: new Date().toISOString().split('T')[0],
            mood: 'happy',
            emoji: '😊',
            intensity: 80,
            note: 'Great day today!',
            createdAt: new Date().toISOString()
          }
        ]
      }
    };
  },

  getJournal: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      success: true,
      data: [
        {
          id: '1',
          date: new Date().toISOString().split('T')[0],
          mood: 'happy',
          emoji: '😊',
          intensity: 80,
          note: 'Great day today! Had a wonderful meeting with friends.',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
          mood: 'calm',
          emoji: '😌',
          intensity: 65,
          note: 'Quiet evening, worked on some personal projects.',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 2,
        pages: 1
      }
    };
  }
};

// Mock data for trends
export const mockMoodLogs = [
  {
    id: '1',
    date: new Date().toISOString().split('T')[0],
    mood: 'happy',
    emoji: '😊',
    intensity: 80,
    note: 'Great day!',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    mood: 'calm',
    emoji: '😌',
    intensity: 70,
    note: 'Relaxing day',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3',
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    mood: 'energized',
    emoji: '🤩',
    intensity: 90,
    note: 'Full of energy!',
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];
