import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface LoginScreenProps {
  onLogin: (user: User) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Normalize email for consistent comparison
  const normalizeEmail = (email: string): string => {
    return email.trim().toLowerCase();
  };

  // Simple in-memory storage simulation (in a real app, this would be a backend)
  const getStoredUsers = (): User[] => {
    try {
      const stored = localStorage.getItem('mindlink_users');
      if (!stored) return [];
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error reading users from localStorage:', error);
      return [];
    }
  };

  const saveUser = (user: User) => {
    try {
      const users = getStoredUsers();
      // Check if user already exists (prevent duplicates)
      const existingIndex = users.findIndex(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase());
      if (existingIndex >= 0) {
        users[existingIndex] = user; // Update existing
      } else {
        users.push(user); // Add new
      }
      localStorage.setItem('mindlink_users', JSON.stringify(users));
      console.log('User saved:', user.email, 'Total users:', users.length);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      // Sign up logic
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all fields');
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const users = getStoredUsers();
      const existingUser = users.find(u => normalizeEmail(u.email) === normalizedEmail);
      
      if (existingUser) {
        setError('An account with this email already exists');
        return;
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        email: normalizedEmail,
        createdAt: new Date().toISOString(),
      };

      // Store user and password (in a real app, password would be hashed)
      try {
        saveUser(newUser);
        localStorage.setItem(`mindlink_password_${newUser.id}`, password);
        localStorage.setItem('mindlink_current_user', JSON.stringify(newUser));
        
        // Verify it was saved
        const verifyUsers = getStoredUsers();
        const verifyUser = verifyUsers.find(u => u.email === newUser.email);
        if (!verifyUser) {
          setError('Failed to save account. Please try again.');
          return;
        }
        
        console.log('Account created successfully:', newUser.email);
        onLogin(newUser);
      } catch (error) {
        console.error('Error creating account:', error);
        setError('Failed to create account. Please try again.');
      }
    } else {
      // Login logic
      if (!email.trim() || !password.trim()) {
        setError('Please enter your email and password');
        return;
      }

      const normalizedEmail = normalizeEmail(email);
      const users = getStoredUsers();
      const user = users.find(u => normalizeEmail(u.email) === normalizedEmail);
      
      console.log('Login attempt:', normalizedEmail, 'Total users:', users.length, 'Users:', users.map(u => u.email));
      
      if (!user) {
        setError('No account found with this email. Please sign up first.');
        return;
      }

      const storedPassword = localStorage.getItem(`mindlink_password_${user.id}`);
      if (storedPassword !== password) {
        setError('Incorrect password');
        return;
      }

      localStorage.setItem('mindlink_current_user', JSON.stringify(user));
      onLogin(user);
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-4xl">🧠</span>
          </div>
          <h1 className="text-gray-800 mb-2">
            MindLink
          </h1>
          <p className="text-gray-600">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="bg-white rounded-2xl p-4 shadow-md">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-purple-500" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 outline-none text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Mail className="w-5 h-5 text-purple-500" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-5 h-5 text-purple-500" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="flex-1 outline-none text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-2xl text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98] shadow-lg font-semibold flex items-center justify-center gap-2"
          >
            {isSignUp ? (
              <>
                <UserPlus className="w-5 h-5" />
                Create Account
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign Up and Login */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setName('');
              setEmail('');
              setPassword('');
            }}
            className="text-purple-600 hover:text-purple-700 transition-colors"
          >
            {isSignUp ? (
              <>Already have an account? <span className="font-semibold">Sign In</span></>
            ) : (
              <>Don't have an account? <span className="font-semibold">Sign Up</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

