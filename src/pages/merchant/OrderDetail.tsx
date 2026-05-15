import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import OrderStatusBadge from '../../components/common/OrderStatusBadge';
import Button from '../../components/common/Button';
import PageSkeleton from '../../components/common/PageSkeleton';
import StepTimeline from '../../components/common/StepTimeline';
import ErrorState from '../../components/common/ErrorState';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatOrderId } from '../../utils/formatId';
import { formatDate } from '../../utils/formatDate';
import { useToast } from '../../context/ToastContext';
import { useState } from 'react';
import type { OrderStatus } from '../../types';
import { Package, Clock, Truck, CheckCircle } from 'lucide-react';

// Merchants advance: PROCESSING → FINISHED only.
// FINISHED → COMPLETED is triggered by the customer ("Order Received").
const FLOW: OrderStatus[] = ['PROCESSING', 'FINISHED'];

export default function MerchantOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [eta, setEta] = useState('');

  const { data: order, isLoading, isError, refetch } = useQuery({ queryKey: ['order', id], queryFn: () => api.getOrderById(id!), enabled: !!id });

  const statusMut = useMutation({ mutationFn: (s: string) => api.updateOrderStatus(id!, s), onSuccess: () => { qc.invalidateQueries({ queryKey: ['order', id] }); qc.invalidateQueries({ queryKey: ['merchantOrders'] }); showToast('Status updated', 'success'); }, onError: () => showToast('Failed', 'error') });
  const etaMut = useMutation({ mutationFn: (t: string) => api.updateOrderEta(id!, t), onSuccess: () => { qc.invalidateQueries({ queryKey: ['order', id] }); showToast('ETA updated', 'success'); setEta(''); }, onError: () => showToast('Failed', 'error') });

  if (isLoading) return <PageSkeleton />;
  if (isError || !order) return <ErrorState onRetry={refetch} />;

  const currentIdx = FLOW.indexOf(order.status as OrderStatus);
  const nextStatus: OrderStatus | null = currentIdx >= 0 && currentIdx < FLOW.length - 1 ? FLOW[currentIdx + 1] : null;

  const orderSteps = [
    { status: 'CREATED', label: 'Order Created', icon: <Package size={16} /> },
    { status: 'PROCESSING', label: 'Processing', icon: <Clock size={16} /> },
    { status: 'FINISHED', label: 'Ready/Delivering', icon: <Truck size={16} /> },
    { status: 'COMPLETED', label: 'Completed', icon: <CheckCircle size={16} /> },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Order Details" showBack />
      <div className="p-6 space-y-5">
        <div className="rounded-xl p-5 flex items-center justify-between" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
          <div><span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>{formatOrderId(order.id)}</span><h2 className="font-semibold text-lg mt-1" style={{ color: 'var(--color-text)' }}>{order.customer?.name || 'Customer'}</h2><p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>{formatDate(order.createdAt)}</p></div>
          <OrderStatusBadge status={order.status} />
        </div>
        <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
          <h3 className="font-semibold text-sm mb-3 pb-2" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-stroke)' }}>Items</h3>
          {order.items.map((i) => (<div key={i.id} className="flex justify-between text-sm py-1"><span style={{ color: 'var(--color-text)' }}>{i.quantity}x {i.name}</span><span className="font-medium" style={{ color: 'var(--color-text)' }}>{formatCurrency(i.price * i.quantity)}</span></div>))}
          {order.fulfillment === 'DELIVERY' && (
            <div className="flex justify-between text-sm py-1">
              <span style={{ color: 'var(--color-text-secondary)' }}>Delivery Fee</span>
              <span className="font-medium" style={{ color: 'var(--color-text)' }}>{formatCurrency(15000)}</span>
            </div>
          )}
          <div className="flex justify-between pt-3 mt-2 font-semibold text-sm" style={{ borderTop: '1px solid var(--color-stroke)' }}><span>Total</span><span style={{ color: 'var(--color-primary)' }}>{formatCurrency(order.total)}</span></div>
        </div>
        <div className="rounded-xl p-5 space-y-2 text-sm" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
          <h3 className="font-semibold text-sm mb-3 pb-2" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-stroke)' }}>Details</h3>
          <p><span style={{ color: 'var(--color-text-secondary)' }}>Fulfillment:</span> <span className="font-medium">{order.fulfillment}</span></p>
          <p><span style={{ color: 'var(--color-text-secondary)' }}>ETA:</span> <span className="font-medium">{order.estimationTime}</span></p>
          <p><span style={{ color: 'var(--color-text-secondary)' }}>Phone:</span> <span className="font-medium">{order.customer?.phone}</span></p>
          {order.notes && <p><span style={{ color: 'var(--color-text-secondary)' }}>Notes:</span> <span className="font-medium">{order.notes}</span></p>}
        </div>
        {['CREATED', 'PROCESSING', 'FINISHED', 'COMPLETED'].includes(order.status) && (
          <StepTimeline currentStatus={order.status} steps={orderSteps} />
        )}
        {['PROCESSING', 'FINISHED'].includes(order.status) && (
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--color-text)' }}>Update ETA</h3>
            <div className="flex gap-3">
              <input value={eta} onChange={(e) => setEta(e.target.value)} placeholder="e.g. 2 hours" className="flex-1 rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', color: 'var(--color-text)' }} />
              <Button
                onClick={() => eta && etaMut.mutate(eta)}
                isLoading={etaMut.isPending}
                disabled={!eta}
                variant="secondary"
                size="sm"
                className="!px-6"
              >
                Set
              </Button>
            </div>
          </div>
        )}
        {nextStatus && FLOW.indexOf(order.status) >= 0 && (
          <Button
            onClick={() => statusMut.mutate(nextStatus)}
            isLoading={statusMut.isPending}
            variant="secondary"
            fullWidth
          >
            Set to {nextStatus}
          </Button>
        )}
      </div>
    </div>
  );
}
