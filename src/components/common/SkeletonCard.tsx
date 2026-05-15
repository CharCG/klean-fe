import { memo } from 'react';

const SkeletonCard = memo(() => (
  <div
    className="rounded-xl p-4 animate-pulse"
    style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}
  >
    <div className="flex gap-4 items-center">
      <div className="w-16 h-16 rounded-xl" style={{ backgroundColor: 'var(--color-stroke)' }} />
      <div className="flex-1 space-y-2">
        <div className="h-4 rounded-lg w-3/4" style={{ backgroundColor: 'var(--color-stroke)' }} />
        <div className="h-3 rounded-lg w-1/2" style={{ backgroundColor: 'var(--color-stroke)' }} />
        <div className="h-3 rounded-lg w-1/3" style={{ backgroundColor: 'var(--color-stroke)' }} />
      </div>
    </div>
  </div>
));

SkeletonCard.displayName = 'SkeletonCard';
export default SkeletonCard;
