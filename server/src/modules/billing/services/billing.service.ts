import { Invoice, IInvoice, SubscriptionTier } from '../models/billing.model';
import { NotFoundError } from '../../../shared';

export interface BillingCalculateRequest {
  subscriptionPlan?: SubscriptionTier;
  ordersProcessed: number;
  warehouseStoragePallets: number;
  apiCalls: number;
  freightSurcharge?: number;
  includeSetupFee?: boolean;
  discountAmount?: number;
}

export class BillingService {
  /**
   * Calculate tiered order processing charges:
   * Tier 1 (0 - 1,000): $0.50/order
   * Tier 2 (1,001 - 5,000): $0.35/order
   * Tier 3 (5,000+): $0.20/order
   */
  public calculateTieredOrderCost(orders: number) {
    let tier1Orders = 0;
    let tier2Orders = 0;
    let tier3Orders = 0;

    if (orders <= 1000) {
      tier1Orders = orders;
    } else if (orders <= 5000) {
      tier1Orders = 1000;
      tier2Orders = orders - 1000;
    } else {
      tier1Orders = 1000;
      tier2Orders = 4000;
      tier3Orders = orders - 5000;
    }

    const tier1Cost = tier1Orders * 0.50;
    const tier2Cost = tier2Orders * 0.35;
    const tier3Cost = tier3Orders * 0.20;
    const totalOrderCost = tier1Cost + tier2Cost + tier3Cost;

    return {
      tier1Orders,
      tier1Cost: Number(tier1Cost.toFixed(2)),
      tier2Orders,
      tier2Cost: Number(tier2Cost.toFixed(2)),
      tier3Orders,
      tier3Cost: Number(tier3Cost.toFixed(2)),
      totalOrderCost: Number(totalOrderCost.toFixed(2)),
    };
  }

  /**
   * Calculate full real-time hybrid bill breakdown
   */
  public calculateHybridBill(req: BillingCalculateRequest) {
    const plan = req.subscriptionPlan || 'PROFESSIONAL';
    const baseSubscriptionFee = plan === 'STARTER' ? 199 : plan === 'ENTERPRISE' ? 999 : 499;
    const setupFee = req.includeSetupFee ? 1200 : 0;

    // Order Tiered Calculation
    const orderPricing = this.calculateTieredOrderCost(req.ordersProcessed || 0);

    // Storage Pallet Calculation ($25/pallet)
    const storageCost = Number(((req.warehouseStoragePallets || 0) * 25).toFixed(2));

    // API Calls Calculation ($0.001 / call)
    const apiCallCost = Number(((req.apiCalls || 0) * 0.001).toFixed(2));

    // Freight Surcharge
    const freightSurcharge = Number((req.freightSurcharge || 0).toFixed(2));

    // Total Usage Metered Charges
    const totalUsageCost = Number(
      (orderPricing.totalOrderCost + storageCost + apiCallCost + freightSurcharge).toFixed(2)
    );

    // Subtotal
    const subtotal = Number(
      (baseSubscriptionFee + setupFee + totalUsageCost).toFixed(2)
    );

    const discount = req.discountAmount || 0;
    const taxableAmount = Math.max(0, subtotal - discount);
    const taxRate = 0.18; // 18% GST / VAT
    const taxAmount = Number((taxableAmount * taxRate).toFixed(2));
    const totalPayable = Number((taxableAmount + taxAmount).toFixed(2));

    const lineItems: Array<{
      description: string;
      category: 'SUBSCRIPTION' | 'USAGE' | 'SETUP' | 'FREIGHT' | 'DISCOUNT';
      quantity: number;
      unitPrice: number;
      amount: number;
    }> = [
      {
        description: `Monthly Subscription Plan (${plan})`,
        category: 'SUBSCRIPTION',
        quantity: 1,
        unitPrice: baseSubscriptionFee,
        amount: baseSubscriptionFee,
      },
    ];

    if (setupFee > 0) {
      lineItems.push({
        description: 'One-Time System Integration & Setup Fee',
        category: 'SETUP',
        quantity: 1,
        unitPrice: setupFee,
        amount: setupFee,
      });
    }

    lineItems.push(
      {
        description: `Order Fulfillment Processing (${req.ordersProcessed} orders - Tiered)`,
        category: 'USAGE',
        quantity: req.ordersProcessed,
        unitPrice: Number((orderPricing.totalOrderCost / Math.max(1, req.ordersProcessed)).toFixed(4)),
        amount: orderPricing.totalOrderCost,
      },
      {
        description: `Warehouse Pallet Storage (${req.warehouseStoragePallets} pallets @ $25/mo)`,
        category: 'USAGE',
        quantity: req.warehouseStoragePallets,
        unitPrice: 25,
        amount: storageCost,
      },
      {
        description: `DealFlow360 API Infrastructure Calls (${req.apiCalls.toLocaleString()} requests)`,
        category: 'USAGE',
        quantity: req.apiCalls,
        unitPrice: 0.001,
        amount: apiCallCost,
      }
    );

    if (freightSurcharge > 0) {
      lineItems.push({
        description: 'Blended Multi-Warehouse Freight Surcharge',
        category: 'FREIGHT',
        quantity: 1,
        unitPrice: freightSurcharge,
        amount: freightSurcharge,
      });
    }

    if (discount > 0) {
      lineItems.push({
        description: 'Enterprise Promo / Loyalty Volume Discount',
        category: 'DISCOUNT',
        quantity: 1,
        unitPrice: -discount,
        amount: -discount,
      });
    }

    return {
      subscriptionPlan: plan,
      baseSubscriptionFee,
      setupFee,
      orderPricing,
      storageCost,
      apiCallCost,
      freightSurcharge,
      totalUsageCost,
      subtotal,
      discountAmount: discount,
      taxRate,
      taxAmount,
      totalPayable,
      lineItems,
    };
  }

  /**
   * Generate Invoice and persist to DB
   */
  public async generateInvoice(
    req: BillingCalculateRequest & { customerName?: string }
  ): Promise<IInvoice> {
    const calc = this.calculateHybridBill(req);
    const count = await Invoice.countDocuments();
    const invoiceNumber = `INV-2026-${String(count + 1).padStart(4, '0')}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 15);

    const invoice = new Invoice({
      invoiceNumber,
      customerName: req.customerName || 'Acme Industries Ltd.',
      billingPeriod: 'Sep 2026',
      subscriptionPlan: calc.subscriptionPlan,
      baseSubscriptionFee: calc.baseSubscriptionFee,
      setupFee: calc.setupFee,
      usageMetrics: {
        ordersProcessed: req.ordersProcessed,
        warehouseStoragePallets: req.warehouseStoragePallets,
        apiCalls: req.apiCalls,
        freightSurcharge: req.freightSurcharge || 0,
      },
      lineItems: calc.lineItems,
      subtotal: calc.subtotal,
      taxRate: calc.taxRate,
      taxAmount: calc.taxAmount,
      discountAmount: calc.discountAmount,
      totalPayable: calc.totalPayable,
      status: 'PENDING',
      dueDate,
    });

    return await invoice.save();
  }

  /**
   * List Invoices
   */
  public async listInvoices(): Promise<IInvoice[]> {
    let invoices: IInvoice[] = await Invoice.find().sort({ createdAt: -1 });
    if (invoices.length === 0) {
      // Seed default sample invoice for Acme Industries
      const seed = await this.generateInvoice({
        subscriptionPlan: 'PROFESSIONAL',
        ordersProcessed: 2450,
        warehouseStoragePallets: 45,
        apiCalls: 120000,
        freightSurcharge: 180,
        includeSetupFee: true,
        discountAmount: 150,
        customerName: 'Acme Industries Ltd.',
      });
      invoices = [seed];
    }
    return invoices;
  }

  /**
   * Get Invoice by ID
   */
  public async getInvoiceById(id: string) {
    const invoice = await Invoice.findById(id);
    if (!invoice) {
      throw new NotFoundError('Invoice record not found');
    }
    return invoice;
  }
}

export const billingService = new BillingService();
