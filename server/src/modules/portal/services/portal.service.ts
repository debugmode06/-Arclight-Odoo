import jwt from 'jsonwebtoken';
import { Customer } from '../../admin/models/customer.model';
import { Quotation } from '../../quotations/models/quotation.model';
import { Negotiation } from '../models/negotiation.model';
import { QuotationService } from '../../quotations/services/quotation.service';
import { ApprovalService } from '../../approvals/services/approval.service';
import { BillingService } from '../../billing/services/billing.service';
import { FulfillmentService } from '../../fulfillment/services/fulfillment.service';
import { env } from '../../../config/env.config';
import { NotFoundError, UnauthorizedError, ForbiddenError, BadRequestError } from '../../../shared';
import { UserRole, QuotationStatus } from '../../../shared';

export class PortalService {
  public static async customerLogin(email: string) {
    const normalized = email.trim().toLowerCase();
    const customer = await Customer.findOne({ email: normalized, isActive: true });
    if (!customer) {
      throw new UnauthorizedError('No active customer account found with this email address');
    }

    const token = jwt.sign(
      {
        id: customer._id.toString(),
        customerId: customer._id.toString(),
        email: customer.email,
        role: UserRole.CUSTOMER,
      },
      env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      accessToken: token,
      customer: {
        id: customer._id.toString(),
        name: customer.name,
        company: customer.company,
        email: customer.email,
        tier: customer.tier,
      },
    };
  }

  /**
   * Sanitizes quotation for customer consumption:
   * Strips internal costTotal, grossMargin, grossMarginPercent, discountRiskScore, discountRiskLevel,
   * discountRiskFactors, and line-level cost/margins.
   */
  private static sanitizeQuotationForCustomer(quote: any) {
    const obj = quote.toObject ? quote.toObject() : quote;
    const sanitizedLines = (obj.lines || []).map((l: any) => ({
      _id: l._id,
      productId: l.productId,
      productName: l.productNameSnapshot,
      sku: l.productSkuSnapshot,
      category: l.productCategorySnapshot,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      discountPercent: l.discountPercent,
      discountAmount: l.discountAmount,
      lineTotal: l.lineTotal,
    }));

    return {
      _id: obj._id,
      quotationNumber: obj.quotationNumber,
      currency: obj.currency,
      status: obj.status,
      validUntil: obj.validUntil,
      subtotal: obj.subtotal,
      totalDiscount: obj.totalDiscount,
      grandTotal: obj.grandTotal,
      lines: sanitizedLines,
      notes: obj.notes,
      createdAt: obj.createdAt,
    };
  }

  public static async getCustomerQuotations(customerId: string) {
    const quotes = await Quotation.find({ customerId })
      .select('-costTotal -grossMargin -grossMarginPercent -discountRiskScore -discountRiskLevel -discountRiskFactors')
      .sort({ createdAt: -1 });

    return quotes.map((q) => this.sanitizeQuotationForCustomer(q));
  }

  public static async getCustomerQuotationById(quotationId: string, customerId: string) {
    const quote = await Quotation.findOne({ _id: quotationId, customerId });
    if (!quote) throw new NotFoundError('Quotation not found or unauthorized');

    const negotiation = await Negotiation.findOne({ quotationId: quote._id, customerId });
    return {
      quotation: this.sanitizeQuotationForCustomer(quote),
      negotiation: negotiation || null,
    };
  }

  /**
   * Customer Change Request / Counter-Discount:
   * CRITICAL RE-GOVERNANCE ENGINE:
   * If customer proposes a counter-discount, re-evaluates governance.
   * If policy thresholds are breached, automatically moves quotation back to PENDING_APPROVAL!
   */
  public static async submitNegotiation(
    quotationId: string,
    customerId: string,
    payload: { text: string; counterDiscountPercent?: number; lineId?: string }
  ) {
    const quote = await Quotation.findOne({ _id: quotationId, customerId });
    if (!quote) throw new NotFoundError('Quotation not found');

    const customer = await Customer.findById(customerId);
    const counterDisc = payload.counterDiscountPercent;

    let reapprovalTriggered = false;

    if (counterDisc !== undefined && counterDisc > 0) {
      // Re-run governance recalculation with counter-discount applied
      const simulatedLines = quote.lines.map((l: any) => ({
        productId: l.productId.toString(),
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        discountPercent: counterDisc,
      }));

      const recalc = await QuotationService.recalculateDraft({
        customerId: quote.customerId.toString(),
        currency: quote.currency,
        lines: simulatedLines,
      });

      // Update lines with counter discount
      quote.lines = recalc.lines as any;
      quote.subtotal = recalc.summary.subtotal;
      quote.totalDiscount = recalc.summary.totalDiscount;
      quote.grandTotal = recalc.summary.grandTotal;
      quote.costTotal = recalc.summary.costTotal;
      quote.grossMargin = recalc.summary.grossMargin;
      quote.grossMarginPercent = recalc.summary.grossMarginPercent;
      quote.discountRiskScore = recalc.risk.score;
      quote.discountRiskLevel = recalc.risk.level;
      quote.discountRiskFactors = recalc.risk.factors;

      if (recalc.risk.requiresApproval || recalc.risk.decision !== 'WITHIN_LIMIT') {
        quote.status = QuotationStatus.PENDING_APPROVAL;
        reapprovalTriggered = true;

        // Auto-create approval request for Manager
        await ApprovalService.createApprovalRequest(quote, {
          id: quote.createdBy?.toString() || '',
          role: UserRole.SALES_REP,
        });
      } else {
        quote.status = QuotationStatus.DRAFT;
      }

      await quote.save();
    }

    // Persist negotiation thread
    let neg = await Negotiation.findOne({ quotationId: quote._id, customerId });
    if (!neg) {
      neg = await Negotiation.create({
        quotationId: quote._id,
        customerId: quote.customerId,
        status: 'OPEN',
        messages: [],
      });
    }

    neg.messages.push({
      senderRole: 'CUSTOMER',
      senderName: customer?.name || 'Customer',
      text: payload.text,
      counterDiscountPercent: counterDisc,
      lineId: payload.lineId,
      createdAt: new Date(),
    });

    await neg.save();

    return {
      negotiation: neg,
      reapprovalTriggered,
      quotationStatus: quote.status,
    };
  }

  /**
   * Customer Confirms Quotation:
   * Transitions quotation to CONFIRMED and automatically initiates fulfillment & billing generation.
   */
  public static async confirmQuotation(quotationId: string, customerId: string) {
    const quote = await Quotation.findOne({ _id: quotationId, customerId });
    if (!quote) throw new NotFoundError('Quotation not found');

    if (quote.status === QuotationStatus.PENDING_APPROVAL) {
      throw new BadRequestError('Quotation terms are currently pending management approval and cannot be confirmed yet.');
    }

    quote.status = QuotationStatus.WON; // Confirmed Order
    await quote.save();

    // Automatically trigger initial fulfillment allocation and hybrid billing
    await Promise.all([
      FulfillmentService.allocateStock(quote._id.toString()).catch(() => null),
      BillingService.generateBillingForQuotation(quote._id.toString()).catch(() => null),
    ]);

    return {
      confirmed: true,
      quotationNumber: quote.quotationNumber,
      status: quote.status,
    };
  }
}
