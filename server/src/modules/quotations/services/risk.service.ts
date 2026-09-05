import { RiskLevel } from '../models/quotation.model';
import { IQuotationLine } from '../models/quotation-line.model';

export interface RiskEvaluationResult {
  score: number;
  level: RiskLevel;
  factors: string[];
  requiresApproval: boolean;
}

export class RiskService {
  private static readonly TARGET_MARGIN_BENCHMARK = 30; // 30% standard target margin

  /**
   * Computes a deterministic 0-100 blended, value-weighted discount risk score.
   */
  public static calculateRisk(params: {
    lines: IQuotationLine[];
    subtotal: number;
    totalDiscount: number;
    grandTotal: number;
    grossMarginPercent: number;
  }): RiskEvaluationResult {
    const { lines, subtotal, totalDiscount, grossMarginPercent } = params;

    if (!lines || lines.length === 0 || subtotal <= 0) {
      return {
        score: 0,
        level: 'LOW',
        factors: ['No items or zero value in quotation'],
        requiresApproval: false,
      };
    }

    const factors: string[] = [];
    let excessDiscountPoints = 0;
    let marginShortfallPoints = 0;
    let dealExposurePoints = 0;
    let lineViolationPoints = 0;

    // 1. Value-Weighted Excess Discount (0 - 40 points)
    let totalWeightedExcess = 0;
    let violatingLinesCount = 0;

    for (const line of lines) {
      const threshold = line.approvalThresholdDiscountSnapshot ?? 10;
      const excess = Math.max(0, line.discountPercent - threshold);
      const weight = line.lineSubtotal / subtotal;

      if (excess > 0) {
        totalWeightedExcess += excess * weight;
        violatingLinesCount++;
        factors.push(
          `Line '${line.productNameSnapshot}' discount of ${line.discountPercent}% exceeds sales authority (${threshold}%) by ${excess.toFixed(1)}%`
        );
      } else if (line.governanceDecision === 'APPROVAL_REQUIRED') {
        violatingLinesCount++;
        if (line.governanceReason) {
          factors.push(line.governanceReason);
        }
      }
    }

    // A weighted excess of 10% or more yields the max 40 points
    excessDiscountPoints = Math.min(40, (totalWeightedExcess / 10) * 40);
    if (totalWeightedExcess > 0) {
      factors.unshift(
        `Blended value-weighted discount excess: ${totalWeightedExcess.toFixed(1)}% above authorized levels`
      );
    }

    // 2. Margin Deterioration Impact (0 - 35 points)
    if (grossMarginPercent < this.TARGET_MARGIN_BENCHMARK) {
      const shortfall = this.TARGET_MARGIN_BENCHMARK - grossMarginPercent;
      // A shortfall of 20% (e.g. margin at 10% vs 30%) yields max 35 points
      marginShortfallPoints = Math.min(35, (shortfall / 20) * 35);
      factors.push(
        `Overall gross margin (${grossMarginPercent.toFixed(1)}%) is ${shortfall.toFixed(1)}% below the target benchmark of ${this.TARGET_MARGIN_BENCHMARK}%`
      );
    }

    // 3. Deal Size & Financial Exposure (0 - 15 points)
    // Discount ratio = totalDiscount / subtotal
    const discountRatio = subtotal > 0 ? (totalDiscount / subtotal) * 100 : 0;
    if (discountRatio > 15 || totalDiscount >= 5000) {
      const discountImpact = Math.min(10, (totalDiscount / 10000) * 10);
      const ratioImpact = Math.min(5, ((discountRatio - 15) / 15) * 5);
      dealExposurePoints = Math.min(15, discountImpact + ratioImpact);
      factors.push(
        `High cumulative discount exposure: $${totalDiscount.toLocaleString(undefined, { minimumFractionDigits: 2 })} (${discountRatio.toFixed(1)}% of quote subtotal)`
      );
    }

    // 4. Line Violation Count (0 - 10 points)
    const violationRatio = lines.length > 0 ? violatingLinesCount / lines.length : 0;
    lineViolationPoints = Math.min(10, violationRatio * 10);
    if (violatingLinesCount > 0) {
      factors.push(
        `${violatingLinesCount} of ${lines.length} quotation items require management sign-off`
      );
    }

    // Calculate total score clamped between 0 and 100
    const rawScore = excessDiscountPoints + marginShortfallPoints + dealExposurePoints + lineViolationPoints;
    const score = Math.min(100, Math.max(0, Math.round(rawScore)));

    // Categorize risk level
    let level: RiskLevel = 'LOW';
    if (score >= 80) {
      level = 'CRITICAL';
    } else if (score >= 60) {
      level = 'HIGH';
    } else if (score >= 30) {
      level = 'MEDIUM';
    }

    const requiresApproval =
      violatingLinesCount > 0 ||
      score >= 30 ||
      grossMarginPercent < 20 ||
      lines.some((l) => l.governanceDecision === 'APPROVAL_REQUIRED');

    if (factors.length === 0) {
      factors.push('Commercial parameters are within normal sales thresholds');
    }

    return {
      score,
      level,
      factors,
      requiresApproval,
    };
  }
}
