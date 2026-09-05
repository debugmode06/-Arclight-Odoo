import React from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportManifestModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-purple-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Digital Dispatch Manifest (PDF Export)</h3>
            <p className="text-xs text-slate-500">Quote Q-2025-0842 · Acme Industries Ltd.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 font-mono text-xs text-slate-700 mb-6">
          <div className="flex justify-between font-bold text-slate-900 border-b pb-2">
            <span>DEALFLOW360 LOGISTICS MANIFEST</span>
            <span>DATE: 2026-09-05</span>
          </div>
          <div>CUSTOMER: Acme Industries Ltd.</div>
          <div>DELIVERABLE BATCH #1: 6x Laptop X1 Carbon -&gt; Main Warehouse (Bhiwandi) [BlueDart Apex]</div>
          <div>DELIVERABLE BATCH #2: 4x Laptop X1 Carbon -&gt; East Depot (Kolkata) [Delhivery Freight]</div>
          <div>SAAS LICENSE: 10x Cloud RevOps Seats [Automated API Token]</div>
          <div>SERVICES: 1x Onsite Implementation Pack [Field Engineer Assigned]</div>
          <div className="pt-2 border-t font-bold text-purple-900">STATUS: VERIFIED OPTIMAL SPLIT RELEASED</div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Close
          </button>
          <button
            onClick={() => {
              window.print();
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-1.5"
          >
            <span>🖨️</span> Print / Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
