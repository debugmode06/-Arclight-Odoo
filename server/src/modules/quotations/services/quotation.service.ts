import { Types } from 'mongoose';
import { Quotation, IQuotation, RiskLevel } from '../models/quotation.model';
import { IQuotationLine } from '../models/quotation-line.model';
import { PricingService } from './pricing.service';
import { DiscountGovernanceService } from './discount-governance.service';
import { RiskService } from './risk.service';
import { ApprovalService } from '../../approvals/services/approval.service';
import { Customer } from '../../admin/models/customer.model';
import { Product } from '../../admin/models/product.model';
import '../../admin/models/category.model';
import { User } from '../../auth/models/user.model';
import { QuotationStatus, UserRole, NotFoundError, BadRequestError } from '../../../shared';

export interface QuotationLineInput {
  productId: string;
  quantity: number;
  unitPrice?: number;
  discountPercent?: number;
  taxPercent?: number;
}

export interface CreateQuotationInput {
  customerId: string;
  currency?: string;
  priceListId?: string;
  validUntil?: string | Date;
  notes?: string;
  lines: QuotationLineInput[];
}

export class QuotationService {
  /**
   * Generates next sequential quotation number: QT-YYYY-XXXX
   */
  public static async generateQuotationNumber(): Promise<string> {
    const year = new Date().getFullYear();
    const count = await Quotation.countDocuments({
      quotationNumber: new RegExp(`^QT-${year}-`),
    });
    const seq = (count + 1).toString().padStart(4, '0');
    return `QT-${year}-${seq}`;
  }

  /**
   * Resolves and calculates line items with snapshots and governance evaluations.
   */
  private static async processLines(
    linesInput: QuotationLineInput[],
    customer: { _id: Types.ObjectId; tier: any },
    allowBlocked: boolean = false
  ): Promise<IQuotationLine[]> {
    const lines: IQuotationLine[] = [];

    for (const item of linesInput) {
      if (!Types.ObjectId.isValid(item.productId)) {
        throw new BadRequestError(`Invalid product ID: ${item.productId}`);
      }

      const product = await Product.findById(item.productId).populate('categoryId');
      if (!product) {
        throw new NotFoundError(`Product not found: ${item.productId}`);
      }

      const unitPrice = item.unitPrice !== undefined ? item.unitPrice : product.basePrice;
      const costPrice = product.costPrice;
      const discountPercent = item.discountPercent || 0;
      const taxPercent = item.taxPercent || 0;

      // 1. Pricing calculation
      const pricing = PricingService.calculateLine({
        quantity: item.quantity,
        unitPrice,
        costPrice,
        discountPercent,
        taxPercent,
      });

      // 2. Rule evaluation
      const categoryId = (product.categoryId as any)?._id || product.categoryId;
      const rule = await DiscountGovernanceService.findApplicableRule({
        customerId: customer._id,
        customerTier: customer.tier,
        productId: product._id,
        categoryId,
      });

      const governance = DiscountGovernanceService.evaluateLine({
        discountPercent,
        lineMarginPercent: pricing.lineMarginPercent,
        rule,
      });

      // Check if BLOCKED by hard ceiling
      if (governance.decision === 'BLOCKED' && !allowBlocked) {
        throw new BadRequestError(
          `Line '${product.name}' violation: ${governance.reason}`
        );
      }

      lines.push({
        productId: product._id as Types.ObjectId,
        productNameSnapshot: product.name,
        productSkuSnapshot: product.sku,
        productCategorySnapshot: (product.categoryId as any)?.name || 'General',
        quantity: item.quantity,
        unitPrice,
        costPriceSnapshot: costPrice,
        discountPercent,
        discountAmount: pricing.discountAmount,
        taxPercent,
        taxAmount: pricing.taxAmount,
        lineSubtotal: pricing.lineSubtotal,
        lineTotal: pricing.lineTotal,
        lineCost: pricing.lineCost,
        lineMargin: pricing.lineMargin,
        lineMarginPercent: pricing.lineMarginPercent,
        appliedRuleNameSnapshot: governance.appliedRuleName,
        maxAllowedDiscountSnapshot: governance.maxAllowedDiscount,
        approvalThresholdDiscountSnapshot: governance.approvalThresholdDiscount,
        governanceDecision: governance.decision,
        governanceReason: governance.reason,
      });
    }

    return lines;
  }

  /**
   * Previews live commercial calculations without saving to database.
   */
  public static async recalculateDraft(input: CreateQuotationInput) {
    if (!Types.ObjectId.isValid(input.customerId)) {
      throw new BadRequestError('Invalid customer ID');
    }

    const customer = await Customer.findById(input.customerId);
    if (!customer) throw new NotFoundError('Customer not found');

    const lines = await this.processLines(input.lines || [], customer, true);
    const summary = PricingService.calculateSummary(lines);
    const risk = RiskService.calculateRisk({
      lines,
      subtotal: summary.subtotal,
      totalDiscount: summary.totalDiscount,
      grandTotal: summary.grandTotal,
      grossMarginPercent: summary.grossMarginPercent,
    });

    const isBlocked = lines.some((l) => l.governanceDecision === 'BLOCKED');
    const decision = isBlocked
      ? 'BLOCKED'
      : risk.requiresApproval
      ? 'APPROVAL_REQUIRED'
      : 'WITHIN_LIMIT';

    return {
      lines,
      summary,
      risk: {
        ...risk,
        decision,
      },
    };
  }

  /**
   * Creates a new quotation in DRAFT status with full calculation snapshot.
   */
  public static async createQuotation(
    input: CreateQuotationInput,
    userId: string
  ): Promise<IQuotation> {
    if (!Types.ObjectId.isValid(input.customerId)) {
      throw new BadRequestError('Invalid customer ID');
    }

    const customer = await Customer.findById(input.customerId);
    if (!customer) throw new NotFoundError('Customer not found');

    if (!input.lines || input.lines.length === 0) {
      throw new BadRequestError('Quotation must contain at least one line item');
    }

    const lines = await this.processLines(input.lines, customer);
    const summary = PricingService.calculateSummary(lines);
    const risk = RiskService.calculateRisk({
      lines,
      subtotal: summary.subtotal,
      totalDiscount: summary.totalDiscount,
      grandTotal: summary.grandTotal,
      grossMarginPercent: summary.grossMarginPercent,
    });

    const quotationNumber = await this.generateQuotationNumber();

    const quotation = await Quotation.create({
      quotationNumber,
      customerId: customer._id,
      currency: input.currency || 'USD',
      priceListId: input.priceListId ? new Types.ObjectId(input.priceListId) : undefined,
      status: QuotationStatus.DRAFT,
      lines,
      subtotal: summary.subtotal,
      totalDiscount: summary.totalDiscount,
      totalTax: summary.totalTax,
      grandTotal: summary.grandTotal,
      costTotal: summary.costTotal,
      grossMargin: summary.grossMargin,
      grossMarginPercent: summary.grossMarginPercent,
      discountRiskScore: risk.score,
      discountRiskLevel: risk.level,
      discountRiskFactors: risk.factors,
      approvalRequired: risk.requiresApproval,
      validUntil: input.validUntil ? new Date(input.validUntil) : undefined,
      notes: input.notes,
      createdBy: new Types.ObjectId(userId),
    });

    return quotation;
  }

  /**
   * Updates an existing quotation.
   * If commercial values change on an approved/pending quote, resets approval state.
   */
  public static async updateQuotation(
    id: string,
    input: Partial<CreateQuotationInput>,
    userId: string
  ): Promise<IQuotation> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError('Invalid quotation ID');
    }

    const quotation = await Quotation.findById(id);
    if (!quotation) throw new NotFoundError('Quotation not found');

    const customerId = input.customerId || quotation.customerId.toString();
    const customer = await Customer.findById(customerId);
    if (!customer) throw new NotFoundError('Customer not found');

    let lines = quotation.lines;
    if (input.lines) {
      lines = await this.processLines(input.lines, customer);
    }

    const summary = PricingService.calculateSummary(lines);
    const risk = RiskService.calculateRisk({
      lines,
      subtotal: summary.subtotal,
      totalDiscount: summary.totalDiscount,
      grandTotal: summary.grandTotal,
      grossMarginPercent: summary.grossMarginPercent,
    });

    // Invalidate approval state if quotation was modified
    let status = quotation.status;
    if (quotation.status === QuotationStatus.APPROVED || quotation.status === QuotationStatus.PENDING_APPROVAL) {
      status = QuotationStatus.DRAFT;
    }

    quotation.customerId = customer._id as Types.ObjectId;
    if (input.currency) quotation.currency = input.currency;
    if (input.validUntil) quotation.validUntil = new Date(input.validUntil);
    if (input.notes !== undefined) quotation.notes = input.notes;
    quotation.lines = lines;
    quotation.subtotal = summary.subtotal;
    quotation.totalDiscount = summary.totalDiscount;
    quotation.totalTax = summary.totalTax;
    quotation.grandTotal = summary.grandTotal;
    quotation.costTotal = summary.costTotal;
    quotation.grossMargin = summary.grossMargin;
    quotation.grossMarginPercent = summary.grossMarginPercent;
    quotation.discountRiskScore = risk.score;
    quotation.discountRiskLevel = risk.level;
    quotation.discountRiskFactors = risk.factors;
    quotation.approvalRequired = risk.requiresApproval;
    quotation.status = status;
    quotation.updatedBy = new Types.ObjectId(userId);

    await quotation.save();
    return quotation;
  }

  /**
   * Retrieves quotation detail with customer and populated references.
   */
  public static async getQuotationById(id: string): Promise<IQuotation> {
    const isObjectId = Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { quotationNumber: id.toUpperCase() };

    const quotation = await Quotation.findOne(query)
      .populate('customerId')
      .populate('createdBy', 'firstName lastName email role')
      .populate('currentApprovalRequestId');

    if (!quotation) throw new NotFoundError('Quotation not found');
    return quotation;
  }

  /**
   * Lists quotations with search, status, customer, and risk filters.
   */
  public static async listQuotations(filter: {
    search?: string;
    status?: QuotationStatus;
    customerId?: string;
    riskLevel?: RiskLevel;
    page?: number;
    limit?: number;
  }) {
    const query: Record<string, any> = {};

    if (filter.status) {
      query.status = filter.status;
    }
    if (filter.customerId && Types.ObjectId.isValid(filter.customerId)) {
      query.customerId = filter.customerId;
    }
    if (filter.riskLevel) {
      query.discountRiskLevel = filter.riskLevel;
    }
    if (filter.search) {
      const searchRegex = new RegExp(filter.search, 'i');
      query.$or = [{ quotationNumber: searchRegex }, { notes: searchRegex }];
    }

    const page = filter.page || 1;
    const limit = filter.limit || 20;
    const skip = (page - 1) * limit;

    const [quotations, total] = await Promise.all([
      Quotation.find(query)
        .populate('customerId', 'name company tier')
        .populate('createdBy', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Quotation.countDocuments(query),
    ]);

    return {
      data: quotations,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Submits a quotation for approval or auto-approves if within authority limits.
   */
  public static async submitQuotation(
    id: string,
    user: { id: string; role: UserRole }
  ): Promise<IQuotation> {
    const quotation = await Quotation.findById(id).populate('customerId');
    if (!quotation) throw new NotFoundError('Quotation not found');

    if (
      quotation.status !== QuotationStatus.DRAFT &&
      quotation.status !== QuotationStatus.RETURNED
    ) {
      throw new BadRequestError(
        `Cannot submit quotation in '${quotation.status}' state. Only DRAFT or RETURNED quotations can be submitted.`
      );
    }

    if (quotation.lines.length === 0) {
      throw new BadRequestError('Quotation has no line items');
    }

    // Check if any line is BLOCKED
    for (const line of quotation.lines) {
      if (line.governanceDecision === 'BLOCKED') {
        throw new BadRequestError(`Cannot submit quotation: ${line.governanceReason}`);
      }
    }

    if (!quotation.approvalRequired) {
      // Auto-approve: within standard sales authority
      quotation.status = QuotationStatus.APPROVED;
      quotation.updatedBy = new Types.ObjectId(user.id);
      await quotation.save();
      return quotation;
    }

    // Trigger Approval workflow
    const approvalRequest = await ApprovalService.createApprovalRequest(quotation, user);
    quotation.status = QuotationStatus.PENDING_APPROVAL;
    quotation.currentApprovalRequestId = approvalRequest._id as Types.ObjectId;
    quotation.updatedBy = new Types.ObjectId(user.id);
    await quotation.save();

    return quotation;
  }

  /**
   * Deletes quotation if in cancellable or draft state.
   */
  public static async deleteQuotation(id: string): Promise<void> {
    const quotation = await Quotation.findById(id);
    if (!quotation) throw new NotFoundError('Quotation not found');

    if (quotation.status === QuotationStatus.APPROVED) {
      throw new BadRequestError('Cannot delete an already approved quotation');
    }

    await Quotation.findByIdAndDelete(id);
  }
}
