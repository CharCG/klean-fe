import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star, Store, Clock, Minus, Plus, ShoppingBag } from 'lucide-react';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import SkeletonCard from '../../components/common/SkeletonCard';
import ErrorState from '../../components/common/ErrorState';
import { formatCurrency } from '../../utils/formatCurrency';
import type { CartItem, Service } from '../../types';

export default function MerchantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  const { data: merchant, isLoading, isError, refetch } = useQuery({
    queryKey: ['merchant', id],
    queryFn: () => api.getMerchantById(id!),
    enabled: !!id,
  });

  const addToCart = (svc: Service) => {
    setCart((prev) => {
      const ex = prev.find((c) => c.id === svc.id);
      if (ex) return prev.map((c) => (c.id === svc.id ? { ...c, qty: c.qty + 1 } : c));
      return [...prev, { ...svc, merchantId: id!, merchantName: merchant?.name || '', qty: 1 }];
    });
  };

  const updateQty = (sid: string, d: number) => {
    setCart((p) => p.map((c) => (c.id === sid ? { ...c, qty: c.qty + d } : c)).filter((c) => c.qty > 0));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const count = cart.reduce((s, c) => s + c.qty, 0);

  if (isLoading) return <div className="p-6 space-y-4"><SkeletonCard /><SkeletonCard /></div>;
  if (isError || !merchant) return <ErrorState onRetry={refetch} />;

  return (
    <div className="flex flex-col h-full overflow-y-auto relative bg-bg">
      <TopBar title={merchant.name} showBack />
      <div className="px-6 pt-4 pb-6">
        <div className="rounded-2xl p-5 bg-card border border-stroke shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary-light text-primary">
              <Store size={28} />
            </div>
            <div>
              <h2 className="font-bold text-[18px] text-text tracking-tight">{merchant.name}</h2>
              <div className="flex items-center gap-3 mt-1 text-xs font-semibold text-text-secondary uppercase tracking-wide">
                <span className="flex items-center gap-1"><Star size={12} className="fill-yellow-500 text-yellow-500" />{merchant.rating.toFixed(1)}</span>
                <span className="flex items-center gap-1"><Clock size={12} />{merchant.openTime} - {merchant.closeTime}</span>
              </div>
            </div>
          </div>
          {merchant.businessDescription && <p className="text-[14px] leading-relaxed text-text-secondary font-medium">{merchant.businessDescription}</p>}
        </div>
      </div>
      <div className="px-6 pb-28">
        <h3 className="font-bold text-[18px] tracking-tight mb-4 text-text">Services</h3>
        <div className="flex flex-col gap-4">
          {merchant.services?.filter((s) => s.isAvailable).map((svc) => {
            const inCart = cart.find((c) => c.id === svc.id);
            return (
              <div key={svc.id} className="rounded-2xl p-5 bg-card border border-stroke shadow-sm">
                <div className="flex justify-between items-start">
                  <div className="flex-1 mr-4">
                    <h4 className="font-bold text-[15px] text-text">{svc.name}</h4>
                    {svc.description && <p className="text-[13px] font-medium mt-1.5 line-clamp-2 text-text-secondary">{svc.description}</p>}
                    <p className="font-bold text-[15px] mt-2.5 text-primary">{formatCurrency(svc.price)} <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">/ {svc.unit.toLowerCase()}</span></p>
                  </div>
                  {!inCart ? (
                    <Button onClick={() => addToCart(svc)} variant="secondary" className="!py-2 !px-4 !rounded-xl !text-[13px] !tracking-normal">Add</Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => updateQty(svc.id, -1)}
                        variant="outline"
                        size="sm"
                        className="!w-9 !h-9 !p-0 !rounded-xl !border-stroke"
                      >
                        <Minus size={16} />
                      </Button>
                      <span className="text-[15px] font-bold w-6 text-center text-text">{inCart.qty}</span>
                      <Button
                        onClick={() => updateQty(svc.id, 1)}
                        variant="secondary"
                        size="sm"
                        className="!w-9 !h-9 !p-0 !rounded-xl"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {count > 0 && (
        <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe bg-gradient-to-t from-bg via-bg to-transparent pt-8">
          <Button onClick={() => navigate('/checkout', { state: { cart, merchantId: id, merchantName: merchant.name } })} variant="primary" fullWidth className="justify-between !px-6">
            <div className="flex items-center gap-2.5"><ShoppingBag size={20} /><span className="font-bold text-[15px]">{count} items</span></div>
            <span className="font-bold text-[16px]">{formatCurrency(total)}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
