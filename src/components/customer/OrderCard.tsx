import { memo } from 'react';
import { ChevronRight, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import Button from '../common/Button';
import type { Order } from '../../types';
import OrderStatusBadge from '../common/OrderStatusBadge';
import { formatOrderId } from '../../utils/formatId';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

const STATUS_BORDER: Record<string, string> = {
  CREATED: 'var(--color-primary)',
  PROCESSING: 'var(--color-primary)',
  FINISHED: 'var(--color-primary)',
  COMPLETED: 'var(--color-success)',
  FAILED: 'var(--color-danger)',
};

const OrderCard = memo(({ order, onClick }: OrderCardProps) => {
  const qc = useQueryClient();
  const { showToast } = useToast();

  const confirmMut = useMutation({
    mutationFn: () => api.confirmOrderReceived(order.id),
    onSuccess: () => {
      showToast('Order marked as completed!', 'success');
      qc.invalidateQueries({ queryKey: ['customerOrders'] });
      qc.invalidateQueries({ queryKey: ['order', order.id] });
    },
    onError: () => showToast('Failed to confirm', 'error'),
  });

  return (
    <div
      onClick={onClick}
      className="bg-card rounded-xl p-4 border border-stroke relative overflow-hidden cursor-pointer active:bg-bg transition-colors"
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: STATUS_BORDER[order.status] || 'var(--color-stroke-medium)' }}
      />

      <div className="flex justify-between items-start mb-3 pb-3 border-b border-stroke pl-2">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-text text-sm">
              {order.merchant?.name || 'Merchant'}
            </h4>
            <ChevronRight size={14} className="text-text-tertiary" />
          </div>
          <span className="text-[10px] text-text-tertiary font-medium">
            {formatOrderId(order.id)} • {formatDate(order.createdAt)}
          </span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="text-sm text-text-secondary mb-2 pl-2 line-clamp-1">
        {order.items.map((i) => (
          <span key={i.id} className="font-medium mr-2">
            {i.quantity}x {i.name}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center pl-2 mt-3">
        <span className="font-semibold text-text text-sm">
          {formatCurrency(order.total)}
        </span>
        {['CREATED', 'PROCESSING', 'FINISHED'].includes(order.status) && (
          <span className="text-xs font-semibold text-primary">
            ETA: {order.estimationTime || 'Pending'}
          </span>
        )}
      </div>

      {order.status === 'FINISHED' && (
        <div className="mt-4 pt-4 border-t border-stroke px-2">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              confirmMut.mutate();
            }}
            isLoading={confirmMut.isPending}
            variant="warning"
            fullWidth
            size="sm"
          >
            <CheckCircle2 size={16} className="mr-2" />
            Order Received
          </Button>
        </div>
      )}
    </div>
  );
});

OrderCard.displayName = 'OrderCard';
export default OrderCard;
