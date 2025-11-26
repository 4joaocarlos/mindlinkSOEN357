import React, { useState } from 'react';
import { ArrowLeft, Save, User, Mail } from 'lucide-react';
import { userAPI } from '../utils/api';
import { User as UserType } from './LoginScreen';

interface EditProfileScreenProps {
  user: UserType | null;
  onBack: () => void;
  onProfileUpdated: (user: UserType) => void;
}

const avatarOptions = ['😊', '🤩', '😌', '😎', '🧠'];

export function EditProfileScreen({ user, onBack, onProfileUpdated }: EditProfileScreenProps) {
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || avatarOptions[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    setError('');
    setSaving(true);
    try {
      const response = await userAPI.updateProfile(name.trim(), avatar);
      if (response.success && response.data) {
        const updatedUser = response.data as UserType;
        localStorage.setItem('mindlink_current_user', JSON.stringify(updatedUser));
        onProfileUpdated(updatedUser);
      } else {
        setError(response.message || 'Unable to save profile');
      }
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="p-6 pt-16 flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-white/50 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-800">
          Edit Profile
        </h1>
      </div>

      <div className="flex-1 px-6 pb-6 overflow-y-auto">
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-4">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center text-3xl">
              {avatar || '🙂'}
            </div>
            <div>
              <p className="text-gray-500 text-sm">Profile emoji</p>
              <p className="text-gray-800 font-semibold">Choose one you like</p>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {avatarOptions.map((option) => (
              <button
                key={option}
                onClick={() => setAvatar(option)}
                className={`p-3 rounded-2xl text-2xl transition-all bg-gradient-to-br from-white to-gray-50 border ${
                  avatar === option
                    ? 'border-purple-400 shadow-lg scale-105'
                    : 'border-gray-100 hover:shadow-md'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-lg space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 rounded-full p-2">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-1">Display name</p>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-50 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-purple-300 text-gray-800"
                placeholder="Your name"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-600 text-sm mb-1">Email (read-only)</p>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-gray-100 rounded-2xl px-4 py-3 text-gray-500"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-sm text-center">
              {error}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl transition-transform hover:scale-[1.01] active:scale-[0.98] shadow-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-70"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
