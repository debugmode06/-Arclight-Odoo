import React from 'react';
import { QuotationStatus } from '../types/quotation.types';

interface Props {
  status: QuotationStatus;
  className?: string;
}

export const QuotationStatusBadge: React.FC<Props> = ({ status, className = '' }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'DRAFT':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'PENDING_APPROVAL':
        return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse';
      case 'APPROVED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'RETURNED':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'WON':
        return 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
      case 'LOST':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const formatStatus = (s: string) => {
    return s.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {formatStatus(status)}
    </span>
  );
};
