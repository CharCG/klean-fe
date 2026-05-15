import { memo } from 'react';
import type { OrderStatus } from '../../types';

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  CREATED: { bg: 'var(--color-primary-light)', text: 'var(--color-primary-dark)', border: 'var(--color-primary)' },
  PROCESSING: { bg: 'var(--color-primary-light)', text: 'var(--color-primary-dark)', border: 'var(--color-primary)' },
  FINISHED: { bg: 'var(--color-primary-light)', text: 'var(--color-primary-dark)', border: 'var(--color-primary)' },
  COMPLETED: { bg: 'var(--color-success-light)', text: 'var(--color-success)', border: 'var(--color-success)' },
  FAILED: { bg: 'var(--color-danger-light)', text: 'var(--color-danger)', border: 'var(--color-danger)' },
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = memo(({ status }: OrderStatusBadgeProps) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase"
      style={{
        backgroundColor: cfg.bg,
        color: cfg.text,
        border: `1px solid ${cfg.border}`,
      }}
    >
      {status}
    </span>
  );
});

OrderStatusBadge.displayName = 'OrderStatusBadge';
export default OrderStatusBadge;
