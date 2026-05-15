import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import TopBar from '../../components/common/TopBar';
import ProfileRow from '../../components/common/ProfileRow';
import ToggleRow from '../../components/common/ToggleRow';
import { Store, Globe, Moon, LogOut } from 'lucide-react';
import Button from '../../components/common/Button';

export default function MerchantProfile() {
  const { user, logout, mode, setMode } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleModeChange = (m: string) => {
    setMode(m as 'CUSTOMER' | 'MERCHANT' | 'ADMIN');
    if (m === 'CUSTOMER') navigate('/');
  };
  const { data: merchant } = useQuery({ queryKey: ['merchantProfile'], queryFn: api.getMerchantProfile });

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Profile" />
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: 'var(--color-primary-light)', border: '2px solid var(--color-primary)', color: 'var(--color-primary)' }}>{merchant?.name?.substring(0, 2) || 'M'}</div>
          <div><h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{merchant?.name || user?.name}</h2><p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{merchant?.businessEmail || user?.email}</p></div>
        </div>

        <h3 className="font-semibold text-sm px-1 mb-3 mt-2" style={{ color: 'var(--color-text)' }}>Account</h3>
        <div className="rounded-xl overflow-hidden mb-6" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
          <ProfileRow icon={Store} label="Edit Business Profile" onClick={() => navigate('/merchant/edit-profile')} />
          <ToggleRow
            icon={Globe}
            label="Merchant Mode"
            isActive={mode === 'MERCHANT'}
            onToggle={() => handleModeChange(mode === 'MERCHANT' ? 'CUSTOMER' : 'MERCHANT')}
            showBorder={false}
          />
        </div>

        <h3 className="font-semibold text-sm px-1 mb-3" style={{ color: 'var(--color-text)' }}>Preferences</h3>
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
