import { Quotation } from '../../quotations/models/quotation.model';
import { SubscriptionPlan } from '../../admin/models/subscription-plan.model';
import { Invoice, IInvoice } from '../models/invoice.model';
import { Subscription, ISubscription } from '../models/subscription.model';
import { BillingSchedule, IBillingSchedule } from '../models/billing-schedule.model';
import { Payment, IPayment } from '../models/payment.model';
import { NotFoundError, BadRequestError } from '../../../shared';

export class BillingService {
  // ─── Invoices ─────────────────────────────────────────────────────────────
  public static async listInvoices() {
    return Invoice.find().populate('customerId').populate('quotationId').sort({ createdAt: -1 });
  }

  public static async getInvoiceById(id: string) {
    const inv = await Invoice.findById(id).populate('customerId').populate('quotationId');
    if (!inv) throw new NotFoundError('Invoice not found');
    return inv;
  }

  public static async recordPayment(invoiceId: string, payload: {
    amount: number;
    paymentMethod: 'CREDIT_CARD' | 'ACH_TRANSFER' | 'WIRE' | 'CHECK';
    transactionReference?: string;
    notes?: string;
  }) {
    const inv = await Invoice.findById(invoiceId);
    if (!inv) throw new NotFoundError('Invoice not found');

    const paymentAmount = Number(payload.amount);
    if (paymentAmount <= 0) throw new BadRequestError('Payment amount must be greater than 0');

    const payment = await Payment.create({
      invoiceId: inv._id,
      quotationId: inv.quotationId,
      amount: paymentAmount,
      paymentMethod: payload.paymentMethod || 'WIRE',
      transactionReference: payload.transactionReference || `TXN-${Date.now()}`,
      notes: payload.notes,
    });

    inv.amountPaid += paymentAmount;
    if (inv.amountPaid >= inv.grandTotal) {
      inv.status = 'PAID';
      inv.paidAt = new Date();
    } else {
      inv.status = 'PARTIALLY_PAID';
    }
    await inv.save();

    return { invoice: inv, payment };
  }

  // ─── Subscriptions & Proration ────────────────────────────────────────────
  public static async listSubscriptions() {
    return Subscription.find().populate('customerId').populate('planId').sort({ createdAt: -1 });
  }

  public static async modifySubscription(
    subscriptionId: string,
    payload: { newPlanId?: string; newQuantity?: number }
  ) {
    const sub = await Subscription.findById(subscriptionId);
    if (!sub) throw new NotFoundError('Subscription not found');

    const plan = payload.newPlanId
      ? await SubscriptionPlan.findById(payload.newPlanId)
      : await SubscriptionPlan.findById(sub.planId);
    if (!plan) throw new NotFoundError('Subscription plan not found');

    const oldCycleAmount = sub.cycleAmount;
    const newQty = payload.newQuantity || sub.quantity;
    const newCycleAmount = plan.basePrice * newQty;

    // Proration calculation:
    // proratedDelta = (newCycleAmount - oldCycleAmount) * (remainingDays / cycleDays)
    const now = new Date();
    const cycleEnd = new Date(sub.currentPeriodEnd);
    const msDiff = Math.max(0, cycleEnd.getTime() - now.getTime());
    const remainingDays = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
    const totalCycleDays = 30; // standard month baseline

    const proratedDelta = Math.round((newCycleAmount - oldCycleAmount) * (remainingDays / totalCycleDays));

    sub.planId = plan._id;
    sub.planName = plan.name;
    sub.quantity = newQty;
    sub.cycleAmount = newCycleAmount;
    sub.status = 'MODIFIED';
    sub.proratedCreditNoteAmount = proratedDelta < 0 ? Math.abs(proratedDelta) : 0;
    await sub.save();

    // Recalculate upcoming schedule items
    await BillingSchedule.updateMany(
      { subscriptionId: sub._id, status: 'SCHEDULED' },
      { $set: { amount: newCycleAmount } }
    );

    return { subscription: sub, proratedDelta, remainingDays };
  }

  public static async cancelSubscription(subscriptionId: string, reason?: string) {
    const sub = await Subscription.findById(subscriptionId);
    if (!sub) throw new NotFoundError('Subscription not found');

    const now = new Date();
    const cycleEnd = new Date(sub.currentPeriodEnd);
    const msDiff = Math.max(0, cycleEnd.getTime() - now.getTime());
    const remainingDays = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
    const totalCycleDays = 30;

    // Prorated refund / credit note calculation
    const refundCredit = Math.round(sub.cycleAmount * (remainingDays / totalCycleDays));

    sub.status = 'CANCELLED';
    sub.cancellationReason = reason || 'Customer requested cancellation mid-cycle';
    sub.proratedCreditNoteAmount = refundCredit;
    await sub.save();

    // Cancel remaining schedules
    await BillingSchedule.updateMany(
      { subscriptionId: sub._id, status: 'SCHEDULED' },
      { $set: { status: 'UPCOMING', amount: 0 } }
    );

    return { subscription: sub, refundCredit, remainingDays };
  }

  // ─── Billing Schedules ────────────────────────────────────────────────────
  public static async listBillingSchedules(subscriptionId?: string) {
    const query = subscriptionId ? { subscriptionId } : {};
    return BillingSchedule.find(query).populate('subscriptionId').sort({ billingDate: 1 });
  }

  // ─── Hybrid Order Invoicing Generation ────────────────────────────────────
  public static async generateBillingForQuotation(quotationId: string) {
    const quote = await Quotation.findById(quotationId).populate('customerId');
    if (!quote) throw new NotFoundError('Quotation not found');

    const invoiceLines: any[] = [];
    const recurringLines: any[] = [];

    for (const line of quote.lines) {
      const isSub =
        line.productSkuSnapshot?.startsWith('SEC-') ||
        line.productSkuSnapshot?.startsWith('CLD-LIC');

      if (isSub) {
        recurringLines.push(line);
      } else {
        invoiceLines.push({
          description: line.productNameSnapshot,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          discountAmount: line.discountAmount,
          total: line.lineTotal,
          isRecurring: false,
        });
      }
    }

    // 1. Create One-Time Invoice
    const invNumber = `INV-${Date.now().toString().slice(-6)}`;
    const subtotal = invoiceLines.reduce((acc, l) => acc + l.total, 0);
    const invoice = await Invoice.create({
      invoiceNumber: invNumber,
      quotationId: quote._id,
      customerId: quote.customerId,
      invoiceType: recurringLines.length > 0 ? 'HYBRID' : 'ONE_TIME',
      lines: invoiceLines.length > 0 ? invoiceLines : [{
        description: 'Standard Order License Commitment',
        quantity: 1,
        unitPrice: quote.grandTotal,
        discountAmount: 0,
        total: quote.grandTotal,
        isRecurring: false,
      }],
      subtotal: subtotal || quote.grandTotal,
      discountTotal: quote.totalDiscount,
      taxTotal: 0,
      grandTotal: subtotal || quote.grandTotal,
      amountPaid: 0,
      status: 'ISSUED',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });

    // 2. If recurring lines exist, create Subscriptions & Schedules
    const createdSubs: any[] = [];
    const plans = await SubscriptionPlan.find();
    const defaultPlan = plans[0] || { _id: quote._id, name: 'Cloud Core Enterprise', basePrice: 4800 };

    for (const rLine of recurringLines) {
      const sub = await Subscription.create({
        customerId: quote.customerId,
        quotationId: quote._id,
        planId: defaultPlan._id,
        planName: rLine.productNameSnapshot,
        billingCycle: 'MONTHLY',
        quantity: rLine.quantity,
        cycleAmount: rLine.lineTotal,
        status: 'ACTIVE',
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // Generate 3 scheduled installments
      for (let i = 1; i <= 3; i++) {
        await BillingSchedule.create({
          subscriptionId: sub._id,
          periodName: `Cycle Month ${i}`,
          billingDate: new Date(Date.now() + (i - 1) * 30 * 24 * 60 * 60 * 1000),
          amount: rLine.lineTotal,
          status: i === 1 ? 'SCHEDULED' : 'UPCOMING',
        });
      }

      createdSubs.push(sub);
    }

    return { invoice, subscriptions: createdSubs };
  }
}
