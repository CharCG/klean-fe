import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import * as api from '../../services/api';
import PageSkeleton from '../../components/common/PageSkeleton';

export default function PaymentFinish() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    const orderId = searchParams.get('order_id');

    const finish = async () => {
      if (orderId) {
        try {
          await api.verifyPayment(orderId);
        } catch {
        }
      }
      navigate(orderId ? `/orders/${orderId}` : '/orders', { replace: true });
    };

    finish();
  }, [navigate, searchParams]);

  return <PageSkeleton />;
}
