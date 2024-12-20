import React, { useState } from 'react';
import { GamepadIcon, BookOpenIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<'game' | 'tutorial' | 'profile'>('game');

  const menuItems = [
    {
      icon: GamepadIcon,
      label: 'Game',
      value: 'game'
    },
    {
      icon: BookOpenIcon,
      label: 'Tutorial',
      value: 'tutorial'
    },
    {
      icon: UserIcon,
      label: 'Profile',
      value: 'profile'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-[0_-2px_4px_rgba(0,0,0,0.1)] z-50 md:hidden">
      <div className="flex justify-around py-3 px-4">
        {menuItems.map((item) => (
          <button
            key={item.value}
            onClick={() => setActiveMenu(item.value as any)}
            className={cn(
              "flex flex-col items-center justify-center transition-all duration-300 ease-in-out transform hover:scale-110",
              activeMenu === item.value 
                ? "text-pink-600 scale-110" 
                : "text-gray-500 hover:text-pink-400"
            )}
          >
            <item.icon 
              className={cn(
                "w-6 h-6 mb-1",
                activeMenu === item.value ? "animate-bounce" : ""
              )}
            />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export { BottomNavigation };
