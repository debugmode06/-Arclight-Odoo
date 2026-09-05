import { IQuotationLine } from '../models/quotation-line.model';

export interface CalculatedLine extends IQuotationLine {
  netRevenue: number;
}

export interface CommercialSummary {
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  costTotal: number;
  netRevenue: number;
  grossMargin: number;
  grossMarginPercent: number;
}

export class PricingService {
  /**
   * Safely rounds any numeric value to 2 decimal places to avoid IEEE-754 floating-point drift.
   */
  public static roundMoney(val: number): number {
    if (isNaN(val) || !isFinite(val)) return 0;
    return Math.round((val + Number.EPSILON) * 100) / 100;
  }

  /**
   * Calculates all commercial metrics for a single quotation line item.
   */
  public static calculateLine(input: {
    quantity: number;
    unitPrice: number;
    costPrice: number;
    discountPercent: number;
    taxPercent?: number;
  }): {
    lineSubtotal: number;
    discountAmount: number;
    taxAmount: number;
    lineTotal: number;
    lineCost: number;
    netRevenue: number;
    lineMargin: number;
    lineMarginPercent: number;
  } {
    const quantity = Math.max(0, input.quantity);
    const unitPrice = Math.max(0, this.roundMoney(input.unitPrice));
    const costPrice = Math.max(0, this.roundMoney(input.costPrice));
    const discountPercent = Math.min(100, Math.max(0, this.roundMoney(input.discountPercent)));
    const taxPercent = Math.min(100, Math.max(0, this.roundMoney(input.taxPercent || 0)));

    const lineSubtotal = this.roundMoney(quantity * unitPrice);
    const discountAmount = this.roundMoney(lineSubtotal * (discountPercent / 100));
    const netRevenue = this.roundMoney(lineSubtotal - discountAmount);
    const taxAmount = this.roundMoney(netRevenue * (taxPercent / 100));
    const lineTotal = this.roundMoney(netRevenue + taxAmount);
    const lineCost = this.roundMoney(quantity * costPrice);
    const lineMargin = this.roundMoney(netRevenue - lineCost);
    const lineMarginPercent =
      netRevenue > 0 ? this.roundMoney(((netRevenue - lineCost) / netRevenue) * 100) : 0;

    return {
      lineSubtotal,
      discountAmount,
      taxAmount,
      lineTotal,
      lineCost,
      netRevenue,
      lineMargin,
      lineMarginPercent,
    };
  }

  /**
   * Calculates header aggregates from calculated line items.
   */
  public static calculateSummary(lines: Array<{
    lineSubtotal: number;
    discountAmount: number;
    taxAmount: number;
    lineTotal: number;
    lineCost: number;
  }>): CommercialSummary {
    let subtotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;
    let costTotal = 0;

    for (const line of lines) {
      subtotal = this.roundMoney(subtotal + line.lineSubtotal);
      totalDiscount = this.roundMoney(totalDiscount + line.discountAmount);
      totalTax = this.roundMoney(totalTax + line.taxAmount);
      grandTotal = this.roundMoney(grandTotal + line.lineTotal);
      costTotal = this.roundMoney(costTotal + line.lineCost);
    }

    const netRevenue = this.roundMoney(subtotal - totalDiscount);
    const grossMargin = this.roundMoney(netRevenue - costTotal);
    const grossMarginPercent =
      netRevenue > 0 ? this.roundMoney(((netRevenue - costTotal) / netRevenue) * 100) : 0;

    return {
      subtotal,
      totalDiscount,
      totalTax,
      grandTotal,
      costTotal,
      netRevenue,
      grossMargin,
      grossMarginPercent,
    };
  }
}
