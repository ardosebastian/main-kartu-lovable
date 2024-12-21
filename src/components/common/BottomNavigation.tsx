import React, { useState } from 'react';
import { GamepadIcon, BookOpenIcon, UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState<'game' | 'tutorial' | 'profile'>('game');

  const menuItems = [
    {
      icon: GamepadIcon,
      label: 'Game',
      value: 'game',
      href: '/game'
    },
    {
      icon: BookOpenIcon,
      label: 'Tutorial',
      value: 'tutorial',
      href: '/tutorial'
    },
    {
      icon: UserIcon,
      label: 'Profile',
      value: 'profile',
      href: '/profile'
    }
  ];

  const handleMenuClick = (item: typeof menuItems[number]) => {
    setActiveMenu(item.value as "game" | "tutorial" | "profile");
    navigate(item.href);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm shadow-[0_-2px_4px_rgba(0,0,0,0.1)] z-50 md:hidden">
      <div className="flex justify-around py-4 px-4">
        {menuItems.map((item) => (
          <button
            key={item.value}
            onClick={() => handleMenuClick(item)}
            className={cn(
              "flex flex-col items-center justify-center text-gray-500 hover:text-pink-400",
              activeMenu === item.value ? "text-pink-600" : ""
            )}
          >
            <item.icon 
              className={cn(
                "w-[26px] h-[26px] mb-1"
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
