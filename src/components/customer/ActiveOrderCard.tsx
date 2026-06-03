import { memo } from 'react';
import { Package, Clock } from 'lucide-react';
import type { Order } from '../../types';
import OrderStatusBadge from '../common/OrderStatusBadge';
import { formatOrderId } from '../../utils/formatId';

interface ActiveOrderCardProps {
  order: Order;
  onClick: () => void;
}

const ActiveOrderCard = memo(({ order, onClick }: ActiveOrderCardProps) => (
  <div
    onClick={onClick}
    className="bg-card rounded-2xl p-5 mb-6 border border-stroke relative overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
  >
    {/* <div className="absolute top-0 left-0 w-1.5 h-full bg-primary"></div> */}
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-text flex items-center gap-2">
          <Package size={18} className="text-primary" /> Active Order
        </h3>
        <p className="text-sm font-medium text-text mt-1">{order.merchant?.name || 'Merchant'}</p>
        <p className="text-xs text-text-tertiary">Order {formatOrderId(order.id)}</p>
      </div>
      <OrderStatusBadge status={order.status} />
    </div>

    <div className="bg-bg rounded-xl p-3 flex items-center justify-between border border-stroke mt-4">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-primary" />
        <span className="text-xs font-semibold text-text">Est. Completion</span>
      </div>
      <span className="text-sm font-bold text-primary">{order.estimationTime || 'Pending'}</span>
    </div>
  </div>
));

ActiveOrderCard.displayName = 'ActiveOrderCard';
export default ActiveOrderCard;
