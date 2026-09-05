import { UserRole } from '../../../shared';

export interface CustomerUser {
  id: string;
  email: string;
  name: string;
  company: string;
  tier: string;
  role: UserRole;
}

export interface CustomerQuoteLineItem {
  lineId: string;
  lineNo: string;
  categoryTag: string;
  categoryType: 'CapEx' | 'OpEx';
  statusTag: 'Accepted Line Price' | 'Counter-Offer Submitted (Round 2)' | 'Pending Review' | 'In Discussion';
  statusTagColor: 'green' | 'coral' | 'purple' | 'slate';
  productId: string;
  productName: string;
  subtitle?: string;
  description: string;
  quantity: number;
  unit: string;
  listUnitPrice: number;
  effectiveUnitPrice: number;
  unitPrice?: number;
  discountPercent: number;
  discountAmount: number;
  lineTotal: number;
  depotAllocation?: string;
  notes?: string;

  hasCounterOffer?: boolean;
  counterDiscountPercent?: number;
  counterRequestedPrice?: number;
  counterRequestedDiscountAmount?: number;
  counterMessage?: string;
  counterTimestamp?: string;
  customerActionText?: string;
}

export interface AuditLogEntry {
  id: string;
  event: string;
  actorName: string;
  actorRole: string;
  description: string;
  timestamp: string;
  isActiveSession?: boolean;
}

export interface ConcessionTradeOff {
  id: string;
  title: string;
  badge: string;
  badgeType: 'success' | 'info';
  description: string;
  discountPercent: number;
}

export interface CustomerQuotationSummary {
  id: string;
  quotationNumber: string;
  title: string;
  subtitle: string;
  roundTag: string;
  customerId: string;
  customerName: string;
  companyName: string;
  status: 'SENT' | 'UNDER NEGOTIATION' | 'CONFIRMED' | string;
  validUntil: string;
  baseQuotedTotal: number;
  taxAmount: number;
  taxPercent: number;
  totalWithTax: number;
  total?: number;
  currency?: string;
  netContractValue: number;
  oneTimeCapEx: number;
  recurringOpExAnnual: number;
  activeCounterDelta: number;
  pendingCountersCount: number;
  targetCounterTotal: number;
  currencySymbol: string;
  currencyCode: string;
  lineCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerQuotationDetail extends CustomerQuotationSummary {
  lines: CustomerQuoteLineItem[];
  auditLogs: AuditLogEntry[];
  concessionTradeOffs: ConcessionTradeOff[];
  assignedRep: {
    name: string;
    email: string;
    avatarInitials: string;
    title: string;
    statusText: string;
  };
  canNegotiate: boolean;
  canConfirm: boolean;
}

export interface CounterOfferSubmissionInput {
  lineId?: string;
  proposedDiscount: number;
  selectedTradeOffId?: string;
  justification?: string;
}
