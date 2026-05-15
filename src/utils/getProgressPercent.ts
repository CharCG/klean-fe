import type { OrderStatus } from '../types';

const ORDER_PROGRESS: Record<OrderStatus, number> = {
  CREATED: 0,
  PROCESSING: 33,
  FINISHED: 66,
  COMPLETED: 100,
  FAILED: 0,
};

export const getProgressPercent = (status: OrderStatus): number =>
  ORDER_PROGRESS[status] ?? 0;
