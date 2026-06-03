import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Button from '../../components/common/Button';
import axios from 'axios';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = form.get('email') as string;
    const password = form.get('password') as string;

    setLoading(true);
    try {
      await login(email, password);
      showToast('Logged in successfully', 'success');
    } catch (err) {
      showToast(
        axios.isAxiosError(err) ? err.response?.data?.message ?? 'Invalid credentials' : 'Something went wrong',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center h-full px-6 bg-card">
      <div className="mb-8 text-center">
        <img src="/logo.svg" alt="Klean" className="h-16 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-text tracking-tight">
          Welcome to Klean
        </h1>
        <p className="text-sm mt-1 text-text-secondary font-medium">
          Smart Laundry Marketplace
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">
            Email Address
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-2xl px-4 py-4 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-bg border border-stroke text-text"
          />
        </div>
        <div>
          <label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-2xl px-4 py-4 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-bg border border-stroke text-text"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          fullWidth
          className="mt-4"
        >
          {loading ? 'Logging in...' : 'Log In'}
        </Button>
      </form>

      <div className="mt-8 text-center text-[15px] text-text-secondary font-medium">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-bold text-primary hover:text-primary-dark transition-colors">
          Register now
        </Link>
      </div>
    </div>
  );
}
