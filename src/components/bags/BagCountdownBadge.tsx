import React from 'react';
import { evaluateBagStatus } from '../../services/bagCalculator';
import type { BagStatus } from '../../types';
import { Clock, AlertTriangle, CheckCircle2, AlertCircle } from 'lucide-react';

interface BagCountdownBadgeProps {
  openedAt: string;
  closingDate: string;
  status: BagStatus;
}

export const BagCountdownBadge: React.FC<BagCountdownBadgeProps> = ({
  openedAt,
  closingDate,
  status,
}) => {
  const info = evaluateBagStatus(openedAt, closingDate, status);

  const getIcon = () => {
    switch (info.urgencyLevel) {
      case 'completed':
        return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />;
      case 'critical':
        return <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-600" />;
      case 'warning':
        return <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-pink-600" />;
      default:
        return <Clock className="h-3.5 w-3.5 shrink-0 text-sky-600" />;
    }
  };

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-semibold ${info.badgeClass}`}
    >
      {getIcon()}
      <span>{info.label}</span>
    </span>
  );
};

