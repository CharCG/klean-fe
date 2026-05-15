import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/api';
import MerchantCard from '../../components/customer/MerchantCard';
import SkeletonCard from '../../components/common/SkeletonCard';

export default function Explore() {
  const [search, setSearch] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['merchants'],
    queryFn: () => api.getMerchants(),
  });

  const merchants = (data?.merchants || []).filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-bg overflow-y-auto pb-24">
      <div className="bg-primary px-6 pt-12 h-[168px] rounded-b-[2rem] flex-shrink-0">
        <h2 className="text-primary-light text-sm font-medium opacity-90">Deliver To</h2>
        <div className="flex items-center mt-1">
          <MapPin size={18} className="text-white mr-1 flex-shrink-0" />
          <span className="text-white font-semibold text-base truncate pr-4">
            {user?.address || 'Set your delivery address'}
          </span>
        </div>
      </div>

      <div className="px-6 -mt-8 relative z-10">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 text-text-tertiary" size={18} />
          <input
            type="text"
            placeholder="Search laundry nearby..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-stroke rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:border-primary transition-colors shadow-sm text-text"
          />
        </div>

        <h3 className="font-semibold text-text mb-4 mt-6 text-lg">
          Top Rated Near You
        </h3>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : merchants.length === 0 ? (
            <p className="text-center text-sm py-10 text-text-tertiary">
              No merchants found.
            </p>
          ) : (
            merchants.map((merchant) => (
              <MerchantCard
                key={merchant.id}
                merchant={merchant}
                onClick={() => navigate(`/merchants/${merchant.id}`)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
