import React, { useState, useEffect } from 'react';
import { DealTwinService, SimulationResult } from '../services/deal-twin.service';
import { QuotationService } from '@/modules/quotations/services/quotation.service';
import { Quotation } from '@/modules/quotations/types/quotation.types';
import {
  Sparkles,
  Sliders,
  TrendingUp,
  Percent,
  DollarSign,
  ShieldCheck,
  Zap,
  ArrowRight,
  History,
  CheckCircle2,
} from 'lucide-react';

export const DealTwinPage: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Simulation Controls
  const [discountTweak, setDiscountTweak] = useState<number>(0);
  const [volumeMult, setVolumeMult] = useState<number>(1.0);
  const [paymentTerms, setPaymentTerms] = useState<string>('Net 30');

  // Simulation Results
  const [currentResult, setCurrentResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [history, setHistory] = useState<SimulationResult[]>([]);

  useEffect(() => {
    QuotationService.getQuotations({ limit: 50 }).then((res) => {
      setQuotations(res.data);
      if (res.data.length > 0) {
        setSelectedQuoteId(res.data[0]._id);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!selectedQuoteId) return;

    const runSim = async () => {
      try {
        setSimulating(true);
        const [sim, hist] = await Promise.all([
          DealTwinService.simulate({
            quotationId: selectedQuoteId,
            discountTweakPercent: discountTweak,
            volumeMultiplier: volumeMult,
            paymentTerms,
          }),
          DealTwinService.getSimulations(selectedQuoteId),
        ]);
        setCurrentResult(sim);
        setHistory(hist);
      } catch (err) {
        console.error('Simulation error', err);
      } finally {
        setSimulating(false);
      }
    };

    const debounce = setTimeout(runSim, 200);
    return () => clearTimeout(debounce);
  }, [selectedQuoteId, discountTweak, volumeMult, paymentTerms]);

  const handleApplyBestPath = async () => {
    if (!selectedQuoteId) return;
    try {
      setSimulating(true);
      const best = await DealTwinService.getBestPath(selectedQuoteId);
      setCurrentResult(best);
      setDiscountTweak(best.discountTweakPercent);
      setVolumeMult(best.volumeMultiplier);
      setPaymentTerms(best.paymentTerms);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  const selectedQuote = quotations.find((q) => q._id === selectedQuoteId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">DealTwin AI Simulation Workspace</h1>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-[#6344e7] uppercase tracking-wider">
              Generative RevOps Twin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Simulate commercial scenarios, test discount concessions vs. payment terms elasticity, and discover the optimal path to close.
          </p>
        </div>

        {/* Quotation Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Target Deal:</label>
          <select
            value={selectedQuoteId}
            onChange={(e) => setSelectedQuoteId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
          >
            {quotations.map((q) => (
              <option key={q._id} value={q._id}>
                {q.quotationNumber} — {typeof q.customerId === 'object' ? q.customerId.name : 'Deal'} (${q.grandTotal?.toLocaleString()})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Scenario Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-[#6344e7]" />
                Interactive Deal Levers
              </h3>
              <button
                type="button"
                onClick={handleApplyBestPath}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-[#6344e7] rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                <Zap className="w-3 h-3 text-[#6344e7]" />
                Auto-Optimize Best Path
              </button>
            </div>

            {/* Slider 1: Discount Delta */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Discount Concession</span>
                <span className="font-mono font-bold text-[#6344e7] bg-purple-50 px-2 py-0.5 rounded">
                  {discountTweak > 0 ? `+${discountTweak}%` : `${discountTweak}%`}
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="25"
                step="1"
                value={discountTweak}
                onChange={(e) => setDiscountTweak(Number(e.target.value))}
                className="w-full accent-[#6344e7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>-10% (Protect Margin)</span>
                <span>0% (Baseline)</span>
                <span>+25% (Aggressive Concession)</span>
              </div>
            </div>

            {/* Slider 2: Volume Multiplier */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Volume / Order Scale</span>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  {volumeMult}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.25"
                value={volumeMult}
                onChange={(e) => setVolumeMult(Number(e.target.value))}
                className="w-full accent-[#6344e7] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.5x</span>
                <span>1.0x (Current Scope)</span>
                <span>2.5x (Enterprise Rollout)</span>
              </div>
            </div>

            {/* Control 3: Payment Terms */}
            <div className="space-y-2">
              <span className="block text-xs font-semibold text-slate-700">Payment & Working Capital Terms</span>
              <div className="grid grid-cols-3 gap-2">
                {['Net 15', 'Net 30', 'Net 60'].map((term) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => setPaymentTerms(term)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      paymentTerms === term
                        ? 'border-purple-300 bg-purple-50 text-[#6344e7] ring-1 ring-[#6344e7]'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Baseline Context */}
            {selectedQuote && (
              <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                <div className="flex justify-between">
                  <span>Current Quote Value:</span>
                  <span className="font-bold text-slate-800">${selectedQuote.grandTotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Baseline Margin:</span>
                  <span className="font-bold text-emerald-600">{selectedQuote.grossMarginPercent?.toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Predictive Forecast & Best Path (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Key Forecast Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Win Probability */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Win Probability</span>
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {currentResult ? `${currentResult.winProbabilityPercent}%` : '--'}
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${currentResult?.winProbabilityPercent || 0}%` }}
                ></div>
              </div>
            </div>

            {/* Projected Net Revenue */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Projected Revenue</span>
                <DollarSign className="w-4 h-4 text-[#6344e7]" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                ${currentResult ? currentResult.projectedRevenue?.toLocaleString() : '--'}
              </div>
              <span className="text-[10px] text-slate-500">After simulated discounts</span>
            </div>

            {/* Projected Gross Margin */}
            <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Projected Margin</span>
                <Percent className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {currentResult ? `${currentResult.projectedMarginPercent}%` : '--'}
              </div>
              <span className="text-[10px] text-emerald-600 font-semibold">Net profit protection</span>
            </div>
          </div>

          {/* AI Strategic Best Path Recommendation Card */}
          <div className="bg-gradient-to-br from-purple-50/80 to-white border border-purple-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6344e7]" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Optimal Deal Frontier Recommendation
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  currentResult?.governancePrediction === 'WITHIN_LIMIT'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : currentResult?.governancePrediction === 'APPROVAL_REQUIRED'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                Prediction: {currentResult?.governancePrediction || 'EVALUATING'}
              </span>
            </div>

            <p className="text-xs text-slate-700 font-medium leading-relaxed bg-white/80 border border-purple-100 p-3.5 rounded-xl">
              {currentResult?.bestPathRecommendation || 'Calculating optimal frontier trade-offs...'}
            </p>
          </div>

          {/* Simulation History Table */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-2">
              <History className="w-3.5 h-3.5 text-slate-500" />
              Recent What-If Scenarios
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                    <th className="py-2 px-3 font-semibold">Concession</th>
                    <th className="py-2 px-3 font-semibold">Volume</th>
                    <th className="py-2 px-3 font-semibold">Terms</th>
                    <th className="py-2 px-3 font-semibold">Win Rate</th>
                    <th className="py-2 px-3 font-semibold">Margin %</th>
                    <th className="py-2 px-3 font-semibold">Gov Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {history.slice(0, 4).map((h) => (
                    <tr key={h._id} className="hover:bg-slate-50/50">
                      <td className="py-2 px-3 font-mono font-semibold text-[#6344e7]">
                        {h.discountTweakPercent > 0 ? `+${h.discountTweakPercent}%` : `${h.discountTweakPercent}%`}
                      </td>
                      <td className="py-2 px-3">{h.volumeMultiplier}x</td>
                      <td className="py-2 px-3 text-slate-600">{h.paymentTerms}</td>
                      <td className="py-2 px-3 font-bold text-emerald-600">{h.winProbabilityPercent}%</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{h.projectedMarginPercent}%</td>
                      <td className="py-2 px-3">
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                          {h.governancePrediction}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
