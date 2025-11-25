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

export type Screen = 'login' | 'onboarding' | 'home' | 'log' | 'feedback' | 'trends' | 'profile' | 'streaks' | 'motivational' | 'journal';

export interface MoodLog {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  intensity: number;
  note?: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<UserType | null>(null);
  const [streakCount, setStreakCount] = useState(0);
  const [lastMoodLogged, setLastMoodLogged] = useState<MoodLog | null>(null);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);

  const getInitialBadges = (): Badge[] => [
    { id: '1', name: 'Beginner', icon: '🌱', unlocked: true, description: 'Started your journey' },
    { id: '2', name: '3-Day Streak', icon: '🔥', unlocked: false, description: 'Logged 3 days in a row' },
    { id: '3', name: '7-Day Streak', icon: '⭐', unlocked: false, description: 'Log 7 days in a row' },
    { id: '4', name: '30-Day Streak', icon: '🏆', unlocked: false, description: 'Log 30 days in a row' },
    { id: '5', name: 'Mood Master', icon: '💎', unlocked: false, description: 'Log 100 moods' },
  ];

  const [badges, setBadges] = useState<Badge[]>(getInitialBadges());

  const [darkMode, setDarkMode] = useState(false);

  // Check for existing logged-in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('mindlink_current_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      loadUserData(parsedUser.id);
      setCurrentScreen('home');
    }
  }, []);

  // Helper function to format date as YYYY-MM-DD (local time, not UTC)
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate streak based on consecutive days of logging
  const calculateStreak = (logs: MoodLog[]): number => {
    if (logs.length === 0) return 0;
    
    // Get unique dates and sort them in descending order (most recent first)
    const uniqueDates = [...new Set(logs.map(log => log.date))].sort((a, b) => {
      const dateA = new Date(a + 'T00:00:00');
      const dateB = new Date(b + 'T00:00:00');
      return dateB.getTime() - dateA.getTime();
    });
    
    if (uniqueDates.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = formatLocalDate(today);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = formatLocalDate(yesterday);
    
    // Check if the most recent log is today or yesterday
    const mostRecentDate = uniqueDates[0];
    if (mostRecentDate !== todayStr && mostRecentDate !== yesterdayStr) {
      return 0; // Streak broken if last log wasn't today or yesterday
    }
    
    // Count consecutive days starting from today or yesterday
    let streak = 0;
    let checkDate = new Date(mostRecentDate === todayStr ? today : yesterday);
    const dateSet = new Set(uniqueDates);
    
    // Count backwards from the most recent log date
    while (true) {
      const dateStr = formatLocalDate(checkDate);
      if (dateSet.has(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    return streak;
  };

  // Load user-specific data from localStorage
  const loadUserData = (userId: string) => {
    const storedLogs = localStorage.getItem(`mindlink_logs_${userId}`);
    let logs: MoodLog[] = [];
    if (storedLogs) {
      logs = JSON.parse(storedLogs);
      setMoodLogs(logs);
    }
    
    // Calculate streak from actual logs instead of stored value
    const calculatedStreak = calculateStreak(logs);
    setStreakCount(calculatedStreak);
    
    // Load badges or initialize
    const storedBadges = localStorage.getItem(`mindlink_badges_${userId}`);
    if (storedBadges) {
      setBadges(JSON.parse(storedBadges));
    } else {
      // Initialize badges for new user
      setBadges(getInitialBadges());
    }
  };

  // Save user-specific data to localStorage
  const saveUserData = (userId: string) => {
    localStorage.setItem(`mindlink_logs_${userId}`, JSON.stringify(moodLogs));
    localStorage.setItem(`mindlink_streak_${userId}`, streakCount.toString());
    localStorage.setItem(`mindlink_badges_${userId}`, JSON.stringify(badges));
  };

  const handleLogin = (loggedInUser: UserType) => {
    setUser(loggedInUser);
    loadUserData(loggedInUser.id);
    setCurrentScreen('onboarding');
  };

  const handleLogout = () => {
    if (user) {
      saveUserData(user.id);
    }
    localStorage.removeItem('mindlink_current_user');
    setUser(null);
    setMoodLogs([]);
    setStreakCount(0);
    setCurrentScreen('login');
  };

  const handleMoodSubmit = (mood: string, emoji: string, intensity: number, note?: string) => {
    if (!user) return;
    
    // Get local date in YYYY-MM-DD format (not UTC)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const localDate = `${year}-${month}-${day}`;
    
    const newLog: MoodLog = {
      id: Date.now().toString(),
      date: localDate,
      mood,
      emoji,
      intensity,
      note,
    };
    const updatedLogs = [...moodLogs, newLog];
    setMoodLogs(updatedLogs);
    setLastMoodLogged(newLog);
    
    // Calculate streak from actual logs
    const newStreak = calculateStreak(updatedLogs);
    setStreakCount(newStreak);
    
    // Save to localStorage
    localStorage.setItem(`mindlink_logs_${user.id}`, JSON.stringify(updatedLogs));
    localStorage.setItem(`mindlink_streak_${user.id}`, newStreak.toString());
    
    // Unlock badges based on streak and total logs
    setBadges(prevBadges => {
      const updatedBadges = prevBadges.map(b => {
        if (b.id === '2' && newStreak >= 3) return { ...b, unlocked: true };
        if (b.id === '3' && newStreak >= 7) return { ...b, unlocked: true };
        if (b.id === '4' && newStreak >= 30) return { ...b, unlocked: true };
        if (b.id === '5' && updatedLogs.length >= 100) return { ...b, unlocked: true };
        return b;
      });
      
      // Save badges to localStorage
      localStorage.setItem(`mindlink_badges_${user.id}`, JSON.stringify(updatedBadges));
      
      return updatedBadges;
    });
    
    setCurrentScreen('feedback');
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
        return <TrendsScreen moodLogs={moodLogs} />;
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