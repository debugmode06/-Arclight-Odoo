import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../../../config/env.config';
import { UserRole, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from '../../../shared';
import {
  CustomerQuotationSummary,
  CustomerQuotationDetail,
  CustomerUser,
  CounterOfferSubmissionInput,
} from '../types/portal.types';

const DEMO_CUSTOMERS: Record<string, CustomerUser & { passwordHashHash: string }> = {
  'customer@techcorp.com': {
    id: 'cust_techcorp_001',
    email: 'customer@techcorp.com',
    name: 'Vikram Singhania',
    company: 'Acme Industries Ltd.',
    tier: 'GOLD',
    role: UserRole.CUSTOMER,
    passwordHashHash: 'password123',
  },
  'buyer@acme.com': {
    id: 'cust_acme_002',
    email: 'buyer@acme.com',
    name: 'Vikram Singhania',
    company: 'Acme Industries Ltd.',
    tier: 'SILVER',
    role: UserRole.CUSTOMER,
    passwordHashHash: 'password123',
  },
};

const ENTERPRISE_DEAL_DETAIL: CustomerQuotationDetail = {
  id: 'qt_1001',
  quotationNumber: 'Q-2025-0842',
  title: 'Enterprise IT Modernization & RevOps License',
  subtitle: 'Acme Industries Ltd. procurement team is reviewing line-item pricing. Submitting counter-proposals below triggers instant AI concession modeling or rapid commercial VP delegation (< 2h SLA).',
  roundTag: 'Under Active Negotiation (Round 2)',
  customerId: 'cust_techcorp_001',
  customerName: 'Vikram Singhania',
  companyName: 'Acme Industries Ltd.',
  status: 'UNDER NEGOTIATION',
  validUntil: new Date(Date.now() + 14 * 86400000).toISOString(),
  baseQuotedTotal: 1000000,
  taxAmount: 180000,
  taxPercent: 18,
  totalWithTax: 1180000,
  total: 1180000,
  currency: 'INR (₹)',
  netContractValue: 1000000,
  oneTimeCapEx: 838000,
  recurringOpExAnnual: 162000,
  activeCounterDelta: 38000,
  pendingCountersCount: 2,
  targetCounterTotal: 962000,
  currencySymbol: '₹',
  currencyCode: 'INR',
  lineCount: 3,
  createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  canNegotiate: true,
  canConfirm: true,
  assignedRep: {
    name: 'Priya Sharma',
    email: 'priya.s@dealflow360.io',
    avatarInitials: 'PS',
    title: 'Sales Operations VP',
    statusText: 'Active on deal desk',
  },
  lines: [
    {
      lineId: 'line_01',
      lineNo: 'LINE 01',
      categoryTag: 'Hardware • One-Time CapEx',
      categoryType: 'CapEx',
      statusTag: 'Accepted Line Price',
      statusTagColor: 'green',
      productId: 'prod_laptop_x1',
      productName: 'Enterprise Laptop X1 Carbon (Gen 12)',
      description: 'Intel Core Ultra 7 155H, 32GB LPDDR5x, 1TB NVMe PCIe 4.0, 3Y Premier Premier Onsite Support.',
      quantity: 10,
      unit: 'Units',
      listUnitPrice: 80000,
      effectiveUnitPrice: 68000,
      unitPrice: 68000,
      discountPercent: 15,
      discountAmount: 120000,
      lineTotal: 680000,
      depotAllocation: 'Bhiwandi (6) + Kolkata (4)',
      notes: 'Customer agreed to standard enterprise rate. Inventory reserve locked for 7 business days.',
      hasCounterOffer: false,
    },
    {
      lineId: 'line_02',
      lineNo: 'LINE 02',
      categoryTag: 'Cloud SaaS • 12-Month Recurring OpEx',
      categoryType: 'OpEx',
      statusTag: 'Counter-Offer Submitted (Round 2)',
      statusTagColor: 'coral',
      productId: 'prod_revops_engine',
      productName: 'Cloud RevOps Analytics & AI DealTwin™ License',
      subtitle: 'Annual Subscription',
      description: 'Full RevOps autonomous engine access, live pipeline forecasting, multi-warehouse routing simulations, 10 named seats.',
      quantity: 1,
      unit: 'yr',
      listUnitPrice: 180000,
      effectiveUnitPrice: 162000,
      discountPercent: 10,
      discountAmount: 18000,
      lineTotal: 162000,
      hasCounterOffer: true,
      counterDiscountPercent: 18,
      counterRequestedPrice: 147600,
      counterRequestedDiscountAmount: 14400,
      counterMessage: '“We are planning to onboard 15 more seats in Q2 across our Pune and Noida procurement hubs; requesting 18% tier discount parity today.”',
      counterTimestamp: 'Today, 10:42 AM',
      notes: 'In Active Discussion via Workspace Drawer',
    },
    {
      lineId: 'line_03',
      lineNo: 'LINE 03',
      categoryTag: 'Professional Services • One-Time CapEx',
      categoryType: 'CapEx',
      statusTag: 'Counter-Offer Submitted (Round 2)',
      statusTagColor: 'coral',
      productId: 'prod_impl_pack',
      productName: '24/7 Onsite Implementation & RevOps Deployment Pack',
      description: 'Full ERP-RevOps bi-directional data migration, ERP custom connectors, dedicated solution engineer onsite for 30 calendar days.',
      quantity: 1,
      unit: 'Pack',
      listUnitPrice: 200000,
      effectiveUnitPrice: 158000,
      discountPercent: 21,
      discountAmount: 42000,
      lineTotal: 158000,
      hasCounterOffer: true,
      counterDiscountPercent: 32.5,
      counterRequestedPrice: 135000,
      counterRequestedDiscountAmount: 23000,
      counterMessage: '“Our departmental fiscal CapEx allocation for implementation integration is strictly capped at ₹1,35,000.”',
      counterTimestamp: 'Today, 10:15 AM',
      customerActionText: 'Accept at ₹1,58,000',
      notes: 'Scope of Work: 30 Days Onsite + Remote | SLA Guarantee: 4-Hour Critical Response',
    },
  ],
  concessionTradeOffs: [
    {
      id: 'tradeoff_1',
      title: 'Agree to 2-Year Contract Lock',
      badge: 'Instant 15% Approved',
      badgeType: 'success',
      description: 'Locks ₹1,53,000/yr for 24 months without requiring VP review. System executes instant counter-approval.',
      discountPercent: 15,
    },
    {
      id: 'tradeoff_2',
      title: 'Add 5 Additional Seats at Checkout',
      badge: 'Tier Parity',
      badgeType: 'info',
      description: 'Increases team seats from 10 to 15, unlocking volume rate (₹13,500/seat = ₹2,02,500/yr).',
      discountPercent: 18,
    },
  ],
  auditLogs: [
    {
      id: 'log_1',
      event: 'Quotation Q-2025-0842 Opened & Viewed',
      actorName: 'Vikram Singhania',
      actorRole: 'VP Procurement, Acme',
      description: 'Vikram Singhania accessed secure workspace via encrypted enterprise link.',
      timestamp: 'Today, 10:15 AM',
    },
    {
      id: 'log_2',
      event: 'Line 02 Counter-Offer Dispatched',
      actorName: 'Acme Procurement',
      actorRole: 'Customer',
      description: 'Acme proposed discount tier increase on Cloud RevOps (10% -> 18%, target ₹1,47,600/yr).',
      timestamp: 'Today, 10:42 AM',
    },
    {
      id: 'log_3',
      event: 'Autonomous Concession Incentive Model Suggested',
      actorName: 'DealTwin AI',
      actorRole: 'System Engine',
      description: 'DealFlow360 platform generated real-time instant trade-off option: 2-Year Contract Lock for 15% discount without VP escalation.',
      timestamp: 'Today, 11:05 AM',
    },
    {
      id: 'log_4',
      event: 'Commercial Dossier Submission Pending',
      actorName: 'Active Session',
      actorRole: 'Customer Workspace',
      description: 'Awaiting customer submission of counter dossier from negotiation drawer.',
      timestamp: 'Active Session',
      isActiveSession: true,
    },
  ],
};

const quotesStore = new Map<string, CustomerQuotationDetail>([
  [ENTERPRISE_DEAL_DETAIL.id, { ...ENTERPRISE_DEAL_DETAIL }],
]);

export class PortalService {
  public async customerLogin(email: string, pass: string): Promise<{ accessToken: string; customer: CustomerUser }> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = DEMO_CUSTOMERS[normalizedEmail] || DEMO_CUSTOMERS['customer@techcorp.com'];

    const payload = {
      id: user.id,
      email: user.email,
      role: UserRole.CUSTOMER,
      company: user.company,
    };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });

    return {
      accessToken,
      customer: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
        tier: user.tier,
        role: UserRole.CUSTOMER,
      },
    };
  }

  public async getCustomerQuotations(customerId: string): Promise<CustomerQuotationSummary[]> {
    return Array.from(quotesStore.values()).map((q) => this.sanitizeSummary(q));
  }

  public async getCustomerQuotationById(quotationId: string, _customerId: string): Promise<CustomerQuotationDetail> {
    const quote = quotesStore.get(quotationId) || ENTERPRISE_DEAL_DETAIL;
    return quote;
  }

  public async addLineComment(
    quotationId: string,
    _customerId: string,
    customerName: string,
    input: { lineId?: string; comment: string }
  ): Promise<CustomerQuotationDetail> {
    const quote = quotesStore.get(quotationId) || { ...ENTERPRISE_DEAL_DETAIL };
    quote.auditLogs.unshift({
      id: randomUUID(),
      event: 'Customer Line Comment Posted',
      actorName: customerName || 'Customer VP',
      actorRole: 'Customer',
      description: input.comment,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    quotesStore.set(quotationId, quote);
    return quote;
  }

  public async submitChangeRequest(
    quotationId: string,
    _customerId: string,
    input: { lineId?: string; type: string; description: string; requestedValue?: any }
  ): Promise<CustomerQuotationDetail> {
    const quote = quotesStore.get(quotationId) || { ...ENTERPRISE_DEAL_DETAIL };
    quote.auditLogs.unshift({
      id: randomUUID(),
      event: `Change Request Submitted [${input.type}]`,
      actorName: 'Vikram Singhania',
      actorRole: 'Customer VP',
      description: input.description,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    quotesStore.set(quotationId, quote);
    return quote;
  }

  public async submitCounterOffer(
    quotationId: string,
    _customerId: string,
    input: CounterOfferSubmissionInput
  ): Promise<CustomerQuotationDetail> {
    const quote = quotesStore.get(quotationId) || { ...ENTERPRISE_DEAL_DETAIL };

    const targetLine = quote.lines.find((l) => l.lineId === (input.lineId || 'line_02')) || quote.lines[1];
    targetLine.hasCounterOffer = true;
    targetLine.counterDiscountPercent = input.proposedDiscount;
    targetLine.counterRequestedPrice = Math.round(targetLine.listUnitPrice * (1 - input.proposedDiscount / 100));
    targetLine.counterRequestedDiscountAmount = targetLine.listUnitPrice - targetLine.counterRequestedPrice;
    targetLine.counterMessage = input.justification || 'Submitted via Smart Negotiation Assistant Workspace';
    targetLine.counterTimestamp = 'Just Now';
    targetLine.statusTag = 'Counter-Offer Submitted (Round 2)';
    targetLine.statusTagColor = 'coral';

    quote.auditLogs.unshift({
      id: randomUUID(),
      event: `Line ${targetLine.lineNo} Counter-Offer Submitted (${input.proposedDiscount}%)`,
      actorName: 'Vikram Singhania',
      actorRole: 'Customer VP',
      description: `Proposed counter rate ₹${targetLine.counterRequestedPrice.toLocaleString()}/yr (${input.proposedDiscount}% discount). ${input.justification || ''}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    quotesStore.set(quotationId, quote);
    return quote;
  }

  public async confirmQuotation(quotationId: string, _customerId: string): Promise<CustomerQuotationDetail> {
    const quote = quotesStore.get(quotationId) || { ...ENTERPRISE_DEAL_DETAIL };
    quote.status = 'CONFIRMED';
    quote.canNegotiate = false;
    quote.canConfirm = false;

    quote.auditLogs.unshift({
      id: randomUUID(),
      event: 'Quotation Explicitly Confirmed',
      actorName: 'Vikram Singhania',
      actorRole: 'Customer VP',
      description: 'Customer accepted the commercial quotation and authorized binding contract fulfillment.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });

    quotesStore.set(quotationId, quote);
    return quote;
  }

  private sanitizeSummary(detail: CustomerQuotationDetail): CustomerQuotationSummary {
    const { lines, auditLogs, concessionTradeOffs, assignedRep, ...summary } = detail;
    return summary;
  }
}

export const portalService = new PortalService();
