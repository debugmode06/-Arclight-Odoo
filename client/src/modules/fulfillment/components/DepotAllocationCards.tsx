import React from 'react';

interface DepotData {
  code: string;
  name: string;
  subName: string;
  zone: string;
  depotTag: string;
  allocatedQty: number;
  availableStock: number;
  sharePercent: number;
  transitDays: string;
  freightCost: string;
}

interface Props {
  depots: DepotData[];
  isConsolidatedMode?: boolean;
}

export const DepotAllocationCards: React.FC<Props> = ({ depots, isConsolidatedMode }) => {
  return (
    <div className="space-y-4">
      {/* Depot Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {depots.map((depot, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-purple-100 shadow-sm hover:shadow-md transition-all p-5 relative overflow-hidden"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span>
                  <h3 className="font-bold text-slate-900 text-base">{depot.name}</h3>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 font-medium">
                  Origin Zone: {depot.zone}
                </div>
              </div>
              <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-bold shadow-sm shadow-purple-500/20">
                {depot.depotTag}
              </span>
            </div>

            {/* Metrics Boxes */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-purple-50/60 border border-purple-100 p-3 rounded-xl">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Allocated Quantity
                </div>
                <div className="text-2xl font-black text-purple-900 mt-0.5">
                  {depot.allocatedQty} <span className="text-sm font-semibold text-purple-700">Units</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                  Available Physical Stock
                </div>
                <div className="text-2xl font-black text-slate-900 mt-0.5">
                  {depot.availableStock} <span className="text-sm font-semibold text-slate-600">Units</span>
                </div>
              </div>
            </div>

            {/* Depot Fulfillment Share Progress Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-600">Depot Fulfillment Share</span>
                <span className="text-purple-700">{depot.sharePercent}% ({depot.allocatedQty}/10)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${depot.sharePercent}%` }}
                ></div>
              </div>
            </div>

            {/* Footer info: Transit & Freight */}
            <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100 text-slate-600 font-medium">
              <div className="flex items-center gap-1.5">
                <span>🚚</span> Transit: <strong className="text-slate-900">{depot.transitDays}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span>Freight:</span> <strong className="text-purple-900 font-bold">{depot.freightCost}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendation Banner */}
      {isConsolidatedMode ? (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-white font-bold flex items-center justify-center text-sm shrink-0">
            ⚠️
          </div>
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-amber-900 text-sm">Simulated Single-Hub Consolidation (Causes 3-Day Backorder)</h4>
              <span className="px-2.5 py-0.5 bg-amber-200 text-amber-900 rounded-full text-xs font-bold">
                Logistics Penalty
              </span>
            </div>
            <p className="text-xs text-amber-800 mt-1 leading-relaxed">
              Consolidating 10 units exclusively from Main Warehouse triggers South cross-dock routing, inducing a{' '}
              <strong>6-day delay</strong> and <strong>₹42,000 freight surcharge</strong>. Split strategy saves 56% net handling fees.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-sm shadow-purple-500/30">
              📈
            </div>
            <div>
              <h4 className="font-bold text-purple-950 text-sm">Why Split Plan (6 + 4) is Recommended:</h4>
              <p className="text-xs text-purple-900/80 mt-0.5 leading-relaxed">
                Consolidating 10 units exclusively from Main Warehouse triggers South cross-dock routing, inducing a{' '}
                <strong className="text-rose-700">6-day delay</strong> and{' '}
                <strong className="text-rose-700">₹42,000 freight surcharge</strong>. Split strategy saves 56% net handling fees.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Verified Optimal
          </span>
        </div>
      )}
    </div>
  );
};
