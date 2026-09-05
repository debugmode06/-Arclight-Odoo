import React from 'react';

export interface DispatchLine {
  id: string;
  name: string;
  subText: string;
  qtyText: string;
  originDepot: string;
  carrier: string;
  trackingStage: string;
  status: 'Reserved' | 'Ready' | 'Confirmed' | 'Backordered';
}

interface Props {
  lines: DispatchLine[];
}

export const DispatchManifestTable: React.FC<Props> = ({ lines }) => {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-6">
      {/* Table Header & Title */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Dispatch Manifest & Line Allocation</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Hardware batch reservation and digital provisioning workflow for Quote Q-2025-0842
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-purple-50 text-purple-900 border border-purple-200/80 px-3 py-1.5 rounded-lg">
          {lines.length} Deliverables Staged
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-y border-slate-200/60">
              <th className="p-3.5 pl-4">LINE & DELIVERABLE</th>
              <th className="p-3.5">QTY / ALLOCATION</th>
              <th className="p-3.5">ORIGIN DEPOT</th>
              <th className="p-3.5">DISPATCH CARRIER</th>
              <th className="p-3.5">TRACKING STAGE</th>
              <th className="p-3.5 text-center pr-4">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {lines.map((line) => (
              <tr key={line.id} className="hover:bg-purple-50/30 transition-colors">
                <td className="p-3.5 pl-4">
                  <div className="font-bold text-slate-900 text-sm">{line.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{line.subText}</div>
                </td>
                <td className="p-3.5 font-bold text-slate-900 text-sm">{line.qtyText}</td>
                <td className="p-3.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-600"></span>
                    <span className="font-semibold text-slate-800 text-xs">{line.originDepot}</span>
                  </div>
                </td>
                <td className="p-3.5 text-xs font-medium text-slate-700">{line.carrier}</td>
                <td className="p-3.5">
                  <span className="inline-block px-2.5 py-1 bg-purple-50 text-purple-800 font-medium text-xs rounded-md border border-purple-100 font-mono">
                    {line.trackingStage}
                  </span>
                </td>
                <td className="p-3.5 text-center pr-4">
                  {line.status === 'Reserved' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Reserved
                    </span>
                  )}
                  {line.status === 'Ready' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold rounded-full">
                      <span className="w-2 h-2 rounded-full bg-purple-600"></span> Ready
                    </span>
                  )}
                  {line.status === 'Confirmed' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Confirmed
                    </span>
                  )}
                  {line.status === 'Backordered' && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold rounded-full">
                      <span className="w-2 h-2 rounded-full bg-rose-500"></span> Backordered
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
