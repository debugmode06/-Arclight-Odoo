import React from 'react';
import { RiskLevel } from '../types/quotation.types';
import { ShieldCheck, AlertTriangle, ShieldAlert, AlertOctagon } from 'lucide-react';

interface Props {
  level: RiskLevel;
  score?: number;
  showIcon?: boolean;
  className?: string;
}

export const RiskBadge: React.FC<Props> = ({
  level,
  score,
  showIcon = true,
  className = '',
}) => {
  const getConfig = () => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: ShieldCheck,
          label: 'LOW RISK',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          icon: AlertTriangle,
          label: 'MEDIUM RISK',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-50 text-orange-700 border-orange-200',
          icon: ShieldAlert,
          label: 'HIGH RISK',
        };
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50 text-rose-700 border-rose-200 font-semibold',
          icon: AlertOctagon,
          label: 'CRITICAL RISK',
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          icon: ShieldCheck,
          label: level,
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.bg} ${className}`}
    >
      {showIcon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
      <span>{config.label}</span>
      {score !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 bg-white/70 rounded text-[10px] font-bold">
          {score}
        </span>
      )}
    </span>
  );
};
