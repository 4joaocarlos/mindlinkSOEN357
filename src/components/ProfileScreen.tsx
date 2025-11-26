import React from 'react';
import { User, Bell, Moon, Sun, ChevronRight } from 'lucide-react';
import { User as UserType } from './LoginScreen';

interface ProfileScreenProps {
  user: UserType | null;
  onLogout: () => void;
  totalLogs: number;
  streakCount: number;
  badgeCount: number;
  onEditProfile: () => void;
}

export function ProfileScreen({ user, onLogout, totalLogs, streakCount, badgeCount, onEditProfile }: ProfileScreenProps) {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="h-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col pb-24">
      {/* Header */}
      <div className="p-6 pt-16">
        <h1 className="text-gray-800">
          Profile & Settings
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-4xl">
              {user?.avatar ? user.avatar : <User className="w-10 h-10 text-white" />}
            </div>
            <div>
              <h2 className="text-gray-800 mb-1">
                {user?.name || 'User'}
              </h2>
              <p className="text-gray-500">
                Member since {user ? formatDate(user.createdAt) : 'N/A'}
              </p>
            </div>
          </div>
          <button
            onClick={onEditProfile}
            className="w-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 py-3 rounded-2xl hover:shadow-md transition-shadow"
          >
            Edit Profile
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl p-4 text-center">
            <p className="text-blue-800 mb-1">{totalLogs}</p>
            <p className="text-blue-600">Total Logs</p>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl p-4 text-center">
            <p className="text-green-800 mb-1">{streakCount}</p>
            <p className="text-green-600">Streak</p>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-4 text-center">
            <p className="text-purple-800 mb-1">{badgeCount}</p>
            <p className="text-purple-600">Badges</p>
          </div>
        </div>

        {/* Settings */}
        <div className="mb-4">
          <h3 className="text-gray-700 mb-3">
            Settings
          </h3>
        </div>

        <div className="bg-white rounded-3xl p-4 mb-4 shadow-md space-y-1">
          {/* Notifications */}
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-800">Notifications</p>
                <p className="text-gray-500">Daily reminder at 9pm</p>
              </div>
            </div>
            <button
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              className={`w-14 h-8 rounded-full transition-colors ${
                notificationsEnabled ? 'bg-purple-400' : 'bg-gray-300'
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
                  notificationsEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Theme toggle removed */}
        </div>

        {/* Additional Options */}
        <div className="space-y-3">
          <div className="bg-white rounded-3xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <span className="text-gray-800 font-medium">Privacy Policy</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              MindLink is built with MongoDB for secure data storage and designed in Figma. Passwords are protected with hashing and we do not share your information with other companies.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <span className="text-gray-800 font-medium">Help & Support</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Need help? In Canada you can call or text <span className="font-semibold text-gray-800">9-8-8: Suicide Crisis Helpline</span>.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <ChevronRight className="w-5 h-5 text-gray-400" />
              <span className="text-gray-800 font-medium">About MindLink</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              MindLink is part of the SOEN357 project, created for young users to build healthy reflection habits through mood logging, streaks, and supportive content.
            </p>
          </div>
        </div>

        {/* Logout Button */}
        <button 
          onClick={onLogout}
          className="w-full mt-6 bg-red-50 text-red-600 py-4 rounded-2xl hover:bg-red-100 transition-colors"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
