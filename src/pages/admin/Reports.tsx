import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, ChevronLeft } from 'lucide-react';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import SkeletonCard from '../../components/common/SkeletonCard';

export default function AdminReports() {
  const navigate = useNavigate();
  const { data: reports, isLoading } = useQuery({ queryKey: ['reports'], queryFn: api.getReports });

  const open = (reports || []).filter((r) => r.status === 'OPEN');
  const resolved = (reports || []).filter((r) => r.status === 'RESOLVED');

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Reports" />
      <div className="p-6">
        <h2 className="text-sm font-semibold mb-3 flex items-center justify-between" style={{ color: 'var(--color-text)' }}>Pending Reports <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--color-danger-light)', color: 'var(--color-danger)', border: '1px solid var(--color-danger)' }}>{open.length}</span></h2>
        <div className="flex flex-col gap-3 mb-8">
          {isLoading ? <SkeletonCard /> : open.length === 0 ? <p className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>No pending reports.</p> : open.map((r) => (
            <div key={r.id} onClick={() => navigate(`/admin/reports/${r.id}`)} className="rounded-xl p-4 flex justify-between items-center cursor-pointer" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}><AlertTriangle size={18} /></div><div><h4 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{r.order?.merchant?.name || 'Report'}</h4><p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{r.id.slice(0, 8).toUpperCase()}</p></div></div>
              <ChevronLeft size={16} className="rotate-180" style={{ color: 'var(--color-text-tertiary)' }} />
            </div>
          ))}
        </div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Recently Resolved</h2>
        <div className="flex flex-col gap-3">
          {resolved.map((r) => (
            <div key={r.id} onClick={() => navigate(`/admin/reports/${r.id}`)} className="rounded-xl p-4 flex justify-between items-center opacity-80 cursor-pointer" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
              <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-success-light)', border: '1px solid var(--color-success)', color: 'var(--color-success)' }}><CheckCircle size={18} /></div><div><h4 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>{r.order?.merchant?.name || 'Report'}</h4><p className="text-[10px] font-medium mt-0.5" style={{ color: 'var(--color-text-tertiary)' }}>{r.id.slice(0, 8).toUpperCase()}</p></div></div>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase" style={{ backgroundColor: 'var(--color-success-light)', color: 'var(--color-success)', border: '1px solid var(--color-success)' }}>{r.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
