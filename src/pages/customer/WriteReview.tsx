import { useState, type FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import { useToast } from '../../context/ToastContext';
import SkeletonCard from '../../components/common/SkeletonCard';
import axios from 'axios';

export default function WriteReview() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => api.getOrderById(orderId!),
    enabled: !!orderId,
  });

  const mutation = useMutation({
    mutationFn: (commentText: string) => api.createReview(orderId!, { rating, comment: commentText }),
    onSuccess: () => {
      showToast('Review submitted!', 'success');
      qc.invalidateQueries({ queryKey: ['order', orderId] });
      qc.invalidateQueries({ queryKey: ['customerOrders'] });
      navigate(-1);
    },
    onError: (err) => { showToast(axios.isAxiosError(err) ? err.response?.data?.message ?? 'Failed' : 'Error', 'error'); },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.trim()) mutation.mutate(comment);
  };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-card)' }}>
      <TopBar title="Write Review" showBack onBack={() => navigate(-1)} />

      {isLoading ? (
        <div className="p-6"><SkeletonCard /></div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col">
          <h3 className="font-semibold text-lg mb-1" style={{ color: 'var(--color-text)' }}>{order?.merchant?.name || 'Merchant'}</h3>
          <p className="text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>Order {order?.id}</p>

          <div className="flex gap-2 justify-center mb-8">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} type="button" onClick={() => setRating(s)} className="cursor-pointer">
                <Star size={36} className={s <= rating ? 'fill-yellow-500 text-yellow-500' : ''} style={{ color: s > rating ? 'var(--color-stroke-medium)' : undefined }} />
              </button>
            ))}
          </div>

          <textarea
            name="comment"
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the service?"
            className="w-full rounded-xl p-4 text-sm h-32 resize-none mb-6 focus:outline-none transition-colors shadow-sm"
            style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', color: 'var(--color-text)' }}
          />

          <Button
            type="submit" 
            isLoading={mutation.isPending} 
            variant="secondary"
            fullWidth
            className="mt-auto"
          >
            Submit Review
          </Button>
        </form>
      )}
    </div>
  );
}
