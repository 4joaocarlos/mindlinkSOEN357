import React, { useState, useEffect } from 'react';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen, User as UserType } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { MoodLoggingScreen } from './components/MoodLoggingScreen';
import { FeedbackScreen } from './components/FeedbackScreen';
import { StreaksScreen } from './components/StreaksScreen';
import { TrendsScreen } from './components/TrendsScreen';
import { MotivationalScreen } from './components/MotivationalScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { JournalScreen } from './components/JournalScreen';
import { BottomNav } from './components/BottomNav';
import { userAPI, authAPI, User, Badge, UserStats } from './utils/api';

export type Screen = 'login' | 'onboarding' | 'home' | 'log' | 'feedback' | 'trends' | 'profile' | 'streaks' | 'motivational' | 'journal';

export interface MoodLog {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  intensity: number;
  note?: string;
}

// Using Badge type from API utils

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<UserType | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [lastMoodLogged, setLastMoodLogged] = useState<MoodLog | null>(null);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);

  const [badges, setBadges] = useState<Badge[]>([]);

  const [darkMode, setDarkMode] = useState(false);

  // Check for existing logged-in user on mount
  useEffect(() => {
    const token = localStorage.getItem('mindlink_token');
    const storedUser = localStorage.getItem('mindlink_current_user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        loadUserData(parsedUser.id);
        setCurrentScreen('home');
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('mindlink_token');
        localStorage.removeItem('mindlink_current_user');
      }
    }
  }, []);


  // Load user-specific data from backend
  const loadUserData = async (userId: string) => {
    try {
      // Load dashboard data which includes stats, badges, and recent logs
      const dashboardResponse = await userAPI.getDashboard();
      if (dashboardResponse.success && dashboardResponse.data) {
        const { stats, badges: userBadges, recentLogs } = dashboardResponse.data;

        setStreakCount(stats.currentStreak);
        setBadges(userBadges);
        setMoodLogs(recentLogs); // Load recent logs for display
      } else {
        console.error('Failed to load dashboard data');
        // Fallback to initial data
        setStreakCount(0);
        setBadges(getInitialBadges());
        setMoodLogs([]);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Fallback to initial data
      setStreakCount(0);
      setBadges(getInitialBadges());
      setMoodLogs([]);
    }
  };

  const handleLogin = (loggedInUser: UserType) => {
    setUser(loggedInUser);
    loadUserData(loggedInUser.id);
    setCurrentScreen('onboarding');
  };

  const handleLogout = () => {
    localStorage.removeItem('mindlink_token');
    localStorage.removeItem('mindlink_current_user');
    setUser(null);
    setMoodLogs([]);
    setStreakCount(0);
    setBadges(getInitialBadges());
    setCurrentScreen('login');
  };

  const handleMoodSubmit = async (mood: string, emoji: string, intensity: number, note?: string) => {
    if (!user) return;

    try {
      // Get local date in YYYY-MM-DD format (not UTC)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const localDate = `${year}-${month}-${day}`;

      // Create mood log via API
      const response = await moodAPI.createLog({
        date: localDate,
        mood,
        emoji,
        intensity,
        note
      });

      if (response.success && response.data) {
        const newLog = response.data;
        setLastMoodLogged(newLog);

        // Reload user data to get updated stats and badges
        await loadUserData(user.id);

        setCurrentScreen('feedback');
      } else {
        console.error('Failed to create mood log:', response.message);
        // Could show error to user here
      }
    } catch (error) {
      console.error('Error submitting mood:', error);
      // Could show error to user here
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'onboarding':
        return <OnboardingScreen onGetStarted={() => setCurrentScreen('home')} />;
      case 'home':
        return (
          <HomeScreen
            userName={user?.name || null}
            streakCount={streakCount}
            onLogMood={() => setCurrentScreen('log')}
            onViewStreaks={() => setCurrentScreen('streaks')}
            onViewMotivational={() => setCurrentScreen('motivational')}
            onViewJournal={() => setCurrentScreen('journal')}
          />
        );
      case 'log':
        return <MoodLoggingScreen onSubmit={handleMoodSubmit} onBack={() => setCurrentScreen('home')} />;
      case 'feedback':
        return (
          <FeedbackScreen
            mood={lastMoodLogged}
            streakCount={streakCount}
            onBackToHome={() => setCurrentScreen('home')}
          />
        );
      case 'streaks':
        return (
          <StreaksScreen
            streakCount={streakCount}
            badges={badges}
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'trends':
        return <TrendsScreen />;
      case 'motivational':
        return <MotivationalScreen onBack={() => setCurrentScreen('home')} />;
      case 'profile':
        return (
          <ProfileScreen 
            user={user}
            darkMode={darkMode} 
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onLogout={handleLogout}
            totalLogs={moodLogs.length}
            streakCount={streakCount}
            badgeCount={badges.filter(b => b.unlocked).length}
          />
        );
      case 'journal':
        return <JournalScreen moodLogs={moodLogs} onBack={() => setCurrentScreen('home')} />;
      default:
        return null;
    }
  };

  const showBottomNav = !['login', 'onboarding', 'feedback', 'streaks', 'motivational', 'journal'].includes(currentScreen);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[390px] h-[844px] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col relative">
        <div className="flex-1 overflow-y-auto">
          {renderScreen()}
        </div>
        {showBottomNav && (
          <BottomNav
            currentScreen={currentScreen}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        )}
      </div>
    </div>
  );
}