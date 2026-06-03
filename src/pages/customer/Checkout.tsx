import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MapPin, Truck, Map, Package, Banknote, CreditCard } from 'lucide-react';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import { cn } from '../../utils/cn';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import type { CartItem, FulfillmentType } from '../../types';
import axios from 'axios';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const qc = useQueryClient();
  const { cart, merchantId } = (location.state || {}) as { cart: CartItem[]; merchantId: string; merchantName: string };
  const [fulfillment, setFulfillment] = useState<FulfillmentType>('DELIVERY');
  const [payment, setPayment] = useState('QRIS');
  const [notes, setNotes] = useState('');

  const subtotal = cart?.reduce((sum, item) => sum + (item.price * item.qty), 0) || 0;
  const deliveryFee = fulfillment === 'DELIVERY' ? 15000 : 0;
  const total = subtotal + deliveryFee;

  const mutation = useMutation({
    mutationFn: () => api.createOrder({ merchantId, fulfillment, notes: notes || undefined, items: cart.map((c) => ({ serviceId: c.id, quantity: c.qty })) }),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['customerOrders'] });
      showToast('Order placed successfully!', 'success');
      const snapToken = data.payment?.snapToken;
      const orderId = data.order.id;
      if (snapToken && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: async () => {
            await api.verifyPayment(orderId);
            qc.invalidateQueries({ queryKey: ['customerOrders'] });
            navigate(`/orders/${orderId}`, { replace: true });
          },
          onPending: async () => {
            await api.verifyPayment(orderId);
            navigate(`/orders/${orderId}`, { replace: true });
          },
          onError: () => navigate(`/orders/${orderId}`, { replace: true }),
          onClose: () => navigate(`/orders/${orderId}`, { replace: true }),
        });
      } else {
        navigate(`/orders/${orderId}`, { replace: true });
      }
    },
    onError: (err) => { showToast(axios.isAxiosError(err) ? err.response?.data?.message ?? 'Failed' : 'Something went wrong', 'error'); },
  });

  if (!cart?.length) { navigate('/explore', { replace: true }); return null; }

  const handlePlaceOrderClick = () => {
    if (window.confirm(`Are you sure you want to place this order for Rp ${total.toLocaleString()}?`)) {
      mutation.mutate();
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg relative overflow-y-auto">
      <TopBar title="Secure Checkout" showBack onBack={() => navigate(-1)} />

      <div className="p-6 space-y-6">
        <section className="bg-card rounded-xl border border-stroke p-4 shadow-sm">
          <h3 className="font-semibold text-text text-sm mb-2">Delivery Address</h3>
          <div className="flex items-start gap-3">
            <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
            <p className="text-text-secondary text-sm leading-relaxed font-medium">
              {user?.address || 'No address set. Update in profile.'}
            </p>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-text text-sm mb-3">Order Notes</h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="E.g., Please fold shirts individually, handle delicate fabric with care..."
            className="w-full bg-card border border-stroke rounded-xl p-4 text-sm focus:outline-none focus:border-primary transition-colors h-24 resize-none shadow-sm text-text"
          ></textarea>
        </section>

        <section>
          <h3 className="font-semibold text-text text-sm mb-3">Fulfillment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => setFulfillment('DELIVERY')}
              variant="outline"
              className={cn(
                '!p-4 !rounded-xl !border !text-left !flex !flex-col !gap-2 !transition-colors !shadow-sm !justify-start !items-start !h-auto !min-h-0 !font-normal !tracking-normal !bg-card !border-stroke !text-text',
                fulfillment === 'DELIVERY' && '!bg-primary-light !border-primary !text-primary-dark'
              )}
            >
              <Truck size={20} className={fulfillment === 'DELIVERY' ? 'text-primary' : 'text-text-tertiary'} />
              <div>
                <div className="font-semibold text-sm">Delivery</div>
                <div className="text-xs opacity-80 mt-0.5">Rp 15.000</div>
              </div>
            </Button>
            <Button
              onClick={() => setFulfillment('PICKUP')}
              variant="outline"
              className={cn(
                '!p-4 !rounded-xl !border !text-left !flex !flex-col !gap-2 !transition-colors !shadow-sm !justify-start !items-start !h-auto !min-h-0 !font-normal !tracking-normal !bg-card !border-stroke !text-text',
                fulfillment === 'PICKUP' && '!bg-primary-light !border-primary !text-primary-dark'
              )}
            >
              <Map size={20} className={fulfillment === 'PICKUP' ? 'text-primary' : 'text-text-tertiary'} />
              <div>
                <div className="font-semibold text-sm">Self Pickup</div>
                <div className="text-xs opacity-80 mt-0.5">Free</div>
              </div>
            </Button>
          </div>
        </section>

        <section>
          <h3 className="font-semibold text-text text-sm mb-3">Payment Method</h3>
          <div className="flex flex-col gap-2">
            {['QRIS', 'Credit Card', 'Cash'].map(method => (
              <label
                key={method}
                className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-colors shadow-sm ${payment === method ? 'border-primary bg-card' : 'border-stroke bg-card'
                  }`}
              >
                <div className="flex items-center gap-3">
                  {method === 'QRIS' ? (
                    <Package size={18} className={payment === method ? 'text-primary' : 'text-text-tertiary'} />
                  ) : method === 'Cash' ? (
                    <Banknote size={18} className={payment === method ? 'text-success' : 'text-text-tertiary'} />
                  ) : (
                    <CreditCard size={18} className={payment === method ? 'text-primary' : 'text-text-tertiary'} />
                  )}
                  <span className="text-sm font-semibold text-text">{method}</span>
                </div>
                <input
                  type="radio"
                  name="payment"
                  checked={payment === method}
                  onChange={() => setPayment(method)}
                  className="focus:outline-none"
                  style={{ accentColor: 'var(--color-primary)' }}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="bg-card rounded-xl border border-stroke p-5 shadow-sm">
          <h3 className="font-semibold text-text text-sm mb-4">Order Summary</h3>
          <div className="space-y-2">
            {cart.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <span className="text-text-secondary text-sm font-medium">{item.qty}x {item.name}</span>
                <span className="font-semibold text-text text-sm">Rp {(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-stroke flex justify-between items-center">
            <span className="text-text-secondary text-sm font-medium">Delivery Fee</span>
            <span className="font-semibold text-text text-sm">Rp {deliveryFee.toLocaleString()}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-stroke flex justify-between items-center">
            <span className="font-semibold text-text">Total</span>
            <span className="font-bold text-primary text-lg">Rp {total.toLocaleString()}</span>
          </div>
        </section>

        <Button
          onClick={handlePlaceOrderClick}
          isLoading={mutation.isPending}
          variant="primary"
          fullWidth
        >
          Place Order
        </Button>
      </div>
    </div>
  );
}

