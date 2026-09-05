import { Types } from 'mongoose';
import { CustomerTier } from '../../../shared';
import { DiscountRule, IDiscountRule } from '../../admin/models/discount-rule.model';
import { GovernanceDecision } from '../models/quotation-line.model';

export interface GovernanceEvaluationResult {
  decision: GovernanceDecision;
  reason: string;
  appliedRuleName: string;
  maxAllowedDiscount: number;
  approvalThresholdDiscount: number;
  minMarginPercent: number;
}

export class DiscountGovernanceService {
  /**
   * Default fallback governance parameters if no specific rule matches in DB.
   */
  private static readonly GLOBAL_DEFAULT_RULE = {
    name: 'Global Standard Governance Policy',
    maxAllowedDiscount: 25, // Hard ceiling
    approvalThresholdDiscount: 10, // Max discount before requiring approval
    minMarginPercent: 20, // Min gross margin % before requiring approval
  };

  /**
   * Deterministically finds the highest priority rule matching the context.
   * Priority:
   * 1. Customer + Product
   * 2. Customer + Category
   * 3. Customer Tier + Product
   * 4. Customer Tier + Category
   * 5. Product specific
   * 6. Category specific
   * 7. Global fallback
   */
  public static async findApplicableRule(params: {
    customerId?: Types.ObjectId | string;
    customerTier?: CustomerTier;
    productId?: Types.ObjectId | string;
    categoryId?: Types.ObjectId | string;
  }): Promise<{
    name: string;
    maxAllowedDiscount: number;
    approvalThresholdDiscount: number;
    minMarginPercent: number;
  }> {
    const rules = await DiscountRule.find({ isActive: true }).sort({ priority: 1 }).lean();

    const customerIdStr = params.customerId?.toString();
    const productIdStr = params.productId?.toString();
    const categoryIdStr = params.categoryId?.toString();
    const tier = params.customerTier;

    // 1. Customer + Product
    const r1 = rules.find(
      (r) => r.customerId?.toString() === customerIdStr && r.productId?.toString() === productIdStr
    );
    if (r1) return r1;

    // 2. Customer + Category
    const r2 = rules.find(
      (r) => r.customerId?.toString() === customerIdStr && r.categoryId?.toString() === categoryIdStr
    );
    if (r2) return r2;

    // 3. Customer Tier + Product
    const r3 = rules.find(
      (r) => r.customerTier === tier && r.productId?.toString() === productIdStr
    );
    if (r3) return r3;

    // 4. Customer Tier + Category
    const r4 = rules.find(
      (r) => r.customerTier === tier && r.categoryId?.toString() === categoryIdStr
    );
    if (r4) return r4;

    // 5. Product specific
    const r5 = rules.find((r) => r.productId?.toString() === productIdStr && !r.customerId && !r.customerTier);
    if (r5) return r5;

    // 6. Category specific
    const r6 = rules.find((r) => r.categoryId?.toString() === categoryIdStr && !r.customerId && !r.customerTier);
    if (r6) return r6;

    // 7. General customer tier rule if defined
    const r7 = rules.find((r) => r.customerTier === tier && !r.productId && !r.categoryId);
    if (r7) return r7;

    return this.GLOBAL_DEFAULT_RULE;
  }

  /**
   * Evaluates a line item against the governance rule.
   */
  public static evaluateLine(input: {
    discountPercent: number;
    lineMarginPercent: number;
    rule: {
      name: string;
      maxAllowedDiscount: number;
      approvalThresholdDiscount: number;
      minMarginPercent: number;
    };
  }): GovernanceEvaluationResult {
    const { discountPercent, lineMarginPercent, rule } = input;

    // 1. Hard Ceiling check
    if (discountPercent > rule.maxAllowedDiscount) {
      return {
        decision: 'BLOCKED',
        reason: `Requested discount ${discountPercent}% exceeds hard governance ceiling of ${rule.maxAllowedDiscount}% [${rule.name}]`,
        appliedRuleName: rule.name,
        maxAllowedDiscount: rule.maxAllowedDiscount,
        approvalThresholdDiscount: rule.approvalThresholdDiscount,
        minMarginPercent: rule.minMarginPercent,
      };
    }

    // 2. Approval Trigger check: Discount > threshold OR Margin < min
    const reasons: string[] = [];
    if (discountPercent > rule.approvalThresholdDiscount) {
      reasons.push(
        `Discount ${discountPercent}% exceeds sales authority threshold of ${rule.approvalThresholdDiscount}%`
      );
    }
    if (lineMarginPercent < rule.minMarginPercent) {
      reasons.push(
        `Line gross margin ${lineMarginPercent.toFixed(1)}% is below minimum target of ${rule.minMarginPercent}%`
      );
    }

    if (reasons.length > 0) {
      return {
        decision: 'APPROVAL_REQUIRED',
        reason: `${reasons.join(' & ')} [${rule.name}]`,
        appliedRuleName: rule.name,
        maxAllowedDiscount: rule.maxAllowedDiscount,
        approvalThresholdDiscount: rule.approvalThresholdDiscount,
        minMarginPercent: rule.minMarginPercent,
      };
    }

    // 3. Within authorized sales limits
    return {
      decision: 'WITHIN_LIMIT',
      reason: `Discount ${discountPercent}% is within standard authority (limit: ${rule.approvalThresholdDiscount}%) [${rule.name}]`,
      appliedRuleName: rule.name,
      maxAllowedDiscount: rule.maxAllowedDiscount,
      approvalThresholdDiscount: rule.approvalThresholdDiscount,
      minMarginPercent: rule.minMarginPercent,
    };
  }
}
