import { type FormEvent } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import axios from 'axios';

export default function EditProfile() {
  const { user, updateUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const profileMut = useMutation({ mutationFn: (d: { name: string; phone: string; address: string }) => api.updateProfile(d), onSuccess: (d) => { updateUser({ name: d.name }); showToast('Profile updated', 'success'); navigate(-1); }, onError: (e) => showToast(axios.isAxiosError(e) ? e.response?.data?.message ?? 'Failed' : 'Error', 'error') });
  const passMut = useMutation({ mutationFn: (d: { oldPassword: string; newPassword: string }) => api.changePassword(d), onSuccess: () => { showToast('Password changed', 'success'); navigate(-1); }, onError: (e) => showToast(axios.isAxiosError(e) ? e.response?.data?.message ?? 'Failed' : 'Error', 'error') });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const old = f.get('oldPassword') as string; const np = f.get('newPassword') as string; const cp = f.get('confirmPassword') as string;
    if (old || np || cp) { if (np !== cp) { showToast('Passwords do not match', 'error'); return; } passMut.mutate({ oldPassword: old, newPassword: np }); }
    profileMut.mutate({ name: f.get('name') as string, phone: f.get('phone') as string, address: f.get('address') as string });
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg">
      <TopBar title="Edit Profile" showBack />
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <section className="rounded-2xl p-5 bg-card border border-stroke">
          <h3 className="font-bold text-[15px] mb-4 pb-3 text-text border-b border-stroke">Personal Information</h3>
          <div className="space-y-4">
            {[
              {n:'name',l:'Full Name',v:user?.name,ph:user?.name || 'Your full name'},
              {n:'email',l:'Email',v:user?.email,dis:true,ph:user?.email || ''},
              {n:'phone',l:'Phone',v:'',ph:user?.phone || 'Your phone number'},
              {n:'address',l:'Address',v:'',ph:user?.address || 'Your delivery address'},
            ].map(f=>(
              <div key={f.n}>
                <label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">{f.l}</label>
                <input name={f.n} defaultValue={f.v||''} placeholder={f.ph} readOnly={f.dis} disabled={f.dis} required={!f.dis} className={`w-full rounded-2xl px-4 py-4 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors border border-stroke ${f.dis ? 'bg-stroke text-text-tertiary cursor-not-allowed' : 'bg-bg text-text'}`} />
              </div>
            ))}
          </div>
        </section>
        
        <section className="rounded-2xl p-5 bg-card border border-stroke">
          <h3 className="font-bold text-[15px] mb-4 pb-3 text-text border-b border-stroke">Change Password</h3>
          <div className="space-y-4">
            {['oldPassword','newPassword','confirmPassword'].map(n=>(
              <div key={n}>
                <label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">{n.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase())}</label>
                <input name={n} type="password" className="w-full rounded-2xl px-4 py-4 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-bg border border-stroke text-text" />
              </div>
            ))}
          </div>
        </section>
        
        <Button type="submit" isLoading={profileMut.isPending || passMut.isPending} variant="primary" fullWidth>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
