import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TopBar from '../../components/common/TopBar';
import ToggleRow from '../../components/common/ToggleRow';
import { Moon, LogOut } from 'lucide-react';
import Button from '../../components/common/Button';

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Profile" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ backgroundColor: 'var(--color-primary-light)', border: '2px solid var(--color-primary)', color: 'var(--color-primary)' }}>{user?.name?.charAt(0) || 'A'}</div>
          <div><h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{user?.name || 'Admin'}</h2><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{user?.email}</p></div>
        </div>
        <h3 className="font-semibold text-sm px-1 mb-3 mt-2" style={{ color: 'var(--color-text)' }}>Preferences</h3>
        <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
          <ToggleRow icon={Moon} label="Appearance" isActive={theme === 'dark'} onToggle={toggleTheme} showBorder={false} />
        </div>

        <Button
          type="button"
          onClick={logout}
          variant="danger"
          fullWidth
          className="mt-4 gap-2"
        >
          <LogOut size={18} /> Log Out
        </Button>
      </div>
    </div>
  );
}
