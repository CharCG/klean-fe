import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TopBar from '../../components/common/TopBar';
import ProfileRow from '../../components/common/ProfileRow';
import ToggleRow from '../../components/common/ToggleRow';
import Button from '../../components/common/Button';
import { User, Moon, LogOut, Store, Globe } from 'lucide-react';

export default function CustomerProfile() {
  const { user, logout, mode, setMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleModeChange = (m: string) => {
    setMode(m as 'CUSTOMER' | 'MERCHANT' | 'ADMIN');
    if (m === 'MERCHANT') navigate('/merchant');
  };

  return (
    <div className="flex flex-col h-full bg-bg pb-24 overflow-y-auto">
      <TopBar title="Profile" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{user?.name}</h2>
            <p className="text-sm text-text-secondary">{user?.email}</p>
          </div>
        </div>



        <h3 className="font-bold text-text text-[15px] px-1 mb-3 mt-2 uppercase tracking-wide">Account</h3>
        <div className="bg-card rounded-2xl overflow-hidden mb-6 border border-stroke">
          <ProfileRow icon={User} label="Edit Profile" onClick={() => navigate('/edit-profile')} />
          {user?.role === 'MERCHANT' && (
            <ToggleRow
              icon={Globe}
              label="Merchant Mode"
              isActive={mode === 'MERCHANT'}
              onToggle={() => handleModeChange(mode === 'MERCHANT' ? 'CUSTOMER' : 'MERCHANT')}
              showBorder={false}
            />
          )}
          {user?.role === 'CUSTOMER' && (
            <ProfileRow icon={Store} label="Become a Merchant" onClick={() => navigate('/register-merchant')} />
          )}
        </div>

        <h3 className="font-bold text-text text-[15px] px-1 mb-3 uppercase tracking-wide">Preferences</h3>
        <div className="bg-card rounded-2xl overflow-hidden mb-6 border border-stroke">
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
