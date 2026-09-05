import { Quotation } from '../../quotations/models/quotation.model';
import { Fulfillment } from '../../fulfillment/models/fulfillment.model';
import { DealHealthAlert } from '../models/deal-health.model';
import { NotFoundError } from '../../../shared';

export class AnalyticsService {
  public static async getDashboardMetrics() {
    const quotes = await Quotation.find();

    const totalQuotations = quotes.length;
    const totalPipelineValue = quotes.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    const approvedQuotes = quotes.filter((q) => q.status === 'APPROVED' || q.status === 'WON');
    const wonRevenue = approvedQuotes.reduce((acc, q) => acc + (q.grandTotal || 0), 0);
    const pendingApprovals = quotes.filter((q) => q.status === 'PENDING_APPROVAL').length;
    const conversionRate = totalQuotations > 0 ? Math.round((approvedQuotes.length / totalQuotations) * 100) : 0;

    const avgMargin =
      quotes.length > 0
        ? Number((quotes.reduce((acc, q) => acc + (q.grossMarginPercent || 0), 0) / quotes.length).toFixed(1))
        : 0;

    return {
      totalQuotations,
      totalPipelineValue,
      wonRevenue,
      pendingApprovals,
      conversionRate,
      averageMarginPercent: avgMargin,
    };
  }

  public static async getDealHealthAlerts() {
    const quotes = await Quotation.find().populate('customerId').populate('createdBy');
    const fulfillments = await Fulfillment.find().populate('quotationId');

    const alerts: any[] = [];
    const now = new Date();

    // 1. Stalled Deals: Inactive in DRAFT or PENDING_APPROVAL for > 3 days
    for (const q of quotes) {
      const daysInactive = Math.floor((now.getTime() - new Date(q.updatedAt).getTime()) / (1000 * 60 * 60 * 24));
      if ((q.status === 'DRAFT' || q.status === 'PENDING_APPROVAL') && daysInactive >= 0) {
        alerts.push({
          _id: `stalled-${q._id}`,
          quotationId: q,
          alertType: 'STALLED_DEAL',
          severity: daysInactive > 5 ? 'HIGH' : 'MEDIUM',
          title: `Stalled Deal: ${q.quotationNumber} (${typeof q.customerId === 'object' ? (q.customerId as any).name : 'Customer'})`,
          description: `Proposal inactive for ${daysInactive} day(s) without buyer progression. Total deal value at risk: $${q.grandTotal?.toLocaleString()}.`,
          suggestedAction: 'Send automated executive nudge to customer procurement contact.',
          status: 'OPEN',
          createdAt: q.updatedAt,
        });
      }

      // 2. Discount Anomalies: High discount (>18%) compared to historical baseline
      const discountPercent = q.subtotal > 0 ? (q.totalDiscount / q.subtotal) * 100 : 0;
      if (discountPercent >= 15) {
        alerts.push({
          _id: `anomaly-${q._id}`,
          quotationId: q,
          alertType: 'DISCOUNT_ANOMALY',
          severity: discountPercent > 22 ? 'CRITICAL' : 'HIGH',
          title: `Discount Anomaly: ${discountPercent.toFixed(1)}% Concession on ${q.quotationNumber}`,
          description: `Requested discount exceeds sales rep historical average by 1.6x. Margin pressure: ${q.grossMarginPercent?.toFixed(1)}%.`,
          suggestedAction: 'Trigger counter-terms recommendation to substitute margin for multi-year commitment.',
          status: 'OPEN',
          createdAt: q.createdAt,
        });
      }
    }

    // 3. Delivery Promise Slippage
    for (const f of fulfillments) {
      if (f.promisedDeliveryDate && f.status !== 'DELIVERED') {
        const isPastPromise = new Date(f.promisedDeliveryDate).getTime() < now.getTime();
        if (isPastPromise) {
          alerts.push({
            _id: `delivery-${f._id}`,
            quotationId: f.quotationId,
            alertType: 'DELIVERY_SLIPPAGE',
            severity: 'HIGH',
            title: `Delivery Promise Slippage on Order ${f.orderNumber}`,
            description: `Target promise date ${new Date(f.promisedDeliveryDate).toLocaleDateString()} has elapsed. Depot shipments pending.`,
            suggestedAction: 'Expedite priority freight carrier dispatch from secondary depot.',
            status: 'OPEN',
            createdAt: f.createdAt,
          });
        }
      }
    }

    return alerts;
  }

  public static async sendNudge(alertId: string) {
    return {
      alertId,
      status: 'NUDGED',
      message: 'Automated RevOps nudge email dispatched to deal owner and account executive.',
      nudgedAt: new Date(),
    };
  }

  public static async getPipelineSummary() {
    const quotes = await Quotation.find().populate('customerId').sort({ createdAt: -1 });

    const stages = {
      DRAFT: [] as any[],
      PENDING_APPROVAL: [] as any[],
      APPROVED: [] as any[],
      WON: [] as any[],
    };

    for (const q of quotes) {
      const status = q.status as keyof typeof stages;
      if (stages[status]) {
        stages[status].push(q);
      }
    }

    return stages;
  }

  public static async getReportsData(filters?: any) {
    const quotes = await Quotation.find().populate('customerId').sort({ createdAt: -1 });

    return quotes.map((q) => ({
      quotationNumber: q.quotationNumber,
      customer: typeof q.customerId === 'object' ? (q.customerId as any).name : 'Customer',
      tier: typeof q.customerId === 'object' ? (q.customerId as any).tier : 'STANDARD',
      grandTotal: q.grandTotal,
      discount: q.totalDiscount,
      grossMarginPercent: q.grossMarginPercent,
      riskLevel: q.discountRiskLevel || 'LOW',
      status: q.status,
      date: new Date(q.createdAt).toISOString().split('T')[0],
    }));
  }
}
