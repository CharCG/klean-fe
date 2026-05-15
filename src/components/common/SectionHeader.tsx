import { memo } from 'react';
import Button from './Button';

interface SectionHeaderProps {
  title: string;
  action?: { label: string; onClick: () => void };
}

const SectionHeader = memo(({ title, action }: SectionHeaderProps) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
      {title}
    </h3>
    {action && (
      <Button
        onClick={action.onClick}
        variant="ghost"
        size="sm"
        className="!p-0 !h-auto !text-primary hover:!bg-transparent hover:!opacity-80"
      >
        {action.label}
      </Button>
    )}
  </div>
));

SectionHeader.displayName = 'SectionHeader';
export default SectionHeader;
