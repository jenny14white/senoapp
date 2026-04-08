import { Home, Receipt, Briefcase, Target, User } from 'lucide-react';
import { Link, useLocation } from 'react-router';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/expenses', icon: Receipt, label: 'Wydatki' },
  { path: '/work', icon: Briefcase, label: 'Praca' },
  { path: '/goals', icon: Target, label: 'Cele' },
  { path: '/profile', icon: User, label: 'Profil' },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t border-gray-200/20 dark:border-white/10 z-50"
      style={{ backgroundColor: 'var(--color-card-bg)' }}
    >
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex justify-around items-center">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive
                    ? 'text-[#797641] dark:text-[#9A7490]'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="w-6 h-6" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[10px] font-medium">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}