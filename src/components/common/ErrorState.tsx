import { memo } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from './Button';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState = memo(({ message = 'Something went wrong', onRetry }: ErrorStateProps) => (
  <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
    <AlertTriangle size={48} style={{ color: 'var(--color-danger)' }} />
    <h3 className="font-semibold mt-4 text-base" style={{ color: 'var(--color-text)' }}>
      {message}
    </h3>
    {onRetry && (
      <Button
        onClick={onRetry}
        variant="secondary"
        size="sm"
        className="mt-4 !px-6"
      >
        Try Again
      </Button>
    )}
  </div>
));

ErrorState.displayName = 'ErrorState';
export default ErrorState;
