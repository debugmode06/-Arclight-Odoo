import React from 'react';

export type StatusType =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'WON'
  | 'LOST'
  | 'EXPIRED'
  | 'PAID'
  | 'SENT'
  | 'OVERDUE'
  | 'SHIPPED'
  | 'DELIVERED';

interface StatusPillProps {
  status: StatusType | string;
}

export const StatusPill: React.FC<StatusPillProps> = ({ status }) => {
  const getStyle = (s: string) => {
    switch (s.toUpperCase()) {
      case 'APPROVED':
      case 'WON':
      case 'PAID':
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case 'PENDING_APPROVAL':
      case 'PENDING':
      case 'SENT':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case 'DRAFT':
        return 'bg-surface-200 text-gray-700 border-surface-300';
      case 'REJECTED':
      case 'LOST':
      case 'OVERDUE':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      default:
        return 'bg-purple-50 text-primary-700 border-primary-200/80';
    }
  };

  const formatLabel = (s: string) => {
    return s.replace(/_/g, ' ');
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStyle(
        status
      )}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75" />
      {formatLabel(status)}
    </span>
  );
};
