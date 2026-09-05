import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApprovalService } from '../services/approval.service';
import { ApprovalRequest, ApprovalStatus } from '../types/approval.types';
import { QuotationNavbar } from '../../quotations/components/QuotationNavbar';
import { RiskBadge } from '../../quotations/components/RiskBadge';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  ArrowRight,
  Filter,
  User,
  Building,
  RefreshCw,
} from 'lucide-react';

export const ApprovalsPage: React.FC = () => {
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusTab, setStatusTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (statusTab !== 'ALL') {
        params.status = statusTab;
      }
      const data = await ApprovalService.listApprovals(params);
      setApprovals(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [statusTab]);

  const getStatusBadge = (status: ApprovalStatus) => {
    switch (status) {
      case 'PENDING':
      case 'MANAGER_APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            {status === 'MANAGER_APPROVED' ? 'Manager Approved (Step 2 Pending)' : 'Pending Review'}
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      case 'REVISION_REQUESTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200">
            <RotateCcw className="w-3 h-3" />
            Returned for Revision
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
      <QuotationNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Approval Queue</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Review and authorize commercial quotations that exceed sales rep discount delegations.
            </p>
          </div>
          <button
            onClick={fetchApprovals}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 hover:bg-gray-50 shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Queue
          </button>
        </div>

        {/* Tab Filter */}
        <div className="flex items-center gap-2 border-b border-gray-200">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-4 py-2.5 text-xs font-semibold border-b-2 -mb-px transition-all ${
                statusTab === tab
                  ? 'border-purple-600 text-purple-700'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              {tab === 'PENDING'
                ? 'Pending Review'
                : tab === 'APPROVED'
                ? 'Approved Deals'
                : tab === 'REJECTED'
                ? 'Rejected / Returned'
                : 'All Requests'}
            </button>
          ))}
        </div>

        {/* List Content */}
        {loading ? (
          <div className="py-20 text-center text-sm text-gray-500">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-purple-600 mb-2" />
            Loading approval queue...
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-xl border border-rose-200 text-rose-700 text-sm">
            {error}
          </div>
        ) : approvals.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-xl border border-gray-200 shadow-xs">
            <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-gray-900">No approval requests found</h3>
            <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
              All commercial proposals are currently compliant or already processed.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((req) => {
              const quote = typeof req.quotationId === 'object' ? req.quotationId : null;

              return (
                <div
                  key={req._id}
                  className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs hover:border-purple-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-base font-bold text-purple-700">
                        {req.quotationNumber}
                      </span>
                      {getStatusBadge(req.status)}
                      <RiskBadge
                        level={req.riskLevelSnapshot as any}
                        score={req.riskScoreSnapshot}
                      />
                    </div>

                    <div className="text-xs text-gray-600 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="flex items-center gap-1 font-medium text-gray-900">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        Requested by: {req.requestedByNameSnapshot}
                      </span>
                      <span>•</span>
                      <span>Total Value: ${req.grandTotalSnapshot?.toLocaleString()}</span>
                      <span>•</span>
                      <span>
                        Total Discount: ${req.discountSnapshot?.toLocaleString()}
                      </span>
                      <span>•</span>
                      <span>Gross Margin: {req.marginSnapshot?.toFixed(1)}%</span>
                    </div>

                    {req.reason && (
                      <div className="text-xs text-amber-800 bg-amber-50/60 px-3 py-1.5 rounded-lg border border-amber-200/50 inline-block">
                        <span className="font-semibold">Review trigger:</span> {req.reason}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 self-end md:self-center">
                    <Link
                      to={`/app/approvals/${req._id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>Review & Decide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
