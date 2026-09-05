export type QuotationStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'RETURNED'
  | 'CANCELLED'
  | 'WON'
  | 'LOST'
  | 'EXPIRED';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type GovernanceDecision = 'WITHIN_LIMIT' | 'APPROVAL_REQUIRED' | 'BLOCKED';

export interface Customer {
  _id: string;
  name: string;
  email: string;
  company: string;
  tier: 'STANDARD' | 'SILVER' | 'GOLD' | 'PLATINUM';
  phone?: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  sku: string;
  categoryId: { _id: string; name: string } | string;
  basePrice: number;
  costPrice: number;
  unit: string;
  description?: string;
}

export interface QuotationLineItem {
  _id?: string;
  productId: string;
  productNameSnapshot: string;
  productSkuSnapshot: string;
  productCategorySnapshot?: string;
  quantity: number;
  unitPrice: number;
  costPriceSnapshot: number;
  discountPercent: number;
  discountAmount: number;
  taxPercent: number;
  taxAmount: number;
  lineSubtotal: number;
  lineTotal: number;
  lineCost: number;
  lineMargin: number;
  lineMarginPercent: number;
  appliedRuleNameSnapshot?: string;
  maxAllowedDiscountSnapshot?: number;
  approvalThresholdDiscountSnapshot?: number;
  governanceDecision: GovernanceDecision;
  governanceReason?: string;
}

export interface CommercialSummary {
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  costTotal: number;
  grossMargin: number;
  grossMarginPercent: number;
}

export interface RiskEvaluation {
  score: number;
  level: RiskLevel;
  factors: string[];
  requiresApproval: boolean;
}

export interface Quotation {
  _id: string;
  quotationNumber: string;
  customerId: Customer | string;
  currency: string;
  status: QuotationStatus;
  lines: QuotationLineItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  grandTotal: number;
  costTotal: number;
  grossMargin: number;
  grossMarginPercent: number;
  discountRiskScore: number;
  discountRiskLevel: RiskLevel;
  discountRiskFactors: string[];
  approvalRequired: boolean;
  currentApprovalRequestId?: string;
  validUntil?: string;
  notes?: string;
  createdBy?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface QuotationLineInput {
  productId: string;
  quantity: number;
  unitPrice?: number;
  discountPercent?: number;
  taxPercent?: number;
}

export interface CreateQuotationPayload {
  customerId: string;
  currency?: string;
  validUntil?: string;
  notes?: string;
  lines: QuotationLineInput[];
}
