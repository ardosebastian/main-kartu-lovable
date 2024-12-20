import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Gamepad2, 
  BookOpen, 
  User, 
} from 'lucide-react';

export const BottomNavigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { 
      icon: Gamepad2, 
      path: '/main', 
      label: 'Main' 
    },
    { 
      icon: BookOpen, 
      path: '/tutorial', 
      label: 'Tutorial' 
    },
    { 
      icon: User, 
      path: '/akun', 
      label: 'Akun' 
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="bg-white/80 backdrop-blur-sm shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] border-t border-gray-200 rounded-t-3xl">
        <div className="grid grid-cols-3 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center space-y-1 transition-all duration-300 ${
                  isActive 
                    ? 'text-pink-600 scale-110' 
                    : 'text-gray-500 hover:text-pink-400'
                }`}
              >
                <div className={`
                  p-2 rounded-full transition-all duration-300
                  ${isActive 
                    ? 'bg-pink-100 shadow-md' 
                    : 'hover:bg-pink-50'
                  }
                `}>
                  <Icon 
                    className={`h-6 w-6 transition-colors ${
                      isActive ? 'text-pink-600' : 'text-gray-500'
                    }`} 
                  />
                </div>
                <span className={`
                  text-xs transition-all duration-300 
                  ${isActive ? 'font-bold' : 'font-normal'}
                `}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
