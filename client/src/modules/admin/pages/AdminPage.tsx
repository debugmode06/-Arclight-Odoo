import React, { useState, useEffect } from 'react';
import { AdminService } from '../services/admin.service';
import {
  ShieldCheck,
  Layers,
  Package,
  Warehouse,
  Repeat,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  DollarSign,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'approvals' | 'catalog' | 'warehouses' | 'subscriptions'>('rules');
  const [loading, setLoading] = useState(true);

  // Data states
  const [discountRules, setDiscountRules] = useState<any[]>([]);
  const [approvalRules, setApprovalRules] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<any[]>([]);

  // Create modals state
  const [showRuleModal, setShowRuleModal] = useState(false);
  const [newRuleName, setNewRuleName] = useState('');
  const [newRuleMaxDiscount, setNewRuleMaxDiscount] = useState(25);
  const [newRuleThreshold, setNewRuleThreshold] = useState(12);
  const [newRuleMinMargin, setNewRuleMinMargin] = useState(20);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [dr, ar, pr, wh, inv, sp] = await Promise.all([
        AdminService.getDiscountRules(),
        AdminService.getApprovalRules(),
        AdminService.getProducts(),
        AdminService.getWarehouses(),
        AdminService.getInventory(),
        AdminService.getSubscriptionPlans(),
      ]);
      setDiscountRules(dr);
      setApprovalRules(ar);
      setProducts(pr);
      setWarehouses(wh);
      setInventory(inv);
      setSubscriptionPlans(sp);
    } catch (err) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await AdminService.createDiscountRule({
        name: newRuleName,
        maxAllowedDiscount: Number(newRuleMaxDiscount),
        approvalThresholdDiscount: Number(newRuleThreshold),
        minMarginPercent: Number(newRuleMinMargin),
        priority: 5,
        isActive: true,
      });
      setShowRuleModal(false);
      setNewRuleName('');
      loadAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <span>Admin & Governance Configuration</span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-[#6344e7] border border-purple-200/70">
              System Console
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure discount ceilings, approval chains, product pricing, warehouse weighting, and subscription rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'rules' && (
            <button
              onClick={() => setShowRuleModal(true)}
              className="px-3 py-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Discount Rule</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'rules' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Discount Governance Rules ({discountRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('approvals')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'approvals' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Approval Chains ({approvalRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'catalog' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Products & Pricing ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('warehouses')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'warehouses' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Warehouse className="w-3.5 h-3.5" />
          <span>Warehouses & Stock ({warehouses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'subscriptions' ? 'bg-purple-50 text-[#6344e7]' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>Subscription Plans ({subscriptionPlans.length})</span>
        </button>
      </div>

      {/* Tab 1: Discount Governance Rules */}
      {activeTab === 'rules' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configured Discount Ceilings</h3>
              <p className="text-xs text-slate-500">
                Authoritative rules evaluated during quotation creation across customer tiers and product categories.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Rule Name</th>
                  <th className="py-2.5 px-3 font-semibold">Scope / Tier</th>
                  <th className="py-2.5 px-3 font-semibold">Rep Authority Ceiling</th>
                  <th className="py-2.5 px-3 font-semibold">Hard Policy Max</th>
                  <th className="py-2.5 px-3 font-semibold">Min Margin Required</th>
                  <th className="py-2.5 px-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {discountRules.map((rule) => (
                  <tr key={rule._id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-slate-800">{rule.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6344e7] border border-purple-100">
                        {rule.customerTier || rule.categoryId?.name || 'GLOBAL'}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-600">{rule.approvalThresholdDiscount}%</td>
                    <td className="py-3 px-3 font-semibold text-rose-600">{rule.maxAllowedDiscount}%</td>
                    <td className="py-3 px-3 text-slate-600">{rule.minMarginPercent || 20}%</td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Approval Chains */}
      {activeTab === 'approvals' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Sequential Approval Routing Policy</h3>
            <p className="text-xs text-slate-500">
              Deterministic routing matrix based on discount excess and blended deal risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-emerald-800">Tier 1: Standard Authority</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">0% – 8%</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">Self-approved within standard sales rep authority.</p>
              <div className="text-[11px] font-semibold text-emerald-700">Approver: SALES_REP (Auto-approved)</div>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-amber-800">Tier 2: Manager Review</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-100 text-amber-700">8% – 15%</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">Requires single-step commercial management authorization.</p>
              <div className="text-[11px] font-semibold text-amber-700">Approver: SALES_MANAGER</div>
            </div>

            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-rose-800">Tier 3: Executive Finance</span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-700">&gt; 15%</span>
              </div>
              <p className="text-xs text-slate-600 mb-2">Multi-step sequential chain: Sales Manager then Finance Ops.</p>
              <div className="text-[11px] font-semibold text-rose-700">Chain: SALES_MANAGER → FINANCE</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Catalog & Products */}
      {activeTab === 'catalog' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Product Catalog & Base Prices</h3>
              <p className="text-xs text-slate-500">Managed products, base list pricing, and unit cost baselines.</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                  <th className="py-2.5 px-3 font-semibold">Product Name</th>
                  <th className="py-2.5 px-3 font-semibold">SKU</th>
                  <th className="py-2.5 px-3 font-semibold">Category</th>
                  <th className="py-2.5 px-3 font-semibold">Base Price</th>
                  <th className="py-2.5 px-3 font-semibold">Cost Price</th>
                  <th className="py-2.5 px-3 font-semibold">Base Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((prod) => {
                  const baseMargin = prod.basePrice ? (((prod.basePrice - prod.costPrice) / prod.basePrice) * 100).toFixed(1) : '0.0';
                  return (
                    <tr key={prod._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold text-slate-800">{prod.name}</td>
                      <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{prod.sku}</td>
                      <td className="py-3 px-3 text-slate-600">{prod.categoryId?.name || 'General'}</td>
                      <td className="py-3 px-3 font-semibold text-slate-800">${prod.basePrice?.toLocaleString()}</td>
                      <td className="py-3 px-3 text-slate-500">${prod.costPrice?.toLocaleString()}</td>
                      <td className="py-3 px-3 font-bold text-emerald-600">{baseMargin}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Warehouses & Stock */}
      {activeTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {warehouses.map((wh) => (
              <div key={wh._id} className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-slate-900">{wh.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-50 text-[#6344e7] border border-purple-100">
                    {wh.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">Location: {wh.location}</p>
                <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                  <span className="text-slate-500">Shipping Cost Weight:</span>
                  <span className="font-bold text-slate-800">{wh.shippingCostWeight}x</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3">Inventory Balances by Warehouse</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-500">
                    <th className="py-2.5 px-3 font-semibold">Warehouse</th>
                    <th className="py-2.5 px-3 font-semibold">Product</th>
                    <th className="py-2.5 px-3 font-semibold">Available Stock</th>
                    <th className="py-2.5 px-3 font-semibold">Reserved</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventory.map((inv) => (
                    <tr key={inv._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-bold text-slate-800">{inv.warehouseId?.name} ({inv.warehouseId?.code})</td>
                      <td className="py-3 px-3 text-slate-700">{inv.productId?.name}</td>
                      <td className="py-3 px-3 font-bold text-purple-700">{inv.availableQuantity} units</td>
                      <td className="py-3 px-3 text-slate-400">{inv.reservedQuantity || 0} units</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: Subscription Plans */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recurring Subscription Plans & Proration Rules</h3>
              <p className="text-xs text-slate-500">Configured recurring billing cycles and proration algorithms.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {subscriptionPlans.map((plan) => (
              <div key={plan._id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">{plan.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-[#6344e7]">
                    {plan.billingCycle}
                  </span>
                </div>
                <div className="text-lg font-extrabold text-slate-900 mb-2">
                  ${plan.basePrice?.toLocaleString()}
                  <span className="text-xs font-normal text-slate-500"> / cycle</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{plan.description}</p>
                <div className="text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                  Proration: <span className="font-semibold text-purple-700">{plan.prorationRule}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for adding rule */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4">Add Discount Ceiling Rule</h3>
            <form onSubmit={handleCreateRule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rule Name</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="Enterprise Hardware Tier Ceiling"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rep Ceiling (%)</label>
                  <input
                    type="number"
                    required
                    value={newRuleThreshold}
                    onChange={(e) => setNewRuleThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hard Policy Max (%)</label>
                  <input
                    type="number"
                    required
                    value={newRuleMaxDiscount}
                    onChange={(e) => setNewRuleMaxDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Minimum Margin (%)</label>
                <input
                  type="number"
                  required
                  value={newRuleMinMargin}
                  onChange={(e) => setNewRuleMinMargin(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowRuleModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#6344e7] hover:bg-[#5233d4] text-white rounded-xl font-semibold shadow-xs"
                >
                  Save Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
