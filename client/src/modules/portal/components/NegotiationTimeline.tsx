import React from 'react';
import { CheckCircle2, Clock, MessageSquare, Send, Award, ArrowRight } from 'lucide-react';
import { NegotiationTimelineEvent } from '../types/portal.types';

interface Props {
  events: NegotiationTimelineEvent[];
  currentStatus: string;
}

export const NegotiationTimeline: React.FC<Props> = ({ events, currentStatus }) => {
  const getEventIcon = (eventTitle: string) => {
    if (eventTitle.includes('Confirmed') || eventTitle.includes('Accepted')) {
      return <Award className="w-4 h-4 text-emerald-600" />;
    }
    if (eventTitle.includes('Counter') || eventTitle.includes('Discount')) {
      return <Send className="w-4 h-4 text-purple-600" />;
    }
    if (eventTitle.includes('Comment') || eventTitle.includes('Request')) {
      return <MessageSquare className="w-4 h-4 text-indigo-600" />;
    }
    return <Clock className="w-4 h-4 text-slate-500" />;
  };

  const getActorBadge = (actor: string) => {
    switch (actor) {
      case 'CUSTOMER':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded">Customer</span>;
      case 'SALES_REP':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded">Sales Team</span>;
      case 'MANAGER':
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded">Reviewer</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-600 rounded">System</span>;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Negotiation & Quote Timeline</span>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-purple-50 text-purple-700 rounded-full border border-purple-200">
              Customer Journey
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent event history of proposal creation, comments, change requests, and confirmation.
          </p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Status</div>
          <div className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-full border border-purple-200 inline-block mt-0.5">
            {currentStatus}
          </div>
        </div>
      </div>

      {/* Progress Milestone Bar */}
      <div className="grid grid-cols-4 gap-2 mb-8 relative">
        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          events.length >= 1 ? 'bg-purple-50 border-purple-200 text-purple-800' : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="text-xs font-bold mb-0.5">1. Proposal Shared</div>
          <div className="text-[10px] opacity-75">Quotation Issued</div>
        </div>
        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          events.some(e => e.event.includes('Comment') || e.event.includes('Request'))
            ? 'bg-purple-50 border-purple-200 text-purple-800'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="text-xs font-bold mb-0.5">2. Collaboration</div>
          <div className="text-[10px] opacity-75">Comments & Requests</div>
        </div>
        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          events.some(e => e.event.includes('Counter') || e.event.includes('Discount'))
            ? 'bg-purple-50 border-purple-200 text-purple-800'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="text-xs font-bold mb-0.5">3. Counter Proposal</div>
          <div className="text-[10px] opacity-75">Commercial Alignment</div>
        </div>
        <div className={`p-2.5 rounded-xl border text-center transition-all ${
          currentStatus === 'CONFIRMED'
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
            : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="text-xs font-bold mb-0.5">4. Confirmation</div>
          <div className="text-[10px] opacity-75">Final Order Binding</div>
        </div>
      </div>

      {/* Timeline Event Items List */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {events.map((evt, idx) => (
          <div key={evt.id || idx} className="relative flex items-start space-x-3 group">
            {/* Timeline Dot Icon */}
            <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-purple-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            </div>

            <div className="flex-1 bg-slate-50/80 rounded-xl p-3.5 border border-slate-100 hover:border-purple-200 hover:bg-purple-50/30 transition-all">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <div className="p-1 rounded bg-white shadow-xs border border-slate-100">
                    {getEventIcon(evt.event)}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{evt.event}</span>
                  {getActorBadge(evt.actor)}
                </div>
                <time className="text-[11px] font-medium text-slate-400">
                  {new Date(evt.timestamp).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">{evt.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
