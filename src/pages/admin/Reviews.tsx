import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, Trash2 } from 'lucide-react';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import SkeletonCard from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/common/Button';

export default function AdminReviews() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const { data: reviews, isLoading } = useQuery({ queryKey: ['reviews'], queryFn: api.getReviews });
  const delMut = useMutation({ mutationFn: (id: string) => api.deleteReview(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['reviews'] }); showToast('Deleted', 'success'); }, onError: () => showToast('Failed', 'error') });

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Reviews" />
      <div className="p-6 flex flex-col gap-4">
        {isLoading ? <><SkeletonCard /><SkeletonCard /></> : (reviews || []).length === 0 ? <EmptyState title="No reviews found" /> : (reviews || []).map((r) => (
          <div key={r.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
            <div className="flex justify-between items-start mb-3">
              <div><h4 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{r.user?.name || 'User'}</h4><p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>Merchant: {r.merchant?.name || 'N/A'} • {formatDate(r.createdAt)}</p></div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--color-warning-light)', border: '1px solid var(--color-warning)' }}><Star size={12} className="fill-yellow-500 text-yellow-500" /><span className="text-xs font-bold" style={{ color: 'var(--color-warning)' }}>{r.rating}</span></div>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-secondary)' }}>"{r.comment}"</p>
            <div className="flex justify-end pt-3" style={{ borderTop: '1px solid var(--color-stroke)' }}>
              <Button onClick={() => delMut.mutate(r.id)} isLoading={delMut.isPending} variant="danger" size="sm" className="gap-1.5"><Trash2 size={14} /> Delete</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
