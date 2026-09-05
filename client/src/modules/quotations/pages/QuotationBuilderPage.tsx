import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { QuotationService } from '../services/quotation.service';
import {
  Customer,
  Product,
  QuotationLineInput,
  CommercialSummary,
  RiskEvaluation,
} from '../types/quotation.types';
import { QuotationNavbar } from '../components/QuotationNavbar';
import { CommercialSummaryCard } from '../components/CommercialSummaryCard';
import {
  Plus,
  Trash2,
  Save,
  Send,
  ArrowLeft,
  AlertCircle,
  Building,
  DollarSign,
  Calendar,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface BuilderLineItem extends QuotationLineInput {
  id: string; // client temporary ID
  productName?: string;
  sku?: string;
  categoryName?: string;
  costPrice?: number;
  lineSubtotal: number;
  discountAmount: number;
  lineTotal: number;
  lineCost: number;
  lineMargin: number;
  lineMarginPercent: number;
  governanceWarning?: string;
}

export const QuotationBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  // Meta data
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [lines, setLines] = useState<BuilderLineItem[]>([]);

  // Commercial & Risk preview state
  const [summary, setSummary] = useState<CommercialSummary>({
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    grandTotal: 0,
    costTotal: 0,
    grossMargin: 0,
    grossMarginPercent: 0,
  });

  const [risk, setRisk] = useState<RiskEvaluation>({
    score: 0,
    level: 'LOW',
    factors: ['Commercial parameters are within normal sales thresholds'],
    requiresApproval: false,
  });

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load Customers & Products
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingMeta(true);
        const [custRes, prodRes] = await Promise.all([
          QuotationService.getCustomers(),
          QuotationService.getProducts(),
        ]);
        setCustomers(custRes);
        setProducts(prodRes);

        // If editing existing quote, fetch its data
        if (id) {
          const quote = await QuotationService.getQuotationById(id);
          const customerId =
            typeof quote.customerId === 'object' ? (quote.customerId as any)._id : quote.customerId;
          setSelectedCustomerId(customerId);
          setCurrency(quote.currency || 'USD');
          if (quote.validUntil) {
            setValidUntil(new Date(quote.validUntil).toISOString().split('T')[0]);
          }
          setNotes(quote.notes || '');

          // Map quote lines
          const mappedLines: BuilderLineItem[] = (quote.lines || []).map((l, index) => ({
            id: `line-${Date.now()}-${index}`,
            productId: l.productId,
            productName: l.productNameSnapshot,
            sku: l.productSkuSnapshot,
            categoryName: l.productCategorySnapshot,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            costPrice: l.costPriceSnapshot,
            discountPercent: l.discountPercent,
            taxPercent: l.taxPercent || 0,
            lineSubtotal: l.lineSubtotal,
            discountAmount: l.discountAmount,
            lineTotal: l.lineTotal,
            lineCost: l.lineCost,
            lineMargin: l.lineMargin,
            lineMarginPercent: l.lineMarginPercent,
            governanceWarning: l.governanceReason,
          }));
          setLines(mappedLines);
        } else if (custRes.length > 0 && prodRes.length > 0) {
          // Defaults for new quote
          setSelectedCustomerId(custRes[0]._id);
          // Set initial line with first product
          const p = prodRes[0];
          const initialLine: BuilderLineItem = {
            id: `line-${Date.now()}`,
            productId: p._id,
            productName: p.name,
            sku: p.sku,
            categoryName: typeof p.categoryId === 'object' ? p.categoryId.name : 'Hardware',
            quantity: 1,
            unitPrice: p.basePrice,
            costPrice: p.costPrice,
            discountPercent: 0,
            taxPercent: 0,
            lineSubtotal: p.basePrice,
            discountAmount: 0,
            lineTotal: p.basePrice,
            lineCost: p.costPrice,
            lineMargin: p.basePrice - p.costPrice,
            lineMarginPercent:
              p.basePrice > 0 ? ((p.basePrice - p.costPrice) / p.basePrice) * 100 : 0,
          };
          setLines([initialLine]);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Failed to load builder metadata');
      } finally {
        setLoadingMeta(false);
      }
    };

    loadInitialData();
  }, [id]);

  // Recalculate summary and governance preview whenever lines or customer changes
  useEffect(() => {
    if (!selectedCustomerId || lines.length === 0) {
      setSummary({
        subtotal: 0,
        totalDiscount: 0,
        totalTax: 0,
        grandTotal: 0,
        costTotal: 0,
        grossMargin: 0,
        grossMarginPercent: 0,
      });
      setRisk({
        score: 0,
        level: 'LOW',
        factors: ['Add products to see commercial governance analysis'],
        requiresApproval: false,
      });
      return;
    }

    const triggerRecalculate = async () => {
      try {
        const payload = {
          customerId: selectedCustomerId,
          currency,
          lines: lines.map((l) => ({
            productId: l.productId,
            quantity: l.quantity,
            unitPrice: l.unitPrice,
            discountPercent: l.discountPercent,
            taxPercent: l.taxPercent || 0,
          })),
        };

        const result = await QuotationService.recalculateDraft(payload);
        setSummary(result.summary);
        setRisk(result.risk);

        // Sync calculated line numbers and warnings back to local state
        setLines((prev) =>
          prev.map((pl, idx) => {
            const calculated = result.lines[idx];
            if (!calculated) return pl;
            return {
              ...pl,
              lineSubtotal: calculated.lineSubtotal,
              discountAmount: calculated.discountAmount,
              lineTotal: calculated.lineTotal,
              lineMargin: calculated.lineMargin,
              lineMarginPercent: calculated.lineMarginPercent,
              governanceWarning:
                calculated.governanceDecision !== 'WITHIN_LIMIT'
                  ? calculated.governanceReason
                  : undefined,
            };
          })
        );
      } catch (err) {
        // Silently catch live preview calculation errors while typing
      }
    };

    const timeout = setTimeout(triggerRecalculate, 250);
    return () => clearTimeout(timeout);
  }, [selectedCustomerId, lines.length, lines.map((l) => `${l.productId}-${l.quantity}-${l.unitPrice}-${l.discountPercent}`).join('|')]);

  // Handlers for modifying line items
  const handleAddLine = () => {
    if (products.length === 0) return;
    const p = products[0];
    const newLine: BuilderLineItem = {
      id: `line-${Date.now()}-${Math.random()}`,
      productId: p._id,
      productName: p.name,
      sku: p.sku,
      categoryName: typeof p.categoryId === 'object' ? p.categoryId.name : 'General',
      quantity: 1,
      unitPrice: p.basePrice,
      costPrice: p.costPrice,
      discountPercent: 0,
      taxPercent: 0,
      lineSubtotal: p.basePrice,
      discountAmount: 0,
      lineTotal: p.basePrice,
      lineCost: p.costPrice,
      lineMargin: p.basePrice - p.costPrice,
      lineMarginPercent: p.basePrice > 0 ? ((p.basePrice - p.costPrice) / p.basePrice) * 100 : 0,
    };
    setLines([...lines, newLine]);
  };

  const handleRemoveLine = (idToRemove: string) => {
    if (lines.length <= 1) {
      alert('Quotation must have at least one line item');
      return;
    }
    setLines(lines.filter((l) => l.id !== idToRemove));
  };

  const handleProductChange = (lineId: string, newProductId: string) => {
    const p = products.find((prod) => prod._id === newProductId);
    if (!p) return;

    setLines(
      lines.map((l) => {
        if (l.id !== lineId) return l;
        const subtotal = l.quantity * p.basePrice;
        const discPercent = l.discountPercent ?? 0;
        const discAmt = subtotal * (discPercent / 100);
        const total = subtotal - discAmt;
        const cost = l.quantity * p.costPrice;
        const margin = total - cost;
        const marginPct = total > 0 ? (margin / total) * 100 : 0;

        return {
          ...l,
          productId: p._id,
          productName: p.name,
          sku: p.sku,
          categoryName: typeof p.categoryId === 'object' ? p.categoryId.name : 'General',
          unitPrice: p.basePrice,
          costPrice: p.costPrice,
          lineSubtotal: subtotal,
          discountAmount: discAmt,
          lineTotal: total,
          lineMargin: margin,
          lineMarginPercent: marginPct,
        };
      })
    );
  };

  const handleLineFieldChange = (
    lineId: string,
    field: 'quantity' | 'unitPrice' | 'discountPercent',
    value: number
  ) => {
    setLines(
      lines.map((l) => {
        if (l.id !== lineId) return l;
        const updated = { ...l, [field]: value };
        const unitPrice = updated.unitPrice ?? 0;
        const discPercent = updated.discountPercent ?? 0;
        const subtotal = updated.quantity * unitPrice;
        const discAmt = subtotal * (discPercent / 100);
        const total = subtotal - discAmt;
        const cost = updated.quantity * (updated.costPrice || 0);
        const margin = total - cost;
        const marginPct = total > 0 ? (margin / total) * 100 : 0;

        return {
          ...updated,
          lineSubtotal: subtotal,
          discountAmount: discAmt,
          lineTotal: total,
          lineMargin: margin,
          lineMarginPercent: marginPct,
        };
      })
    );
  };

  // Save Quotation (Draft)
  const handleSave = async (andSubmit = false) => {
    if (!selectedCustomerId) {
      setErrorMessage('Please select a customer');
      return;
    }
    if (lines.length === 0) {
      setErrorMessage('Add at least one line item');
      return;
    }

    try {
      setSaving(true);
      setErrorMessage(null);

      const payload = {
        customerId: selectedCustomerId,
        currency,
        validUntil: validUntil || undefined,
        notes,
        lines: lines.map((l) => ({
          productId: l.productId,
          quantity: Number(l.quantity),
          unitPrice: Number(l.unitPrice),
          discountPercent: Number(l.discountPercent),
          taxPercent: Number(l.taxPercent || 0),
        })),
      };

      let savedQuote;
      if (isEditing && id) {
        savedQuote = await QuotationService.updateQuotation(id, payload);
      } else {
        savedQuote = await QuotationService.createQuotation(payload);
      }

      if (andSubmit) {
        const submitted = await QuotationService.submitQuotation(savedQuote._id);
        alert(
          submitted.status === 'APPROVED'
            ? `Quotation ${submitted.quotationNumber} approved within standard authority!`
            : `Quotation ${submitted.quotationNumber} submitted for management approval.`
        );
        navigate(`/app/quotations/${submitted._id}`);
      } else {
        alert(`Quotation ${savedQuote.quotationNumber} saved as draft!`);
        navigate(`/app/quotations/${savedQuote._id}`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save quotation');
    } finally {
      setSaving(false);
    }
  };

  const selectedCustomer = customers.find((c) => c._id === selectedCustomerId);

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col font-sans">
      <QuotationNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Breadcrumb & Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/app/quotations"
              className="p-2 hover:bg-white rounded-lg border border-gray-200 text-gray-600 transition-colors"
              title="Back to Quotations"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                {isEditing ? 'Edit Quotation' : 'Create Quotation'}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Configure deal terms with automated discount governance & margin validation.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleSave(false)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Draft
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-purple-200 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              Submit for Approval
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold">Quotation Validation Warning</div>
              <div className="text-xs text-rose-700 mt-0.5">{errorMessage}</div>
            </div>
          </div>
        )}

        {/* 2-Column Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Left Form Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Customer & Parameters Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-4">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Building className="w-4 h-4 text-purple-600" />
                Customer & Deal Settings
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Customer Dropdown */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="block text-xs font-medium text-gray-700">
                    Customer <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="">-- Select Customer --</option>
                    {customers.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name} ({c.company}) — Tier: {c.tier}
                      </option>
                    ))}
                  </select>
                  {selectedCustomer && (
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                      <span>Tier:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        {selectedCustomer.tier}
                      </span>
                      <span>Email: {selectedCustomer.email}</span>
                    </div>
                  )}
                </div>

                {/* Currency */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              {/* Validity Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-gray-700">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Line Items Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-600" />
                  Quotation Line Items ({lines.length})
                </h3>
                <button
                  type="button"
                  onClick={handleAddLine}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-lg border border-purple-200 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Line Item
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                {lines.map((line, index) => (
                  <div key={line.id} className="p-5 hover:bg-gray-50/50 transition-colors space-y-3">
                    {/* Line Header & Product Select */}
                    <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
                      <div className="flex-1 w-full">
                        <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                          Product #{index + 1}
                        </label>
                        <select
                          value={line.productId}
                          onChange={(e) => handleProductChange(line.id, e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        >
                          {products.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name} (SKU: {p.sku}) — Standard: ${p.basePrice.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="text-xs text-gray-500 self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(line.id)}
                          className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Numeric Inputs: Qty, Unit Price, Discount % */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 items-center">
                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={line.quantity}
                          onChange={(e) =>
                            handleLineFieldChange(
                              line.id,
                              'quantity',
                              Math.max(1, parseInt(e.target.value) || 1)
                            )
                          }
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Unit Price ($)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={line.unitPrice}
                          onChange={(e) =>
                            handleLineFieldChange(
                              line.id,
                              'unitPrice',
                              Math.max(0, parseFloat(e.target.value) || 0)
                            )
                          }
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.5"
                          value={line.discountPercent}
                          onChange={(e) =>
                            handleLineFieldChange(
                              line.id,
                              'discountPercent',
                              Math.min(100, Math.max(0, parseFloat(e.target.value) || 0))
                            )
                          }
                          className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>

                      <div className="text-right">
                        <div className="text-[11px] font-medium text-gray-500">Line Total</div>
                        <div className="text-sm font-bold text-gray-900">
                          ${(line.lineTotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <div className="text-[10px] text-gray-500">
                          Margin: {line.lineMarginPercent ? line.lineMarginPercent.toFixed(1) : 0}%
                        </div>
                      </div>
                    </div>

                    {/* Governance warning alert if triggered */}
                    {line.governanceWarning && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-xs">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                        <span>{line.governanceWarning}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5 space-y-2">
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Deal Notes & Internal Justification
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add commercial justification, non-standard terms, or customer context for reviewers..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          {/* Right Sidebar: Commercial & Risk Evaluation Summary (4 cols) */}
          <div className="lg:col-span-4">
            <CommercialSummaryCard summary={summary} risk={risk} currency={currency} />
          </div>
        </div>
      </main>
    </div>
  );
};
