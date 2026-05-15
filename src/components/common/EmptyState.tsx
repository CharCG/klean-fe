import { memo } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Package } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

const EmptyState = memo(({ icon: Icon = Package, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <Icon size={48} style={{ color: 'var(--color-text-tertiary)' }} />
    <h3 className="font-semibold mt-4 text-base" style={{ color: 'var(--color-text)' }}>
      {title}
    </h3>
    {description && (
      <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
        {description}
      </p>
    )}
    {action && (
      <Button
        onClick={action.onClick}
        variant="ghost"
        size="sm"
        className="mt-4 !text-primary hover:!bg-primary/5"
      >
        {action.label}
      </Button>
    )}
  </div>
));

EmptyState.displayName = 'EmptyState';
export default EmptyState;
