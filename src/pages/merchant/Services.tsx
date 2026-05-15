import { useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Button from '../../components/common/Button';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import ServiceCard from '../../components/merchant/ServiceCard';
import SkeletonCard from '../../components/common/SkeletonCard';
import EmptyState from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import type { Service, UnitType } from '../../types';
import axios from 'axios';

export default function MerchantServices() {
  const { showToast } = useToast();
  const qc = useQueryClient();
  const [formVisible, setFormVisible] = useState(false);
  const [editItem, setEditItem] = useState<Service | null>(null);

  const { data: services, isLoading } = useQuery({ queryKey: ['merchantServices'], queryFn: api.getMerchantServices });

  const createMut = useMutation({ mutationFn: (d: Omit<Service, 'id' | 'isAvailable'>) => api.createService(d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['merchantServices'] }); setFormVisible(false); showToast('Service added', 'success'); }, onError: (e) => showToast(axios.isAxiosError(e) ? e.response?.data?.message ?? 'Failed' : 'Error', 'error') });
  const updateMut = useMutation({ mutationFn: ({ id, ...d }: Partial<Service> & { id: string }) => api.updateService(id, d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['merchantServices'] }); setFormVisible(false); setEditItem(null); showToast('Service updated', 'success'); }, onError: (e) => showToast(axios.isAxiosError(e) ? e.response?.data?.message ?? 'Failed' : 'Error', 'error') });
  const deleteMut = useMutation({ mutationFn: (id: string) => api.deleteService(id), onSuccess: () => { qc.invalidateQueries({ queryKey: ['merchantServices'] }); showToast('Service deleted', 'success'); }, onError: () => showToast('Failed', 'error') });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); const f = new FormData(e.currentTarget);
    const d = { name: f.get('name') as string, price: parseInt(f.get('price') as string), unit: f.get('unit') as UnitType, description: f.get('description') as string };
    if (editItem) updateMut.mutate({ id: editItem.id, ...d }); else createMut.mutate(d);
  };

  if (formVisible) {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: 'var(--color-card)' }}>
        <TopBar title={editItem ? 'Edit Service' : 'Add Service'} showBack onBack={() => { setFormVisible(false); setEditItem(null); }} />
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Service Name</label><input name="name" defaultValue={editItem?.name} required className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', color: 'var(--color-text)' }} /></div>
          <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Description</label><textarea name="description" defaultValue={editItem?.description} required rows={3} className="w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', color: 'var(--color-text)' }} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Price (Rp)</label><input name="price" type="number" defaultValue={editItem?.price} required className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', color: 'var(--color-text)' }} /></div>
            <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Unit</label><select name="unit" defaultValue={editItem?.unit || 'KG'} className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none" style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', color: 'var(--color-text)' }}><option value="KG">Per kg</option><option value="PIECE">Per piece</option></select></div>
          </div>
          <Button type="submit" isLoading={createMut.isPending || updateMut.isPending} variant="secondary" fullWidth className="mt-4">
            Save Service
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto relative" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Services" />
      <div className="p-6 flex flex-col gap-4">
        {isLoading ? <><SkeletonCard /><SkeletonCard /></> : (services || []).length === 0 ? <EmptyState title="No services yet" description="Add your first service below." /> : (services || []).map((svc) => <ServiceCard key={svc.id} service={svc} onEdit={() => { setEditItem(svc); setFormVisible(true); }} onDelete={() => deleteMut.mutate(svc.id)} />)}
      </div>
      <div className="absolute bottom-24 right-6">
        <Button
          onClick={() => setFormVisible(true)}
          className="!w-14 !h-14 !rounded-full !p-0 shadow-lg"
          variant="primary"
        >
          <Plus size={24} />
        </Button>
      </div>
    </div>
  );
}
