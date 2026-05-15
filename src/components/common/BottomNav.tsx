import { memo, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface NavItem {
  path: string;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  items: NavItem[];
}

const BottomNav = memo(({ items }: BottomNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = useCallback(
    (path: string) => {
      // For base paths, only exact match
      if (['/', '/merchant', '/admin'].includes(path)) {
        return location.pathname === path;
      }
      return location.pathname === path || location.pathname.startsWith(path + '/');
    },
    [location.pathname]
  );

  return (
    <div className="absolute bottom-0 w-full z-30 px-4 pb-4">
      <nav
        className="bg-card/80 backdrop-blur-lg border border-stroke flex justify-between items-center px-4 py-1.5 rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
      >
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all cursor-pointer',
                active
                  ? 'text-primary bg-primary-light/80 scale-[1.02]'
                  : 'text-text-secondary hover:text-text'
              )}
            >
              <item.icon size={22} strokeWidth={active ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
});

BottomNav.displayName = 'BottomNav';
export default BottomNav;
