import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import * as api from '../../services/api';
import TopBar from '../../components/common/TopBar';
import PageSkeleton from '../../components/common/PageSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/formatDate';
import Button from '../../components/common/Button';

export default function AdminReportDetail() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();
  const qc = useQueryClient();

  const { data: reports, isLoading, isError } = useQuery({ queryKey: ['reports'], queryFn: api.getReports });
  const report = reports?.find((r) => r.id === id);

  const mut = useMutation({ mutationFn: () => api.resolveReport(id!), onSuccess: () => { qc.invalidateQueries({ queryKey: ['reports'] }); showToast('Resolved', 'success'); }, onError: () => showToast('Failed', 'error') });

  if (isLoading) return <PageSkeleton />;
  if (isError || !report) return <ErrorState />;

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Report Details" showBack />
      <div className="p-6 space-y-5">
        <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
          <div className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid var(--color-stroke)' }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-danger-light)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)' }}><AlertTriangle size={28} /></div>
            <div>
              <h3 className="font-semibold text-lg" style={{ color: 'var(--color-text)' }}>{report.orderId.slice(0, 8).toUpperCase()}</h3>
              <span className="text-[10px] font-semibold px-2 py-1 rounded-full uppercase mt-1 inline-block" style={{ backgroundColor: report.status === 'OPEN' ? 'var(--color-danger-light)' : 'var(--color-success-light)', color: report.status === 'OPEN' ? 'var(--color-danger)' : 'var(--color-success)', border: `1px solid ${report.status === 'OPEN' ? 'var(--color-danger)' : 'var(--color-success)'}` }}>{report.status}</span>
            </div>
          </div>
          <div className="space-y-3 text-sm font-medium">
            <p><span className="block text-xs mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Date Submitted</span>{formatDate(report.createdAt)}</p>
            <p><span className="block text-xs mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Customer</span>{report.user?.name || 'N/A'}</p>
            <p><span className="block text-xs mb-0.5" style={{ color: 'var(--color-text-secondary)' }}>Issue</span><span className="leading-relaxed" style={{ color: 'var(--color-text)' }}>{report.issue}</span></p>
          </div>
        </section>
        {report.status === 'OPEN' && (
          <Button onClick={() => mut.mutate()} isLoading={mut.isPending} variant="secondary" fullWidth>Mark as Resolved</Button>
        )}
      </div>
    </div>
  );
}
