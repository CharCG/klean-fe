import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import TabToggle from '../../components/common/TabToggle';
import OrderCard from '../../components/customer/OrderCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { List } from 'lucide-react';

const TABS = [
  { key: 'ACTIVE', label: 'Active' },
  { key: 'PAST', label: 'Completed' },
];

export default function CustomerOrders() {
  const [tab, setTab] = useState('ACTIVE');
  const navigate = useNavigate();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['customerOrders'],
    queryFn: api.getCustomerOrders,
  });

  const activeStatuses = ['CREATED', 'PROCESSING', 'FINISHED'];
  const pastStatuses = ['COMPLETED', 'FAILED'];

  const filtered = (orders || []).filter((o) =>
    tab === 'ACTIVE' ? activeStatuses.includes(o.status) : pastStatuses.includes(o.status)
  );

  return (
    <div className="flex flex-col h-full bg-bg pb-24 overflow-y-auto">
      <TopBar title="Orders" />
      <div className="px-6 pt-4">
        <TabToggle tabs={TABS} activeTab={tab} onTabChange={setTab} />
      </div>
      <div className="px-6 pt-4 flex flex-col gap-4">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filtered.length === 0 ? (
          <EmptyState icon={List} title={`No ${tab.toLowerCase()} orders`} description="Your orders will appear here." />
        ) : (
          filtered.map((order) => (
            <OrderCard key={order.id} order={order} onClick={() => navigate(`/orders/${order.id}`)} />
          ))
        )}
      </div>
    </div>
  );
}
