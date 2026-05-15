import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronLeft, User } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import * as api from '../../services/api';
import axios from 'axios';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = form.get('password') as string;
    const confirmPassword = form.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    setLoading(true);
    try {
      await api.register({
        name: form.get('name') as string,
        email: form.get('email') as string,
        password,
        phone: form.get('phone') as string,
        address: form.get('address') as string || 'Set your delivery address',
      });
      showToast('Registration successful! Please log in.', 'success');
      navigate('/login');
    } catch (err) {
      showToast(
        axios.isAxiosError(err) ? err.response?.data?.message ?? 'Registration failed' : 'Something went wrong',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-card">
      <div className="absolute top-4 left-4 z-10">
        <Button
          onClick={() => navigate('/login')}
          variant="ghost"
          size="sm"
          className="!p-2 !rounded-full text-text-tertiary hover:!text-text hover:!bg-bg"
        >
          <ChevronLeft size={24} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-6 py-12 overflow-y-auto">
        <div className="mb-8 text-center mt-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-primary shadow-[0_4px_14px_0_rgba(var(--color-primary-rgb),0.39)]">
            <User className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-text tracking-tight">
            Create Account
          </h1>
          <p className="text-sm mt-1 text-text-secondary font-medium">
            Join Klean as a Customer
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {[
            { name: 'name', label: 'Full Name', type: 'text' },
            { name: 'phone', label: 'Phone Number', type: 'tel' },
            { name: 'email', label: 'Email Address', type: 'email' },
            { name: 'address', label: 'Delivery Address', type: 'text' },
            { name: 'password', label: 'Password', type: 'password' },
            { name: 'confirmPassword', label: 'Confirm Password', type: 'password' },
          ].map((field) => (
            <div key={field.name}>
              <label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">
                {field.label}
              </label>
              <input
                name={field.name}
                type={field.type}
                required
                minLength={field.type === 'password' ? 8 : undefined}
                className="w-full rounded-2xl px-4 py-4 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-bg border border-stroke text-text"
              />
            </div>
          ))}

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            fullWidth
            className="mt-4"
          >
            {loading ? 'Creating account...' : 'Register'}
          </Button>
        </form>

        <div className="mt-8 text-center text-[15px] pb-8 text-text-secondary font-medium">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
