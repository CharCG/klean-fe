import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import TabToggle from '../../components/common/TabToggle';
import Button from '../../components/common/Button';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import SkeletonCard from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatOrderId } from '../../utils/formatId';
import { formatDate } from '../../utils/formatDate';
import { List, ChevronLeft } from 'lucide-react';
import type { OrderStatus } from '../../types';

const TABS = [{ key: 'ACTIVE', label: 'Active' }, { key: 'PAST', label: 'Completed' }];
const FLOW: OrderStatus[] = ['PROCESSING', 'FINISHED'];

export default function MerchantOrders() {
  const [tab, setTab] = useState('ACTIVE');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const qc = useQueryClient();

  const { data: orders, isLoading } = useQuery({ queryKey: ['merchantOrders'], queryFn: () => api.getMerchantOrders() });

  const statusMut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.updateOrderStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['merchantOrders'] }); showToast('Status updated', 'success'); },
    onError: () => showToast('Failed to update', 'error'),
  });

  const activeStatuses = ['CREATED', 'PROCESSING', 'FINISHED'];
  const filtered = (orders || []).filter((o) => tab === 'ACTIVE' ? activeStatuses.includes(o.status) : ['COMPLETED', 'FAILED'].includes(o.status));

  const nextStatus = (status: OrderStatus): OrderStatus | null => { const i = FLOW.indexOf(status); return i >= 0 && i < FLOW.length - 1 ? FLOW[i + 1] : null; };

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Orders" />
      <div className="px-6 pt-4"><TabToggle tabs={TABS} activeTab={tab} onTabChange={setTab} /></div>
      <div className="px-6 pt-4 flex flex-col gap-4">
        {isLoading ? <><SkeletonCard /><SkeletonCard /></> : filtered.length === 0 ? <EmptyState icon={List} title="No orders" /> : filtered.map((order) => {
          const next = nextStatus(order.status);
          return (
            <div key={order.id} className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
              <div onClick={() => navigate(`/merchant/orders/${order.id}`)} className="cursor-pointer">
                <div className="flex justify-between items-start mb-3 pb-3" style={{ borderBottom: '1px solid var(--color-stroke)' }}>
                  <div>
                    <h4 className="font-semibold text-sm flex items-center gap-1" style={{ color: 'var(--color-text)' }}>{order.customer?.name || 'Customer'} <ChevronLeft size={14} className="rotate-180" style={{ color: 'var(--color-text-tertiary)' }} /></h4>
                    <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{formatOrderId(order.id)} • {formatDate(order.createdAt)}</span>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="text-sm mb-2 line-clamp-1" style={{ color: 'var(--color-text-secondary)' }}>{order.items.map((i) => <span key={i.id} className="mr-2 font-medium">{i.quantity}x {i.name}</span>)}</div>
                <div className="flex justify-between items-center mt-3"><span className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{formatCurrency(order.total)}</span>{activeStatuses.includes(order.status) && <span className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>ETA: {order.estimationTime}</span>}</div>
              </div>
              {tab === 'ACTIVE' && next && (
                <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-stroke)' }}>
                  <Button
                    onClick={(e) => { e.stopPropagation(); statusMut.mutate({ id: order.id, status: next }); }}
                    variant="secondary"
                    fullWidth
                    size="sm"
                    isLoading={statusMut.isPending}
                  >
                    Set to {next}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
