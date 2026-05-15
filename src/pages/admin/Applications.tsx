import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FileText, ChevronLeft, CheckCircle, X } from 'lucide-react';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import SkeletonCard from '../../components/common/SkeletonCard';

export default function AdminApplications() {
  const navigate = useNavigate();
  const { data: apps, isLoading } = useQuery({ queryKey: ['applications'], queryFn: api.getApplications });

  const pending = (apps || []).filter((a) => a.status === 'PENDING');
  const processed = (apps || []).filter((a) => a.status !== 'PENDING');

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Applications" />
      <div className="p-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center justify-between" style={{ color: 'var(--color-text)' }}>Pending Approvals <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-warning-light)', color: 'var(--color-warning)', border: '1px solid var(--color-warning)' }}>{pending.length}</span></h2>
        <div className="flex flex-col gap-3 mb-8">
          {isLoading ? <SkeletonCard /> : pending.length === 0 ? <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>No pending applications.</p> : pending.map((app) => (
            <div key={app.id} onClick={() => navigate(`/admin/applications/${app.id}`)} className="rounded-xl p-4 flex justify-between items-center cursor-pointer transition-colors" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-warning-light)', border: '1px solid var(--color-warning)', color: 'var(--color-warning)' }}><FileText size={18} /></div><div><h4 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{app.businessName}</h4><p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{app.id.slice(0, 8).toUpperCase()}</p></div></div>
              <ChevronLeft size={16} className="rotate-180" style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
          ))}
        </div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Recently Processed</h2>
        <div className="flex flex-col gap-3">
          {processed.map((app) => (
            <div key={app.id} onClick={() => navigate(`/admin/applications/${app.id}`)} className="rounded-xl p-4 flex justify-between items-center opacity-80 cursor-pointer transition-colors" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: app.status === 'ACCEPTED' ? 'var(--color-success-light)' : 'var(--color-danger-light)', border: `1px solid ${app.status === 'ACCEPTED' ? 'var(--color-success)' : 'var(--color-danger)'}`, color: app.status === 'ACCEPTED' ? 'var(--color-success)' : 'var(--color-danger)' }}>{app.status === 'ACCEPTED' ? <CheckCircle size={18} /> : <X size={18} />}</div><div><h4 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{app.businessName}</h4><p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{app.id.slice(0, 8).toUpperCase()}</p></div></div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase" style={{ backgroundColor: app.status === 'ACCEPTED' ? 'var(--color-success-light)' : 'var(--color-danger-light)', color: app.status === 'ACCEPTED' ? 'var(--color-success)' : 'var(--color-danger)', border: `1px solid ${app.status === 'ACCEPTED' ? 'var(--color-success)' : 'var(--color-danger)'}` }}>{app.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
