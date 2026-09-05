import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Download,
  SlidersHorizontal,
  Plus,
  Search,
  ChevronDown,
  Layers,
  AlertTriangle,
  PieChart,
  Eye,
  Zap,
  Edit2,
  Shield,
  FileText,
  X,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { QuotationService } from '../services/quotation.service';

interface QuotationRowItem {
  id: string;
  quoteNumber: string;
  customerName: string;
  customerSubtext: string;
  netValue: number;
  discountPercent: number;
  discountAmount: number;
  grossMarginPercent: number;
  marginDotColor: 'emerald' | 'amber' | 'rose';
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  approvalRequired: boolean;
  approvalGateText: string;
  approvalGateSubtext: string;
  stateText: string;
  stateColor: 'amber' | 'slate' | 'purple' | 'emerald' | 'rose';
  activity: string;
  actionType: 'view-eval' | 'edit' | 'shield' | 'file';
  rawId?: string;
}

// Initial benchmark items directly from the provided design image
const INITIAL_DEMO_ROWS: QuotationRowItem[] = [
  {
    id: 'Q-1024',
    quoteNumber: 'Q-1024',
    customerName: 'Acme Corporation',
    customerSubtext: 'Tier 1 • Annual Renewal',
    netValue: 48400,
    discountPercent: 12.5,
    discountAmount: 6000,
    grossMarginPercent: 31.0,
    marginDotColor: 'amber',
    riskScore: 68,
    riskLevel: 'HIGH',
    approvalRequired: true,
    approvalGateText: 'Required',
    approvalGateSubtext: 'Sales Manager (Level 2)',
    stateText: 'Pending Approval',
    stateColor: 'amber',
    activity: '12m ago',
    actionType: 'view-eval',
  },
  {
    id: 'Q-1025',
    quoteNumber: 'Q-1025',
    customerName: 'Nova Systems',
    customerSubtext: 'Mid-Market Expansion',
    netValue: 18200,
    discountPercent: 5.0,
    discountAmount: 950,
    grossMarginPercent: 38.4,
    marginDotColor: 'emerald',
    riskScore: 18,
    riskLevel: 'LOW',
    approvalRequired: false,
    approvalGateText: 'Not Required',
    approvalGateSubtext: 'Within Rep Autonomy',
    stateText: 'Draft',
    stateColor: 'slate',
    activity: '2h ago',
    actionType: 'edit',
  },
  {
    id: 'Q-1022',
    quoteNumber: 'Q-1022',
    customerName: 'Vertex Industrial',
    customerSubtext: 'Strategic Enterprise',
    netValue: 124000,
    discountPercent: 16.0,
    discountAmount: 23500,
    grossMarginPercent: 26.2,
    marginDotColor: 'rose',
    riskScore: 84,
    riskLevel: 'CRITICAL',
    approvalRequired: true,
    approvalGateText: 'Required',
    approvalGateSubtext: 'VP Finance (Level 3)',
    stateText: 'In Review',
    stateColor: 'purple',
    activity: '1d ago',
    actionType: 'shield',
  },
  {
    id: 'Q-1019',
    quoteNumber: 'Q-1019',
    customerName: 'Datastream Cloud',
    customerSubtext: 'Standard SaaS Tier',
    netValue: 62500,
    discountPercent: 8.0,
    discountAmount: 5400,
    grossMarginPercent: 35.8,
    marginDotColor: 'emerald',
    riskScore: 42,
    riskLevel: 'MEDIUM',
    approvalRequired: false,
    approvalGateText: 'Auto-Cleared',
    approvalGateSubtext: 'DealTwin Autonomous',
    stateText: 'Approved',
    stateColor: 'emerald',
    activity: '2d ago',
    actionType: 'file',
  },
];

export const QuotationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const demoParam = searchParams.get('demo');

  // Quotation Rows state
  const [rows, setRows] = useState<QuotationRowItem[]>(INITIAL_DEMO_ROWS);
  const [backendQuotes, setBackendQuotes] = useState<any[]>([]);

  // Filters state matching controls in image
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [ownerFilter, setOwnerFilter] = useState('Alex Morgan');
  const [sortBy, setSortBy] = useState('Updated (Recent)');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals for demo tabs
  const [selectedQuoteDetail, setSelectedQuoteDetail] = useState<QuotationRowItem | null>(null);
  const [showDecisionDesk, setShowDecisionDesk] = useState(false);
  const [showStatesPreview, setShowStatesPreview] = useState(false);

  // Sync demoParam from URL (e.g. switcher bar clicks)
  useEffect(() => {
    if (demoParam === 'detail') {
      const q1024 = rows.find((r) => r.quoteNumber === 'Q-1024') || rows[0];
      setSelectedQuoteDetail(q1024);
      setShowDecisionDesk(false);
      setShowStatesPreview(false);
    } else if (demoParam === 'decision-desk') {
      setShowDecisionDesk(true);
      setSelectedQuoteDetail(null);
      setShowStatesPreview(false);
    } else if (demoParam === 'states-preview') {
      setShowStatesPreview(true);
      setSelectedQuoteDetail(null);
      setShowDecisionDesk(false);
    } else {
      setSelectedQuoteDetail(null);
      setShowDecisionDesk(false);
      setShowStatesPreview(false);
    }
  }, [demoParam, rows]);

  const handleCloseModals = () => {
    setSelectedQuoteDetail(null);
    setShowDecisionDesk(false);
    setShowStatesPreview(false);
    setSearchParams({});
  };

  // Fetch backend data in background to merge or enrich
  useEffect(() => {
    QuotationService.listQuotations()
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setBackendQuotes(res.data);
          // Find if we can link Q-1024 to real backend quotation
          const q1024 = res.data.find((q: any) => q.quotationNumber === 'QT-2026-0003' || q.status === 'PENDING_APPROVAL');
          if (q1024) {
            setRows((prev) =>
              prev.map((r) =>
                r.quoteNumber === 'Q-1024' ? { ...r, rawId: q1024._id } : r
              )
            );
          }
        }
      })
      .catch((err) => {
        console.warn('Backend quotes fetch optional fallback:', err);
      });
  }, []);

  // Format currency
  const formatMoney = (amount: number) => {
    return '$' + amount.toLocaleString('en-US');
  };

  // Filter logic
  const filteredRows = rows.filter((item) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchNumber = item.quoteNumber.toLowerCase().includes(q);
      const matchCustomer = item.customerName.toLowerCase().includes(q);
      const matchSub = item.customerSubtext.toLowerCase().includes(q);
      if (!matchNumber && !matchCustomer && !matchSub) return false;
    }
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'PENDING' && item.stateText !== 'Pending Approval') return false;
      if (statusFilter === 'DRAFT' && item.stateText !== 'Draft') return false;
      if (statusFilter === 'APPROVED' && item.stateText !== 'Approved') return false;
      if (statusFilter === 'REVIEW' && item.stateText !== 'In Review') return false;
    }
    if (riskFilter === 'HIGH_CRITICAL' && item.riskLevel !== 'HIGH' && item.riskLevel !== 'CRITICAL') {
      return false;
    }
    return true;
  });

  const renderRiskPill = (level: QuotationRowItem['riskLevel'], score: number) => {
    switch (level) {
      case 'LOW':
        return (
          <span className="bg-emerald-50 text-emerald-600 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            LOW (Score {score})
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            MEDIUM (Score {score})
          </span>
        );
      case 'HIGH':
        return (
          <span className="bg-rose-50 text-rose-600 border border-rose-200/80 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            HIGH (Score {score})
          </span>
        );
      case 'CRITICAL':
        return (
          <span className="bg-rose-100 text-rose-700 border border-rose-300/80 px-2.5 py-0.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            CRITICAL (Score {score})
          </span>
        );
    }
  };

  const renderStatePill = (state: string, color: QuotationRowItem['stateColor']) => {
    switch (color) {
      case 'amber':
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-200/80 px-2.5 py-0.5 rounded-full text-xs font-medium inline-block shadow-2xs">
            {state}
          </span>
        );
      case 'slate':
        return (
          <span className="bg-slate-100 text-slate-600 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-medium inline-block shadow-2xs">
            {state}
          </span>
        );
      case 'purple':
        return (
          <span className="bg-purple-50 text-[#6344e7] border border-purple-200/80 px-2.5 py-0.5 rounded-full text-xs font-medium inline-block shadow-2xs">
            {state}
          </span>
        );
      case 'emerald':
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 px-2.5 py-0.5 rounded-full text-xs font-semibold inline-block shadow-2xs">
            {state}
          </span>
        );
      default:
        return (
          <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-medium inline-block">
            {state}
          </span>
        );
    }
  };

  const renderMarginDot = (color: QuotationRowItem['marginDotColor']) => {
    if (color === 'emerald') return <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-1.5"></span>;
    if (color === 'amber') return <span className="w-2 h-2 rounded-full bg-amber-500 inline-block ml-1.5"></span>;
    return <span className="w-2 h-2 rounded-full bg-rose-500 inline-block ml-1.5"></span>;
  };

  return (
    <div className="p-6 pb-28 max-w-[1520px] mx-auto select-none">
      {/* ─── Header: Title, Active Badge, Subtitle & Action Buttons ─────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Quotations</h1>
            <span className="bg-[#eff2ff] text-[#4f46e5] border border-[#dbe0fe] text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center shadow-2xs">
              Active Repository
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, govern, and track customer deals with autonomous margin assurance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Export CSV */}
          <button
            type="button"
            onClick={() => alert('Exporting active quotations to CSV...')}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export CSV</span>
          </button>

          {/* Filter Presets */}
          <button
            type="button"
            onClick={() => setRiskFilter(riskFilter === 'ALL' ? 'HIGH_CRITICAL' : 'ALL')}
            className={`border text-xs font-semibold px-3 py-2 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              riskFilter === 'HIGH_CRITICAL'
                ? 'bg-purple-50 border-purple-300 text-[#6344e7]'
                : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span>Filter Presets</span>
          </button>

          {/* + New Quotation */}
          <button
            type="button"
            onClick={() => navigate('/app/quotations/new')}
            className="bg-[#6344e7] hover:bg-[#5233d4] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs hover:shadow flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-white stroke-[2.5]" />
            <span>New Quotation</span>
          </button>
        </div>
      </div>

      {/* ─── 4 Summary Metric Cards ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {/* Total Pipeline */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Pipeline</span>
            <div className="w-6 h-6 rounded-md bg-purple-50 text-[#6344e7] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            $1.42M
          </div>
          <div className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-emerald-500 stroke-[2.5]" />
            <span>+14.2% vs last quarter</span>
          </div>
        </div>

        {/* Active Deals */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Deals</span>
            <div className="w-6 h-6 rounded-md bg-purple-50 text-[#6344e7] flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-[#6344e7]" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            28
          </div>
          <div className="text-xs text-slate-400 font-normal mt-1">
            18 closing this month
          </div>
        </div>

        {/* At Risk / Pending Approval */}
        <div className="bg-white rounded-xl border border-rose-200/80 p-4 shadow-2xs hover:shadow-xs transition-shadow bg-gradient-to-b from-rose-50/20 to-transparent">
          <div className="flex items-center justify-between text-xs font-bold text-rose-600">
            <span>At Risk / Pending Approval</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-rose-600 tracking-tight mt-2">
            4
          </div>
          <div className="text-xs font-semibold text-rose-600 mt-1">
            Requires immediate desk review
          </div>
        </div>

        {/* Avg Margin */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Avg Margin</span>
            <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PieChart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900 tracking-tight mt-2">
            34.2%
          </div>
          <div className="text-xs text-slate-400 font-normal mt-1">
            Target benchmark: 35.0%
          </div>
        </div>
      </div>

      {/* ─── Search & Filter Toolbar ──────────────────────────────────────────── */}
      <div className="bg-white p-2.5 rounded-xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center gap-3 mt-5">
        {/* Search Input */}
        <div className="flex items-center flex-1 min-w-[260px] px-2 py-1 bg-transparent">
          <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by quote ID, customer or product..."
            className="w-full text-xs text-slate-800 placeholder-slate-400 bg-transparent border-none outline-none focus:outline-none"
          />
        </div>

        {/* Filter 1: Status */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              const states = ['ALL', 'PENDING', 'DRAFT', 'APPROVED'];
              const next = states[(states.indexOf(statusFilter) + 1) % states.length];
              setStatusFilter(next);
            }}
            className="bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>
              Status:{' '}
              {statusFilter === 'ALL'
                ? 'All (4 Statuses)'
                : statusFilter === 'PENDING'
                ? 'Pending Approval'
                : statusFilter === 'DRAFT'
                ? 'Draft'
                : 'Approved'}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Filter 2: Risk */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setRiskFilter(riskFilter === 'ALL' ? 'HIGH_CRITICAL' : 'ALL')}
            className={`border rounded-lg px-2.5 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              riskFilter === 'HIGH_CRITICAL'
                ? 'bg-rose-50 border-rose-300 text-rose-700 font-semibold'
                : 'bg-slate-50/70 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Risk: {riskFilter === 'ALL' ? 'All Risk Levels' : 'High & Critical (2)'}</span>
            <ChevronDown className="w-3 h-3 text-current opacity-60" />
          </button>
        </div>

        {/* Filter 3: Owner */}
        <div className="relative">
          <button
            type="button"
            className="bg-slate-50/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium flex items-center gap-1.5 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <span>Owner: {ownerFilter}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Filter 4: Sort */}
        <div className="relative">
          <button
            type="button"
            className="bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3 h-3 text-slate-500" />
            <span>Sort: {sortBy}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* ─── Quotations Data Table ────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200/90 text-[11px] font-bold text-slate-400 tracking-wider uppercase">
                <th className="py-3 px-4">Quote #</th>
                <th className="py-3 px-4">Customer Account</th>
                <th className="py-3 px-4">Net Value</th>
                <th className="py-3 px-4">Discount Applied</th>
                <th className="py-3 px-4">Gross Margin</th>
                <th className="py-3 px-4">Governance Risk</th>
                <th className="py-3 px-4">Approval Gate</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Activity</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRows.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* QUOTE # */}
                  <td className="py-3 px-4 font-bold text-[#6344e7] hover:underline cursor-pointer">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedQuoteDetail(item);
                      }}
                      className="text-[#6344e7] font-bold hover:underline cursor-pointer"
                    >
                      {item.quoteNumber}
                    </button>
                  </td>

                  {/* CUSTOMER ACCOUNT */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900 leading-tight">{item.customerName}</div>
                    <div className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
                      {item.customerSubtext}
                    </div>
                  </td>

                  {/* NET VALUE */}
                  <td className="py-3 px-4 font-extrabold text-slate-900">
                    {formatMoney(item.netValue)}
                  </td>

                  {/* DISCOUNT APPLIED */}
                  <td className="py-3 px-4">
                    <div
                      className={`font-bold leading-tight ${
                        item.discountPercent >= 10 ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {item.discountPercent.toFixed(1)}%
                    </div>
                    <div className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      -{formatMoney(item.discountAmount)}
                    </div>
                  </td>

                  {/* GROSS MARGIN */}
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-800 flex items-center">
                      <span>{item.grossMarginPercent.toFixed(1)}%</span>
                      {renderMarginDot(item.marginDotColor)}
                    </div>
                  </td>

                  {/* GOVERNANCE RISK */}
                  <td className="py-3 px-4">
                    {renderRiskPill(item.riskLevel, item.riskScore)}
                  </td>

                  {/* APPROVAL GATE */}
                  <td className="py-3 px-4">
                    <div
                      className={`font-bold text-xs leading-tight ${
                        item.approvalRequired ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {item.approvalGateText}
                    </div>
                    <div className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5">
                      {item.approvalGateSubtext}
                    </div>
                  </td>

                  {/* STATE */}
                  <td className="py-3 px-4">
                    {renderStatePill(item.stateText, item.stateColor)}
                  </td>

                  {/* ACTIVITY */}
                  <td className="py-3 px-4 text-slate-400 text-xs font-normal">
                    {item.activity}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {item.actionType === 'view-eval' && (
                        <>
                          <button
                            type="button"
                            title="View Quote Detail"
                            onClick={() => setSelectedQuoteDetail(item)}
                            className="p-1 text-slate-400 hover:text-[#6344e7] transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            title="Quick Action / Evaluate"
                            onClick={() => setShowDecisionDesk(true)}
                            className="p-1 text-purple-600 hover:text-purple-800 transition-colors cursor-pointer"
                          >
                            <Zap className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {item.actionType === 'edit' && (
                        <button
                          type="button"
                          title="Edit Quotation"
                          onClick={() => navigate('/app/quotations/new')}
                          className="p-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}

                      {item.actionType === 'shield' && (
                        <button
                          type="button"
                          title="Executive Approval Desk"
                          onClick={() => setShowDecisionDesk(true)}
                          className="p-1 text-[#6344e7] hover:text-purple-800 transition-colors cursor-pointer"
                        >
                          <Shield className="w-4 h-4" />
                        </button>
                      )}

                      {item.actionType === 'file' && (
                        <button
                          type="button"
                          title="View PDF Contract"
                          onClick={() => setSelectedQuoteDetail(item)}
                          className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ─── Table Footer & Pagination ────────────────────────────────────────── */}
        <div className="p-4 border-t border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-slate-500">
            Showing <span className="font-semibold text-slate-700">{filteredRows.length}</span> of{' '}
            <span className="font-semibold text-slate-700">28</span> Active Quotations
          </div>

          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className="text-slate-500 hover:text-slate-800 px-2 py-1 font-medium transition-colors cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(1)}
              className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-colors cursor-pointer ${
                currentPage === 1
                  ? 'bg-[#6344e7] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              1
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className={`w-6 h-6 rounded flex items-center justify-center font-medium text-xs transition-colors cursor-pointer ${
                currentPage === 2
                  ? 'bg-[#6344e7] text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              2
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage(2)}
              className="text-slate-500 hover:text-slate-800 px-2 py-1 font-medium transition-colors cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODAL 1: Quotation Detail (Tab 3 Showcase for Q-1024) ─────────────── */}
      {selectedQuoteDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-[#6344e7] tracking-wider uppercase">
                  Quotation Detail Inspector
                </span>
                <h2 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {selectedQuoteDetail.quoteNumber} — {selectedQuoteDetail.customerName}
                </h2>
                <p className="text-xs text-slate-500">{selectedQuoteDetail.customerSubtext}</p>
              </div>
              <button
                type="button"
                onClick={handleCloseModals}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Net Deal Value</span>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  {formatMoney(selectedQuoteDetail.netValue)}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Discount Applied</span>
                <div className="text-lg font-bold text-rose-600 mt-1">
                  {selectedQuoteDetail.discountPercent}% (-{formatMoney(selectedQuoteDetail.discountAmount)})
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[11px] text-slate-500 font-medium">Gross Margin</span>
                <div className="text-lg font-bold text-slate-900 mt-1">
                  {selectedQuoteDetail.grossMarginPercent}%
                </div>
              </div>
            </div>

            {/* Governance Gate & Risk Analysis */}
            <div className="bg-purple-50/70 border border-purple-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#6344e7]">Autonomous Governance Status</span>
                {renderRiskPill(selectedQuoteDetail.riskLevel, selectedQuoteDetail.riskScore)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Approval Gate: <strong className="text-rose-600">{selectedQuoteDetail.approvalGateText}</strong> ({selectedQuoteDetail.approvalGateSubtext}). 
                Discount of {selectedQuoteDetail.discountPercent}% requires multi-step sign-off before contract dispatch.
              </p>
            </div>

            {/* Footer buttons */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCloseModals}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedQuoteDetail(null);
                  setShowDecisionDesk(true);
                }}
                className="px-4 py-2 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                Launch Decision Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: Decision Desk (Tab 5 Showcase) ───────────────────────────── */}
      {showDecisionDesk && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-[#6344e7] flex items-center justify-center font-bold">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Decision Desk — Q-1024 Governance Gate
                  </h3>
                  <p className="text-xs text-slate-500">Alex Morgan (Sales Rep) ➔ Level 2 Sales Manager Review</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCloseModals}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                <span className="font-bold text-amber-800">Governance Reason Trigger:</span>
                <p className="text-slate-600 leading-relaxed">
                  Blended value-weighted discount excess: 4.5% above authorized sales representative limit. 
                  Requires Sales Manager desk authorization.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Approver Justification / Feedback Note:
                </label>
                <textarea
                  defaultValue="Approved with condition that annual payment term is secured upfront."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-400/40"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  alert('Quotation Q-1024 returned to Rep with revision requested.');
                  handleCloseModals();
                }}
                className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Reject / Request Revision
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCloseModals}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRows((prev) =>
                      prev.map((r) =>
                        r.quoteNumber === 'Q-1024'
                          ? {
                              ...r,
                              stateText: 'Approved',
                              stateColor: 'emerald',
                              approvalGateText: 'Authorized',
                              approvalGateSubtext: 'Manager Approved',
                            }
                          : r
                      )
                    );
                    alert('Quotation Q-1024 Authorized & Approved!');
                    handleCloseModals();
                  }}
                  className="px-4 py-2 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-lg text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Authorize & Sign-Off</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: States Preview (Tab 6 Showcase) ─────────────────────────── */}
      {showStatesPreview && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Member 2 — Commercial Lifecycle States Preview
                </h3>
                <p className="text-xs text-slate-500">
                  Deterministic Finite State Machine governance flow
                </p>
              </div>
              <button
                type="button"
                onClick={handleCloseModals}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {[
                {
                  state: 'DRAFT',
                  desc: 'Quotation being built. Rep can edit lines, quantities, and discounts freely.',
                  pill: 'bg-slate-100 text-slate-700 border-slate-200',
                  action: 'Editable by Rep',
                },
                {
                  state: 'PENDING_APPROVAL',
                  desc: 'Discounts exceed sales authority. Commercial lock engaged; routed to Manager.',
                  pill: 'bg-amber-50 text-amber-700 border-amber-200',
                  action: 'Locked for Review',
                },
                {
                  state: 'IN_REVIEW (STEP 2)',
                  desc: 'High risk deal requiring dual executive sign-off from VP Finance.',
                  pill: 'bg-purple-50 text-[#6344e7] border-purple-200',
                  action: 'Finance Review',
                },
                {
                  state: 'APPROVED',
                  desc: 'Deal unlocked for customer signature and automated fulfillment handoff.',
                  pill: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                  action: 'Ready to Dispatch',
                },
                {
                  state: 'REJECTED',
                  desc: 'Unviable margin or breach of pricing rules. Feedback returned to Rep.',
                  pill: 'bg-rose-50 text-rose-700 border-rose-200',
                  action: 'Revision Required',
                },
              ].map((s) => (
                <div
                  key={s.state}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/50"
                >
                  <div className="space-y-0.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold border ${s.pill}`}
                    >
                      {s.state}
                    </span>
                    <p className="text-xs text-slate-600 mt-1">{s.desc}</p>
                  </div>
                  <span className="text-xs font-semibold text-slate-500 shrink-0 ml-4">
                    {s.action}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleCloseModals}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuotationsPage;
