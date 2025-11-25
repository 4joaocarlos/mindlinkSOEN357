import React from 'react';
import { Home, PlusCircle, TrendingUp, User } from 'lucide-react';
import { Screen } from '../App';

interface BottomNavProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const navItems = [
    { id: 'home' as Screen, icon: Home, label: 'Home' },
    { id: 'log' as Screen, icon: PlusCircle, label: 'Log' },
    { id: 'trends' as Screen, icon: TrendingUp, label: 'Trends' },
    { id: 'profile' as Screen, icon: User, label: 'Profile' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-4 safe-area-bottom">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="flex flex-col items-center gap-1 min-w-[60px] transition-transform active:scale-95"
            >
              <div className={`${
                isActive 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white' 
                  : 'text-gray-400'
              } p-2.5 rounded-2xl transition-all`}>
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`transition-colors ${
                isActive ? 'text-purple-600' : 'text-gray-400'
              }`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
