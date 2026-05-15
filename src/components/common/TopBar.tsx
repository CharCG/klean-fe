import { memo, type ReactNode } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';

interface TopBarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
}

const TopBar = memo(({ title, showBack, onBack, rightAction }: TopBarProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <div className="bg-card px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {showBack && (
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="!w-8 !h-8 !p-0 !rounded-full !bg-bg !text-text-secondary hover:!bg-stroke-medium"
          >
            <ChevronLeft size={20} />
          </Button>
        )}
        <h1 className="font-semibold text-lg text-text">{title}</h1>
      </div>
      {rightAction && <div>{rightAction}</div>}
    </div>
  );
});

TopBar.displayName = 'TopBar';
export default TopBar;
