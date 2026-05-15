import { memo } from 'react';
import { Star } from 'lucide-react';
import type { Review } from '../../types';

interface ReviewFeedCardProps {
  review: Review;
}

const ReviewFeedCard = memo(({ review }: ReviewFeedCardProps) => (
  <div
    className="rounded-xl p-4"
    style={{
      backgroundColor: 'var(--color-card)',
      border: '1px solid var(--color-stroke)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}
  >
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
        {review.user?.name || 'Customer'}
      </span>
      <div className="flex items-center gap-1">
        <Star size={12} className="fill-yellow-500 text-yellow-500" />
        <span className="text-xs font-semibold">{review.rating}</span>
      </div>
    </div>
    <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
      &quot;{review.comment}&quot;
    </p>
  </div>
));

ReviewFeedCard.displayName = 'ReviewFeedCard';
export default ReviewFeedCard;
