import React from 'react';
import { Layers } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export type DemoTabKey =
  | 'quotations-list'
  | 'quotation-builder'
  | 'quotation-detail'
  | 'approval-queue'
  | 'decision-desk'
  | 'states-preview';

export const MemberSwitcherBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const demoParam = searchParams.get('demo');

  let currentActive: DemoTabKey = 'quotations-list';
  if (demoParam === 'detail') {
    currentActive = 'quotation-detail';
  } else if (demoParam === 'decision-desk') {
    currentActive = 'decision-desk';
  } else if (demoParam === 'states-preview') {
    currentActive = 'states-preview';
  } else if (location.pathname === '/app/quotations/new') {
    currentActive = 'quotation-builder';
  } else if (location.pathname.startsWith('/app/approvals')) {
    currentActive = 'approval-queue';
  } else {
    currentActive = 'quotations-list';
  }

  const handleTabClick = (tab: DemoTabKey) => {
    switch (tab) {
      case 'quotations-list':
        navigate('/app/quotations');
        break;
      case 'quotation-builder':
        navigate('/app/quotations/new');
        break;
      case 'quotation-detail':
        navigate('/app/quotations?demo=detail');
        break;
      case 'approval-queue':
        navigate('/app/approvals');
        break;
      case 'decision-desk':
        navigate('/app/quotations?demo=decision-desk');
        break;
      case 'states-preview':
        navigate('/app/quotations?demo=states-preview');
        break;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 select-none">
      <div className="bg-[#242b35] text-white rounded-2xl shadow-2xl p-1.5 flex items-center gap-1 border border-slate-700/60 backdrop-blur-md">
        {/* Left Team Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 text-slate-300 font-bold text-[11px] tracking-wider">
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>MEMBER 2:</span>
        </div>

        {/* Tab 1: 1. Quotations List */}
        <button
          type="button"
          onClick={() => handleTabClick('quotations-list')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentActive === 'quotations-list'
              ? 'bg-[#6344e7] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          1. Quotations List
        </button>

        {/* Tab 2: 2. Quotation Builder */}
        <button
          type="button"
          onClick={() => handleTabClick('quotation-builder')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentActive === 'quotation-builder'
              ? 'bg-[#6344e7] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          2. Quotation Builder
        </button>

        {/* Tab 3: 3. Quotation Detail (Q-1024) */}
        <button
          type="button"
          onClick={() => handleTabClick('quotation-detail')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentActive === 'quotation-detail'
              ? 'bg-[#6344e7] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          3. Quotation Detail (Q-1024)
        </button>

        {/* Tab 4: 4. Approval Queue (with red dot) */}
        <button
          type="button"
          onClick={() => handleTabClick('approval-queue')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
            currentActive === 'approval-queue'
              ? 'bg-[#6344e7] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          <span>4. Approval Queue</span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block"></span>
        </button>

        {/* Tab 5: 5. Decision Desk */}
        <button
          type="button"
          onClick={() => handleTabClick('decision-desk')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentActive === 'decision-desk'
              ? 'bg-[#6344e7] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          5. Decision Desk
        </button>

        {/* Tab 6: 6. States Preview */}
        <button
          type="button"
          onClick={() => handleTabClick('states-preview')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            currentActive === 'states-preview'
              ? 'bg-[#6344e7] text-white shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
          }`}
        >
          6. States Preview
        </button>
      </div>
    </div>
  );
};
