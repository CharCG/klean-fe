import { memo } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import type { Service } from '../../types';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';

interface ServiceCardProps {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}

const ServiceCard = memo(({ service, onEdit, onDelete }: ServiceCardProps) => (
  <div
    className="rounded-xl p-4 flex flex-col"
    style={{
      backgroundColor: 'var(--color-card)',
      border: '1px solid var(--color-stroke)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
    }}
  >
    <div className="mb-3">
      <h4 className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
        {service.name}
      </h4>
      {service.description && (
        <p className="text-xs mt-1.5 leading-relaxed line-clamp-2" style={{ color: 'var(--color-text-secondary)' }}>
          {service.description}
        </p>
      )}
    </div>
    <div className="flex justify-between items-center mt-auto pt-3" style={{ borderTop: '1px solid var(--color-stroke)' }}>
      <p className="font-semibold text-sm" style={{ color: 'var(--color-primary)' }}>
        {formatCurrency(service.price)}{' '}
        <span className="text-xs font-medium" style={{ color: 'var(--color-text-tertiary)' }}>
          / {service.unit.toLowerCase()}
        </span>
      </p>
      <div className="flex gap-2">
        <Button
          onClick={onEdit}
          variant="outline"
          size="sm"
          className="!w-8 !h-8 !p-0 !rounded-lg !border-stroke !bg-bg !text-text-secondary"
        >
          <Edit2 size={16} />
        </Button>
        <Button
          onClick={onDelete}
          variant="danger"
          size="sm"
          className="!w-8 !h-8 !p-0 !rounded-lg"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  </div>
));

ServiceCard.displayName = 'ServiceCard';
export default ServiceCard;
