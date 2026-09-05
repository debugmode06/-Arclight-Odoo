import React, { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon?: ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon,
}) => {
  const getChangeBadge = () => {
    if (!change) return null;
    const isPositive = changeType === 'positive';
    return (
      <span
        className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
          isPositive
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}
      >
        {isPositive ? '↑' : '↓'} {change}
      </span>
    );
  };

  return (
    <div className="card flex flex-col justify-between p-6 hover:shadow-lg transition-all duration-200 border border-surface-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">{value}</h3>
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-primary-50 text-primary-600 border border-primary-100 flex items-center justify-center">
            {icon}
          </div>
        )}
      </div>

      {(change || subtitle) && (
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-surface-100 text-xs">
          {getChangeBadge()}
          {subtitle && <span className="text-gray-500 font-medium">{subtitle}</span>}
        </div>
      )}
    </div>
  );
};
