import { memo, type ReactNode } from 'react';

interface MetricCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  className?: string;
}

const MetricCard = memo(({ icon, value, label, className }: MetricCardProps) => (
  <div className={`bg-card rounded-xl p-4 border border-stroke ${className || ''}`}>
    <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center text-primary mb-2">
      {icon}
    </div>
    <h3 className="text-text text-xl font-semibold mt-1">{value}</h3>
    <p className="text-text-secondary text-xs font-medium mt-0.5">{label}</p>
  </div>
));

MetricCard.displayName = 'MetricCard';
export default MetricCard;
