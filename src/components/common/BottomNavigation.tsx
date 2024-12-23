import React, { useState } from 'react';
import { BookOpenIcon, UserIcon, HeartIcon, HelpCircleIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeMenu, setActiveMenu] = useState<'tutorial' | 'profile' | 'main-cepat'>('main-cepat');

  const menuItems = [
    {
      icon: <HeartIcon className="h-6 w-6" />,
      label: 'play',
      value: 'main-cepat',
      href: '/main-cepat',
    },
    {
      icon: <HelpCircleIcon className="h-6 w-6" />,
      label: 'Tutorial',
      value: 'tutorial',
      href: '/tutorial',
    },
    {
      icon: <UserIcon className="h-6 w-6" />,
      label: 'Profil',
      value: 'profile',
      href: '/profile',
    }
  ];

  const handleMenuClick = (item: typeof menuItems[number]) => {
    setActiveMenu(item.value as "tutorial" | "profile" | "main-cepat");
    navigate(item.href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="grid grid-cols-3 h-20">
        {menuItems.map((item, index) => (
          <button
            key={item.value}
            onClick={() => handleMenuClick(item)}
            className={cn(
              "flex flex-col items-center justify-center gap-2 text-gray-500 transition-colors",
              location.pathname === item.href ? "text-pink-600" : ""
            )}
          >
            <div className="w-6 h-6">
              {item.icon}
            </div>
            <span className="text-xs font-medium leading-none">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export { BottomNavigation };
