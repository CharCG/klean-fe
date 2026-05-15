import { memo } from 'react';
import { cn } from '../../utils/cn';

interface TabToggleProps {
  tabs: { key: string; label: string }[];
  activeTab: string;
  onTabChange: (key: string) => void;
}

const TabToggle = memo(({ tabs, activeTab, onTabChange }: TabToggleProps) => (
  <div className="flex p-1 rounded-xl" style={{ backgroundColor: 'var(--color-stroke)' }}>
    {tabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onTabChange(tab.key)}
        className={cn(
          'flex-1 py-2 text-sm font-bold rounded-lg transition-all duration-200 cursor-pointer',
          activeTab !== tab.key && 'opacity-60 grayscale-[0.5]'
        )}
        style={{
          backgroundColor: activeTab === tab.key ? 'var(--color-primary)' : 'transparent',
          color: activeTab === tab.key ? 'var(--color-primary-light)' : 'var(--color-text-secondary)',
          boxShadow: activeTab === tab.key ? '0 2px 8px rgba(var(--color-primary-rgb), 0.15)' : 'none',
        }}
      >
        {tab.label}
      </button>
    ))}
  </div>
));

TabToggle.displayName = 'TabToggle';
export default TabToggle;
