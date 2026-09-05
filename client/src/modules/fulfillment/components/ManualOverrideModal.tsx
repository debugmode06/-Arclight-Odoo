import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyOverride: (depotAQty: number, depotBQty: number) => void;
}

export const ManualOverrideModal: React.FC<Props> = ({ isOpen, onClose, onApplyOverride }) => {
  const [depotAQty, setDepotAQty] = useState<number>(6);
  const [depotBQty, setDepotBQty] = useState<number>(4);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyOverride(depotAQty, depotBQty);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-purple-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Manual Allocation Override</h3>
            <p className="text-xs text-slate-500">Adjust stock quantities per depot manually</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Main Warehouse (Bhiwandi Hub) Allocation
            </label>
            <input
              type="number"
              min="0"
              max="14"
              value={depotAQty}
              onChange={(e) => setDepotAQty(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-purple-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400">Available: 14 units</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              East Depot (Kolkata Terminal) Allocation
            </label>
            <input
              type="number"
              min="0"
              max="9"
              value={depotBQty}
              onChange={(e) => setDepotBQty(parseInt(e.target.value) || 0)}
              className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-bold text-purple-900 focus:ring-2 focus:ring-purple-600 focus:outline-none"
            />
            <span className="text-[11px] text-slate-400">Available: 9 units</span>
          </div>

          <div className="p-3 bg-purple-50 rounded-xl text-xs text-purple-900 font-medium flex justify-between">
            <span>Total Units Allocated:</span>
            <strong className="font-bold">{depotAQty + depotBQty} / 10 Units Required</strong>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl shadow-md shadow-purple-600/20"
            >
              Save Manual Allocation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
