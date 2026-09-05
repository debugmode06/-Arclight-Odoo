import React from 'react';

interface Props {
  onAcceptSplit: () => void;
  onToggleConsolidation: () => void;
  isConsolidatedMode: boolean;
  isConfirmed: boolean;
}

export const LogisticsIntelligencePanel: React.FC<Props> = ({
  onAcceptSplit,
  onToggleConsolidation,
  isConsolidatedMode,
  isConfirmed,
}) => {
  return (
    <div className="space-y-4">
      {/* Freight Variance & Lead Time Box */}
      <div className="bg-purple-50/50 border border-purple-100 p-4 rounded-2xl">
        <div className="flex justify-between items-center text-xs pb-2 border-b border-purple-100">
          <span className="font-semibold text-slate-600">Simulated Freight Variance:</span>
          <strong className="text-purple-900 font-bold">
            {isConsolidatedMode ? '+₹42,000 (Surcharge)' : '₹0 (Optimal Baseline)'}
          </strong>
        </div>
        <div className="flex justify-between items-center text-xs pt-2">
          <span className="font-semibold text-slate-600">Lead Time Risk:</span>
          <strong className={isConsolidatedMode ? 'text-rose-600 font-bold' : 'text-emerald-600 font-bold'}>
            {isConsolidatedMode ? 'High SLA Breach (6 Days)' : 'No SLA breach projected'}
          </strong>
        </div>
      </div>

      {/* Autonomous Deal Path Card */}
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50/60 border border-purple-200/80 p-4 rounded-2xl">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-purple-900 mb-1.5">
          <span>✨</span> Autonomous Deal Path
        </div>
        <p className="text-xs text-purple-950/80 leading-relaxed font-medium">
          {isConsolidatedMode
            ? 'Consolidating 10 units to Main Warehouse causes ₹42,000 freight surcharge and triggers VP Finance approval policy BR-482.'
            : '6 Units Main + 4 Units East prevents ₹24,000 unallocated freight drain and avoids triggering VP Finance logistics exception policy BR-482.'}
        </p>
      </div>

      {/* Inventory Health & Depletion Gauge */}
      <div className="bg-white border border-purple-100 p-4 rounded-2xl space-y-3.5">
        <div className="text-xs font-bold text-slate-900">Inventory Health & Depletion Gauge</div>

        {/* Main Warehouse Gauge */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-semibold">
            <span className="text-slate-700">Main Warehouse Stock Remaining:</span>
            <strong className="text-slate-900">8 Units left</strong>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '57%' }}></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Safety Floor: 5 units</span>
            <span className="text-emerald-600 font-bold">Healthy</span>
          </div>
        </div>

        {/* East Depot Gauge */}
        <div>
          <div className="flex justify-between text-xs mb-1 font-semibold">
            <span className="text-slate-700">East Depot Stock Remaining:</span>
            <strong className="text-slate-900">5 Units left</strong>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-1">
            <div className="bg-purple-600 h-2 rounded-full" style={{ width: '55%' }}></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 font-medium">
            <span>Safety Floor: 3 units</span>
            <span className="text-emerald-600 font-bold">Healthy</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-2">
        <button
          onClick={onAcceptSplit}
          disabled={isConfirmed}
          className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 ${
            isConfirmed
              ? 'bg-emerald-600 text-white shadow-emerald-500/20'
              : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/30'
          }`}
        >
          <span>{isConfirmed ? '✓' : '☑'}</span>
          <span>{isConfirmed ? 'Allocation Released & Locked in DB' : 'Accept Suggested 6+4 Split'}</span>
        </button>

        <button
          onClick={onToggleConsolidation}
          className={`w-full py-2.5 px-4 border rounded-xl text-xs font-bold transition-colors ${
            isConsolidatedMode
              ? 'border-purple-600 bg-purple-50 text-purple-900'
              : 'border-slate-300 hover:bg-slate-50 text-slate-700'
          }`}
        >
          {isConsolidatedMode
            ? '↩ Restore Suggested 6+4 Split'
            : 'Simulate Single-Hub Consolidation (Causes 3-day backorder)'}
        </button>
      </div>

      {/* Audit Trail Log Box */}
      <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl text-xs space-y-1">
        <div className="flex items-center gap-1.5 text-slate-500 font-bold">
          <span>📜</span> AUDIT TRAIL LOG
        </div>
        <p className="text-slate-600 font-mono text-[11px] leading-relaxed italic">
          "DealTwin engine auto-routed 6+4 split based on customer regional delivery sites (Mumbai HQ: 6 units, Kolkata Branch: 4 units)."
        </p>
      </div>
    </div>
  );
};
