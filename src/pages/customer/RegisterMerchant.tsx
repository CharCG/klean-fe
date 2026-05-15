import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import * as api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import TopBar from '../../components/common/TopBar';
import type { BankType } from '../../types';
import axios from 'axios';
import { Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';

export default function RegisterMerchant() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [proposalFile, setProposalFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: (data: Parameters<typeof api.submitApplication>[0]) => api.submitApplication(data),
    onSuccess: () => { showToast('Application submitted!', 'success'); navigate('/profile', { replace: true }); },
    onError: (e) => {
      showToast(axios.isAxiosError(e) ? e.response?.data?.message ?? 'Failed' : 'Error', 'error');
      setIsUploading(false);
    },
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (!proposalFile) {
      showToast('Please upload a proposal document', 'error');
      return;
    }

    const formElement = e.currentTarget;

    try {
      setIsUploading(true);
      const url = await api.uploadFile(proposalFile);

      const f = new FormData(formElement);
      mutation.mutate({
        businessName: f.get('businessName') as string,
        businessOwner: f.get('businessOwner') as string,
        businessPhone: f.get('businessPhone') as string,
        businessEmail: f.get('businessEmail') as string,
        businessAddress: f.get('businessAddress') as string,
        businessDescription: f.get('businessDescription') as string,
        openTime: f.get('openTime') as string,
        closeTime: f.get('closeTime') as string,
        bankType: f.get('bankType') as BankType,
        bankAccount: f.get('bankAccount') as string,
        bankHolder: f.get('bankHolder') as string,
        documentUrl: url,
      });
    } catch {
      showToast('Failed to upload document', 'error');
      setIsUploading(false);
    }
  };

  const inputCls = "w-full text-sm font-medium rounded-lg p-2.5 focus:outline-none transition-colors";
  const inputStyle = { backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stroke)', color: 'var(--color-text)' };

  const steps = ['Business Details', 'Bank Details', 'Documents'];

  return (
    <div className="flex flex-col h-full overflow-y-auto" style={{ backgroundColor: 'var(--color-bg)' }}>
      <TopBar title="Merchant Registration" showBack />

      {/* Stepper Indicator */}
      <div className="px-6 pt-6 pb-2">
        <div className="flex items-center justify-between relative">
          {/* Background line */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-stroke-medium -z-10" />
          {/* Active line progress */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary -z-10 transition-all duration-300" style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }} />

          {steps.map((label, idx) => {
            const stepNumber = idx + 1;
            const isActive = step === stepNumber;
            const isPast = step > stepNumber;
            return (
              <div key={label} className="flex flex-col items-center gap-1.5 px-2" style={{ backgroundColor: 'var(--color-bg)' }}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${isActive || isPast ? 'bg-primary text-white' : 'text-text-tertiary'}`} style={{ backgroundColor: isActive || isPast ? 'var(--color-primary)' : 'var(--color-stroke-medium)' }}>
                  {isPast ? <Check size={14} strokeWidth={3} /> : stepNumber}
                </div>
                <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : ''}`} style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}>{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 flex flex-col">
        {/* STEP 1: Business Info */}
        <div className={`space-y-6 ${step === 1 ? 'block' : 'hidden'}`}>
          <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
            <h3 className="font-semibold text-sm mb-4 pb-2" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-stroke)' }}>Business Information</h3>
            <div className="space-y-4">
              {[{ n: 'businessOwner', l: 'Owner Name' }, { n: 'businessName', l: 'Business Name' }, { n: 'businessPhone', l: 'Business Phone', t: 'tel' }, { n: 'businessEmail', l: 'Business Email', t: 'email' }, { n: 'businessAddress', l: 'Business Address' }].map(f => {
                const isOwner = f.n === 'businessOwner';
                return (
                  <div key={f.n}>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>{f.l}</label>
                    <input name={f.n} type={f.t || 'text'} required={step === 1 && !isOwner} className={`${inputCls} ${isOwner ? 'opacity-70 cursor-not-allowed' : ''}`} style={inputStyle} readOnly={isOwner} defaultValue={isOwner ? user?.name : undefined} />
                  </div>
                );
              })}
              <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Description</label><textarea name="businessDescription" required={step === 1} rows={3} className={inputCls + ' resize-none'} style={inputStyle} /></div>
            </div>
          </section>
          <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
            <h3 className="font-semibold text-sm mb-4 pb-2" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-stroke)' }}>Operating Hours</h3>
            <div className="flex gap-4">
              <div className="flex-1"><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Open</label><input name="openTime" type="time" required={step === 1} className={inputCls} style={inputStyle} /></div>
              <div className="flex-1"><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Close</label><input name="closeTime" type="time" required={step === 1} className={inputCls} style={inputStyle} /></div>
            </div>
          </section>
        </div>

        {/* STEP 2: Bank Info */}
        <div className={`space-y-6 ${step === 2 ? 'block' : 'hidden'}`}>
          <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
            <h3 className="font-semibold text-sm mb-4 pb-2" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-stroke)' }}>Bank Account Details</h3>
            <div className="space-y-4">
              <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Bank Name</label><select name="bankType" required={step === 2} className={inputCls} style={inputStyle}>{['BCA', 'BRI', 'MANDIRI', 'BNI', 'DANAMON', 'CIMB', 'OCBC'].map(b => (<option key={b} value={b}>{b}</option>))}</select></div>
              <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Account Number</label><input name="bankAccount" required={step === 2} className={inputCls} style={inputStyle} /></div>
              <div><label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Account Holder Name</label><input name="bankHolder" required={step === 2} className={inputCls} style={inputStyle} /></div>
            </div>
          </section>
        </div>

        {/* STEP 3: Documents Proposal */}
        <div className={`space-y-6 ${step === 3 ? 'block' : 'hidden'}`}>
          <section className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-stroke)' }}>
            <h3 className="font-semibold text-sm mb-4 pb-2" style={{ color: 'var(--color-text)', borderBottom: '1px solid var(--color-stroke)' }}>Documents Proposal</h3>
            <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>Please upload your business proposal and required permits.</p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--color-text-secondary)' }}>Upload Proposal (.pdf, .doc)</label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors" style={{ borderColor: 'var(--color-stroke-medium)' }}>
                  <input type="file" className="hidden" id="proposalUpload" accept=".pdf,.doc,.docx" onChange={(e) => setProposalFile(e.target.files?.[0] || null)} />
                  <label htmlFor="proposalUpload" className="cursor-pointer flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                      {proposalFile ? proposalFile.name : 'Click to upload'}
                    </span>
                    {!proposalFile && <span className="text-xs mt-1" style={{ color: 'var(--color-text-tertiary)' }}>Max file size 5MB</span>}
                  </label>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-auto pt-6 flex gap-3">
          {step > 1 && (
            <Button
              type="button"
              onClick={() => setStep(step - 1)}
              variant="outline"
              className="!px-6 !py-3.5 !rounded-xl !text-sm !font-semibold !transition-opacity hover:!opacity-80"
              style={{ backgroundColor: 'var(--color-stroke)', color: 'var(--color-text)' }}
            >
              Back
            </Button>
          )}
          <Button
            type="submit"
            isLoading={mutation.isPending || isUploading}
            variant="primary"
            fullWidth
            className="!flex-1 !py-3.5 !rounded-xl !text-sm !font-semibold !transition-opacity hover:!opacity-90"
          >
            {step < 3 ? 'Next Step' : (isUploading ? 'Uploading...' : mutation.isPending ? 'Submitting...' : 'Submit Application')}
          </Button>
        </div>
      </form>
    </div>
  );
}
