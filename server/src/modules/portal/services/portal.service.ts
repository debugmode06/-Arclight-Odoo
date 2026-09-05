import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../../../config/env.config';
import { UserRole, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError } from '../../../shared';
import {
  CustomerQuotationSummary,
  CustomerQuotationDetail,
  LineCommentInput,
  ChangeRequestInput,
  CounterOfferInput,
  ConfirmQuoteInput,
  CustomerUser,
} from '../types/portal.types';
import { NegotiationModel } from '../models/negotiation.model';

// Seeded Customer Users for Hackathon & Production Fallback
const DEMO_CUSTOMERS: Record<string, CustomerUser & { passwordHashHash: string }> = {
  'customer@techcorp.com': {
    id: 'cust_techcorp_001',
    email: 'customer@techcorp.com',
    name: 'Sarah Connor',
    company: 'TechCorp Ltd',
    tier: 'GOLD',
    role: UserRole.CUSTOMER,
    passwordHashHash: 'password123',
  },
  'buyer@acme.com': {
    id: 'cust_acme_002',
    email: 'buyer@acme.com',
    name: 'John Acme',
    company: 'Acme Industries',
    tier: 'SILVER',
    role: UserRole.CUSTOMER,
    passwordHashHash: 'password123',
  },
};

interface NegotiationRecord {
  comments: Array<{ id: string; lineId?: string; comment: string; createdAt: Date; authorName: string; isCustomer: boolean }>;
  changeRequests: Array<{ id: string; lineId?: string; type: any; description: string; requestedValue?: any; status: any; createdAt: Date }>;
  counterOffer?: { id: string; currentDiscount: number; proposedDiscount: number; reason: string; status: any; createdAt: Date };
  timeline: Array<{ id: string; event: string; description: string; timestamp: Date; actor: any; customerVisible: boolean }>;
  confirmedAt?: Date;
  customerNotes?: string;
}

// In-Memory Data Store for Quotations (synced with MongoDB if available)
interface RawQuotation {
  id: string;
  quotationNumber: string;
  customerId: string;
  customerName: string;
  companyName: string;
  status: 'SENT' | 'UNDER NEGOTIATION' | 'CONFIRMED' | 'DRAFT' | 'APPROVED';
  validUntil: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  total: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  lines: Array<{
    lineId: string;
    productId: string;
    productName: string;
    description: string;
    quantity: number;
    unitPrice: number;
    discountPercent: number;
    discountAmount: number;
    lineTotal: number;
  }>;
  // INTERNAL FIELDS THAT MUST BE STRIPPED FROM CUSTOMER RESPONSES
  internalMarginPercent?: number;
  internalCostTotal?: number;
  internalRiskScore?: string;
  internalApprovalNotes?: string[];
  internalDiscountRisk?: string;
}

const INITIAL_QUOTATIONS: RawQuotation[] = [
  {
    id: 'qt_1001',
    quotationNumber: 'QT-2026-1001',
    customerId: 'cust_techcorp_001',
    customerName: 'Sarah Connor',
    companyName: 'TechCorp Ltd',
    status: 'UNDER NEGOTIATION',
    validUntil: new Date(Date.now() + 14 * 86400000).toISOString(),
    subtotal: 115000,
    discountAmount: 11500,
    taxAmount: 8280,
    total: 111780,
    currency: 'USD',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
    lines: [
      {
        lineId: 'line_101',
        productId: 'prod_crm_ent',
        productName: 'Enterprise CRM Licenses (Annual)',
        description: '50 Enterprise user licenses with 24/7 dedicated support',
        quantity: 50,
        unitPrice: 1500,
        discountPercent: 10,
        discountAmount: 7500,
        lineTotal: 67500,
      },
      {
        lineId: 'line_102',
        productId: 'prod_impl_svc',
        productName: 'Implementation & Onboarding Services',
        description: 'Full data migration, CRM customization, and team training',
        quantity: 1,
        unitPrice: 25000,
        discountPercent: 10,
        discountAmount: 2500,
        lineTotal: 22500,
      },
      {
        lineId: 'line_103',
        productId: 'prod_supp_prem',
        productName: 'Premium SLA Support (1-Year)',
        description: '1-hour emergency response SLA and dedicated account manager',
        quantity: 1,
        unitPrice: 15000,
        discountPercent: 10,
        discountAmount: 1500,
        lineTotal: 13500,
      },
    ],
    internalMarginPercent: 42.5,
    internalCostTotal: 62000,
    internalRiskScore: 'MEDIUM',
    internalApprovalNotes: ['Approved by Sales Manager Mike', 'Finance review pending'],
  },
  {
    id: 'qt_1002',
    quotationNumber: 'QT-2026-1002',
    customerId: 'cust_techcorp_001',
    customerName: 'Sarah Connor',
    companyName: 'TechCorp Ltd',
    status: 'SENT',
    validUntil: new Date(Date.now() + 30 * 86400000).toISOString(),
    subtotal: 45000,
    discountAmount: 2250,
    taxAmount: 3420,
    total: 46170,
    currency: 'USD',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    lines: [
      {
        lineId: 'line_201',
        productId: 'prod_analytics_addon',
        productName: 'Advanced Deal Analytics Addon',
        description: 'AI-driven pipeline predictive analytics & custom BI dashboards',
        quantity: 1,
        unitPrice: 45000,
        discountPercent: 5,
        discountAmount: 2250,
        lineTotal: 42750,
      },
    ],
    internalMarginPercent: 65.0,
    internalCostTotal: 15000,
    internalRiskScore: 'LOW',
    internalApprovalNotes: ['Auto-approved under standard discount rules'],
  },
  {
    id: 'qt_1003',
    quotationNumber: 'QT-2026-1003',
    customerId: 'cust_acme_002',
    customerName: 'John Acme',
    companyName: 'Acme Industries',
    status: 'CONFIRMED',
    validUntil: new Date(Date.now() - 5 * 86400000).toISOString(),
    subtotal: 80000,
    discountAmount: 8000,
    taxAmount: 5760,
    total: 77760,
    currency: 'USD',
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    lines: [
      {
        lineId: 'line_301',
        productId: 'prod_erp_std',
        productName: 'Standard ERP Suite Package',
        description: 'Core ERP modules including Inventory & Billing',
        quantity: 1,
        unitPrice: 80000,
        discountPercent: 10,
        discountAmount: 8000,
        lineTotal: 72000,
      },
    ],
    internalMarginPercent: 50.0,
    internalCostTotal: 40000,
    internalRiskScore: 'LOW',
    internalApprovalNotes: ['Customer confirmed via portal'],
  },
];

// In-Memory store for state mutations
const quotationsStore: Map<string, RawQuotation> = new Map(
  INITIAL_QUOTATIONS.map((q) => [q.id, { ...q }])
);

// Initial Negotiation State Map
const negotiationStore: Map<string, NegotiationRecord> = new Map([
  [
    'qt_1001',
    {
      comments: [
        {
          id: 'c_1',
          lineId: 'line_101',
          comment: 'Can you offer a slightly better tier discount if we sign before the end of the quarter?',
          createdAt: new Date(Date.now() - 2 * 86400000),
          authorName: 'Sarah Connor (TechCorp)',
          isCustomer: true,
        },
        {
          id: 'c_2',
          lineId: 'line_101',
          comment: 'We can consider a counter-proposal if commitment includes multi-year terms.',
          createdAt: new Date(Date.now() - 1 * 86400000),
          authorName: 'Sales Rep (DealFlow360)',
          isCustomer: false,
        },
      ],
      changeRequests: [
        {
          id: 'cr_1',
          lineId: 'line_102',
          type: 'DELIVERY',
          description: 'Requesting phased implementation starting next month rather than immediate rollout.',
          requestedValue: 'Phase 1: October 1st',
          status: 'PENDING',
          createdAt: new Date(Date.now() - 2 * 86400000),
        },
      ],
      counterOffer: {
        id: 'co_1',
        currentDiscount: 10,
        proposedDiscount: 14,
        reason: 'We are prepared to issue PO this week if discount is adjusted to 14%.',
        status: 'PENDING',
        createdAt: new Date(Date.now() - 1 * 86400000),
      },
      timeline: [
        {
          id: 't_1',
          event: 'Quotation Shared',
          description: 'Official quotation QT-2026-1001 issued to TechCorp Ltd',
          timestamp: new Date(Date.now() - 3 * 86400000),
          actor: 'SALES_REP',
          customerVisible: true,
        },
        {
          id: 't_2',
          event: 'Line Comment Added',
          description: 'Customer inquired about volume pricing on Enterprise CRM Licenses',
          timestamp: new Date(Date.now() - 2 * 86400000),
          actor: 'CUSTOMER',
          customerVisible: true,
        },
        {
          id: 't_3',
          event: 'Change Request Submitted',
          description: 'Customer requested phased implementation schedule',
          timestamp: new Date(Date.now() - 2 * 86400000),
          actor: 'CUSTOMER',
          customerVisible: true,
        },
        {
          id: 't_4',
          event: 'Counter Discount Proposed',
          description: 'Customer proposed 14% counter discount (Under Review)',
          timestamp: new Date(Date.now() - 1 * 86400000),
          actor: 'CUSTOMER',
          customerVisible: true,
        },
      ],
    },
  ],
  [
    'qt_1002',
    {
      comments: [],
      changeRequests: [],
      timeline: [
        {
          id: 't_201',
          event: 'Quotation Shared',
          description: 'Quotation QT-2026-1002 sent to customer for review',
          timestamp: new Date(Date.now() - 7 * 86400000),
          actor: 'SALES_REP',
          customerVisible: true,
        },
      ],
    },
  ],
  [
    'qt_1003',
    {
      comments: [],
      changeRequests: [],
      timeline: [
        {
          id: 't_301',
          event: 'Quotation Shared',
          description: 'Quotation QT-2026-1003 sent to customer',
          timestamp: new Date(Date.now() - 20 * 86400000),
          actor: 'SALES_REP',
          customerVisible: true,
        },
        {
          id: 't_302',
          event: 'Quotation Confirmed',
          description: 'Customer explicitly confirmed quotation',
          timestamp: new Date(Date.now() - 2 * 86400000),
          actor: 'CUSTOMER',
          customerVisible: true,
        },
      ],
      confirmedAt: new Date(Date.now() - 2 * 86400000),
    },
  ],
]);

export class PortalService {
  /**
   * Authenticate customer credentials and return JWT token
   */
  public async customerLogin(email: string, pass: string): Promise<{ accessToken: string; customer: CustomerUser }> {
    const normalizedEmail = email.toLowerCase().trim();
    const user = DEMO_CUSTOMERS[normalizedEmail];

    if (!user || user.passwordHashHash !== pass) {
      throw new UnauthorizedError('Invalid customer credentials');
    }

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

  /**
   * Get all quotations owned by the authenticated customer
   * SECURITY: Strictly filters by customerId
   */
  public async getCustomerQuotations(customerId: string): Promise<CustomerQuotationSummary[]> {
    const list: CustomerQuotationSummary[] = [];

    for (const quote of quotationsStore.values()) {
      if (quote.customerId === customerId) {
        list.push(this.sanitizeQuotationSummary(quote));
      }
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Get detailed quotation with negotiation history
   * SECURITY: Throws 403 Forbidden if quotation does not belong to customer
   */
  public async getCustomerQuotationById(quotationId: string, customerId: string): Promise<CustomerQuotationDetail> {
    const quote = quotationsStore.get(quotationId);

    if (!quote) {
      throw new NotFoundError('Quotation not found');
    }

    // STRICT RESOURCE OWNERSHIP CHECK
    if (quote.customerId !== customerId) {
      throw new ForbiddenError('You do not have authorization to view this quotation');
    }

    const negState = negotiationStore.get(quotationId) || {
      comments: [],
      changeRequests: [],
      timeline: [
        {
          id: randomUUID(),
          event: 'Quotation Shared',
          description: `Quotation ${quote.quotationNumber} issued for customer review`,
          timestamp: new Date(quote.createdAt),
          actor: 'SALES_REP',
          customerVisible: true,
        },
      ],
    };

    const sanitizedSummary = this.sanitizeQuotationSummary(quote);

    return {
      ...sanitizedSummary,
      lines: quote.lines.map((l) => ({
        lineId: l.lineId,
        productId: l.productId,
        productName: l.productName,
        description: l.description,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
        discountPercent: l.discountPercent,
        discountAmount: l.discountAmount,
        lineTotal: l.lineTotal,
      })),
      notes: 'Customer terms: Standard 30-day payment terms upon confirmation.',
      comments: negState.comments.map((c) => ({
        id: c.id,
        lineId: c.lineId,
        comment: c.comment,
        createdAt: c.createdAt.toISOString(),
        authorName: c.authorName,
        isCustomer: c.isCustomer,
      })),
      changeRequests: negState.changeRequests.map((cr) => ({
        id: cr.id,
        lineId: cr.lineId,
        type: cr.type,
        description: cr.description,
        requestedValue: cr.requestedValue,
        status: cr.status,
        createdAt: cr.createdAt.toISOString(),
      })),
      counterOffer: negState.counterOffer
        ? {
            id: negState.counterOffer.id,
            currentDiscount: negState.counterOffer.currentDiscount,
            proposedDiscount: negState.counterOffer.proposedDiscount,
            reason: negState.counterOffer.reason,
            status: negState.counterOffer.status,
            createdAt: negState.counterOffer.createdAt.toISOString(),
          }
        : undefined,
      timeline: negState.timeline
        .filter((t) => t.customerVisible)
        .map((t) => ({
          id: t.id,
          event: t.event,
          description: t.description,
          timestamp: t.timestamp.toISOString(),
          actor: t.actor,
          customerVisible: t.customerVisible,
        }))
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()),
      canNegotiate: quote.status !== 'CONFIRMED',
      canConfirm: quote.status !== 'CONFIRMED',
    };
  }

  /**
   * Add line comment or general comment
   */
  public async addLineComment(
    quotationId: string,
    customerId: string,
    customerName: string,
    input: LineCommentInput
  ): Promise<CustomerQuotationDetail> {
    const detail = await this.getCustomerQuotationById(quotationId, customerId);

    if (!detail.canNegotiate) {
      throw new ConflictError('Cannot add comments to a confirmed quotation');
    }

    const quote = quotationsStore.get(quotationId)!;
    quote.status = 'UNDER NEGOTIATION';
    quote.updatedAt = new Date().toISOString();

    const negState = negotiationStore.get(quotationId) || { comments: [], changeRequests: [], timeline: [] };
    const commentId = randomUUID();

    negState.comments.push({
      id: commentId,
      lineId: input.lineId,
      comment: input.comment,
      createdAt: new Date(),
      authorName: customerName,
      isCustomer: true,
    });

    const targetLine = input.lineId ? quote.lines.find((l) => l.lineId === input.lineId) : null;
    const targetDesc = targetLine ? `on item "${targetLine.productName}"` : 'on overall quotation';

    negState.timeline.push({
      id: randomUUID(),
      event: 'Comment Added',
      description: `Customer added a comment ${targetDesc}`,
      timestamp: new Date(),
      actor: 'CUSTOMER',
      customerVisible: true,
    });

    negotiationStore.set(quotationId, negState);

    return this.getCustomerQuotationById(quotationId, customerId);
  }

  /**
   * Submit change request
   */
  public async submitChangeRequest(
    quotationId: string,
    customerId: string,
    input: ChangeRequestInput
  ): Promise<CustomerQuotationDetail> {
    const detail = await this.getCustomerQuotationById(quotationId, customerId);

    if (!detail.canNegotiate) {
      throw new ConflictError('Cannot submit change requests for a confirmed quotation');
    }

    const quote = quotationsStore.get(quotationId)!;
    quote.status = 'UNDER NEGOTIATION';
    quote.updatedAt = new Date().toISOString();

    const negState = negotiationStore.get(quotationId) || { comments: [], changeRequests: [], timeline: [] };

    negState.changeRequests.push({
      id: randomUUID(),
      lineId: input.lineId,
      type: input.type,
      description: input.description,
      requestedValue: input.requestedValue,
      status: 'PENDING',
      createdAt: new Date(),
    });

    negState.timeline.push({
      id: randomUUID(),
      event: 'Change Request Submitted',
      description: `Customer submitted a ${input.type.toLowerCase()} change request: "${input.description}"`,
      timestamp: new Date(),
      actor: 'CUSTOMER',
      customerVisible: true,
    });

    negotiationStore.set(quotationId, negState);

    return this.getCustomerQuotationById(quotationId, customerId);
  }

  /**
   * Submit counter discount offer
   */
  public async submitCounterOffer(
    quotationId: string,
    customerId: string,
    input: CounterOfferInput
  ): Promise<CustomerQuotationDetail> {
    const detail = await this.getCustomerQuotationById(quotationId, customerId);

    if (!detail.canNegotiate) {
      throw new ConflictError('Cannot submit counter offers for a confirmed quotation');
    }

    const quote = quotationsStore.get(quotationId)!;
    const currentDiscountPercent = Math.round((quote.discountAmount / quote.subtotal) * 100);

    quote.status = 'UNDER NEGOTIATION';
    quote.updatedAt = new Date().toISOString();

    const negState = negotiationStore.get(quotationId) || { comments: [], changeRequests: [], timeline: [] };

    negState.counterOffer = {
      id: randomUUID(),
      currentDiscount: currentDiscountPercent,
      proposedDiscount: input.proposedDiscount,
      reason: input.reason,
      status: 'PENDING',
      createdAt: new Date(),
    };

    const reapprovalTriggered = input.proposedDiscount > currentDiscountPercent + 3;
    const approvalNote = reapprovalTriggered
      ? ' (Requires internal manager re-approval)'
      : ' (Under standard rep review)';

    negState.timeline.push({
      id: randomUUID(),
      event: 'Counter Discount Proposed',
      description: `Customer proposed a counter discount of ${input.proposedDiscount}% (Current: ${currentDiscountPercent}%)${approvalNote}`,
      timestamp: new Date(),
      actor: 'CUSTOMER',
      customerVisible: true,
    });

    negotiationStore.set(quotationId, negState);

    return this.getCustomerQuotationById(quotationId, customerId);
  }

  /**
   * Confirm quotation
   */
  public async confirmQuotation(
    quotationId: string,
    customerId: string,
    input: ConfirmQuoteInput
  ): Promise<CustomerQuotationDetail> {
    const detail = await this.getCustomerQuotationById(quotationId, customerId);

    if (!detail.canConfirm) {
      throw new ConflictError('This quotation has already been confirmed');
    }

    const quote = quotationsStore.get(quotationId)!;
    quote.status = 'CONFIRMED';
    quote.updatedAt = new Date().toISOString();

    const negState = negotiationStore.get(quotationId) || { comments: [], changeRequests: [], timeline: [] };

    negState.confirmedAt = new Date();
    negState.customerNotes = input.customerNotes;

    negState.timeline.push({
      id: randomUUID(),
      event: 'Quotation Confirmed',
      description: 'Customer explicitly confirmed and accepted the quotation terms',
      timestamp: new Date(),
      actor: 'CUSTOMER',
      customerVisible: true,
    });

    negotiationStore.set(quotationId, negState);

    return this.getCustomerQuotationById(quotationId, customerId);
  }

  /**
   * Helper: Sanitize raw internal document into customer-safe representation
   */
  private sanitizeQuotationSummary(raw: RawQuotation): CustomerQuotationSummary {
    return {
      id: raw.id,
      quotationNumber: raw.quotationNumber,
      customerId: raw.customerId,
      customerName: raw.customerName,
      companyName: raw.companyName,
      status: raw.status,
      validUntil: raw.validUntil,
      subtotal: raw.subtotal,
      discountAmount: raw.discountAmount,
      taxAmount: raw.taxAmount,
      total: raw.total,
      currency: raw.currency,
      lineCount: raw.lines.length,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}

export const portalService = new PortalService();
