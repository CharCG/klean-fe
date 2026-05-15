import { useNavigate } from 'react-router-dom';
import { Search, Store } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import ActiveOrderCard from '../../components/customer/ActiveOrderCard';
import MerchantCard from '../../components/customer/MerchantCard';
import SkeletonCard from '../../components/common/SkeletonCard';

export default function CustomerHome() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: api.getCustomerOrders,
  });

  const { data: merchantsData, isLoading: merchantsLoading } = useQuery({
    queryKey: ['merchants'],
    queryFn: () => api.getMerchants(),
  });

  const activeOrders = orders?.filter((o) =>
    ['CREATED', 'PROCESSING', 'FINISHED'].includes(o.status)
  ) || [];
  const recentOrder = activeOrders[0];

  const pastOrders = orders?.filter((o) => o.status === 'COMPLETED') || [];
  const recentMerchantIds = [...new Set(pastOrders.map((o) => o.merchantId))];
  const allMerchants = merchantsData?.merchants || [];
  const recentMerchants = recentMerchantIds
    .map((id) => allMerchants.find((m) => m.id === id))
    .filter(Boolean);

  return (
    <div className="flex flex-col h-full bg-bg overflow-y-auto pb-24">
      <div className="bg-primary px-6 pt-12 h-[168px] rounded-b-[2rem] flex-shrink-0">
        <h2 className="text-white text-2xl font-semibold mb-1">
          Hi, {user?.name?.split(' ')[0]}!
        </h2>
        <p className="text-primary-light text-sm opacity-90">Ready to get your laundry done?</p>
      </div>

      <div className="px-6 -mt-8 relative z-10">
        {ordersLoading ? (
          <SkeletonCard />
        ) : recentOrder ? (
          <ActiveOrderCard order={recentOrder} onClick={() => navigate(`/orders/${recentOrder.id}`)} />
        ) : (
          <div
            onClick={() => navigate('/explore')}
            className="bg-card rounded-2xl p-5 mb-6 shadow-sm border border-stroke flex items-center justify-between cursor-pointer active:scale-[0.98] transition-transform"
          >
            <div>
              <h3 className="font-semibold text-text mb-1">
                No active orders
              </h3>
              <p className="text-xs text-text-secondary">
                Tap to explore nearby merchants
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary-light border border-primary-light flex items-center justify-center text-primary">
              <Search size={18} />
            </div>
          </div>
        )}

        <h3 className="font-semibold text-text text-lg mb-4 mt-2">
          {recentMerchants.length > 0 ? 'Recently Bought' : 'Available Merchants'}
        </h3>

        <div className="flex flex-col gap-4">
          {merchantsLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : recentMerchants.length > 0 ? (
            recentMerchants.map((merchant) =>
              merchant ? (
                <MerchantCard
                  key={merchant.id}
                  merchant={merchant}
                  onClick={() => navigate(`/merchants/${merchant.id}`)}
                />
              ) : null
            )
          ) : allMerchants.length > 0 ? (
            allMerchants.slice(0, 5).map((merchant) => (
              <MerchantCard
                key={merchant.id}
                merchant={merchant}
                onClick={() => navigate(`/merchants/${merchant.id}`)}
              />
            ))
          ) : (
            <div className="bg-card rounded-xl p-6 text-center border border-stroke">
              <Store size={32} className="text-text-tertiary mx-auto mb-2" />
              <p className="text-sm text-text-secondary">
                No merchants available yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
