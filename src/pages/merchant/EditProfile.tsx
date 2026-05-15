import { type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import TopBar from '../../components/common/TopBar';
import Button from '../../components/common/Button';
import PageSkeleton from '../../components/common/PageSkeleton';
import axios from 'axios';

export default function EditMerchantProfile() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: m, isLoading } = useQuery({ queryKey: ['merchantProfile'], queryFn: api.getMerchantProfile });
  const mut = useMutation({ mutationFn: (d: Parameters<typeof api.updateMerchantProfile>[0]) => api.updateMerchantProfile(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['merchantProfile'] }); showToast('Saved', 'success'); navigate(-1); }, onError: (e) => showToast(axios.isAxiosError(e) ? e.response?.data?.message ?? 'Failed' : 'Error', 'error') });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); const f = new FormData(e.currentTarget); mut.mutate({ businessPhone: f.get('businessPhone') as string, address: f.get('address') as string, businessDescription: f.get('businessDescription') as string, openTime: f.get('openTime') as string, closeTime: f.get('closeTime') as string }); };

  if (isLoading) return <PageSkeleton />;
  const inputCls = "w-full rounded-2xl px-4 py-4 text-[15px] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors border border-stroke bg-bg text-text";
  const disCls = "w-full rounded-2xl px-4 py-4 text-[15px] focus:outline-none transition-colors border border-stroke bg-stroke text-text-tertiary cursor-not-allowed";

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-bg">
      <TopBar title="Edit Business Profile" showBack />
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <section className="rounded-2xl p-5 bg-card border border-stroke shadow-sm">
          <h3 className="font-bold text-[15px] mb-4 pb-3 text-text border-b border-stroke">Business Information</h3>
          <div className="space-y-4">
            <div><label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">Owner Name</label><input defaultValue={user?.name} readOnly disabled className={disCls} /></div>
            <div><label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">Business Name</label><input defaultValue={m?.name} readOnly disabled className={disCls} /></div>
            <div><label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">Business Phone</label><input name="businessPhone" defaultValue={m?.businessPhone} required className={inputCls} /></div>
            <div><label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">Business Email</label><input defaultValue={m?.businessEmail} readOnly disabled className={disCls} /></div>
            <div><label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">Address</label><textarea name="address" defaultValue={m?.address} required rows={2} className={inputCls + ' resize-none'} /></div>
            <div><label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">Description</label><textarea name="businessDescription" defaultValue={m?.businessDescription} required rows={2} className={inputCls + ' resize-none'} /></div>
          </div>
        </section>
        <section className="rounded-2xl p-5 bg-card border border-stroke shadow-sm">
          <h3 className="font-bold text-[15px] mb-4 pb-3 text-text border-b border-stroke">Hours</h3>
          <div className="flex gap-4"><div className="flex-1"><label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">Open</label><input name="openTime" type="time" defaultValue={m?.openTime} required className={inputCls} /></div><div className="flex-1"><label className="text-xs font-semibold mb-1.5 block text-text-secondary uppercase tracking-wide">Close</label><input name="closeTime" type="time" defaultValue={m?.closeTime} required className={inputCls} /></div></div>
        </section>
        <Button type="submit" isLoading={mut.isPending} variant="primary" fullWidth>
          Save Settings
        </Button>
      </form>
    </div>
  );
}
