import { memo } from "react";
import type { OrderStatus } from "../../types";

const STATUS_CONFIG: Record<OrderStatus, { bg: string; text: string; border: string }> = {
  CREATED: {
    bg: "rgba(var(--color-primary-rgb), 0.12)",
    text: "var(--color-primary)",
    border: "rgba(var(--color-primary-rgb), 0.3)",
  },
  PROCESSING: {
    bg: "rgba(var(--color-primary-rgb), 0.12)",
    text: "var(--color-primary)",
    border: "rgba(var(--color-primary-rgb), 0.3)",
  },
  FINISHED: {
    bg: "rgba(var(--color-primary-rgb), 0.12)",
    text: "var(--color-primary)",
    border: "rgba(var(--color-primary-rgb), 0.3)",
  },
  COMPLETED: {
    bg: "rgba(var(--color-success-rgb), 0.12)",
    text: "var(--color-success)",
    border: "rgba(var(--color-success-rgb), 0.3)",
  },
  FAILED: { bg: "rgba(239, 68, 68, 0.12)", text: "var(--color-danger)", border: "rgba(239, 68, 68, 0.3)" },
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

OrderStatusBadge.displayName = "OrderStatusBadge";
export default OrderStatusBadge;
