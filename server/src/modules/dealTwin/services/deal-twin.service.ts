import { Quotation } from '../../quotations/models/quotation.model';
import { DealTwinSimulation } from '../models/deal-twin.model';
import { NotFoundError } from '../../../shared';

export interface SimulationInput {
  quotationId: string;
  discountTweakPercent: number; // e.g. -2, 0, +5
  volumeMultiplier: number; // e.g. 1.0, 1.2, 1.5
  paymentTerms?: string; // 'Net 15', 'Net 30', 'Net 60'
  userId?: string;
}

export class DealTwinService {
  public static async simulate(input: SimulationInput) {
    const quotation = await Quotation.findById(input.quotationId).populate('customerId');
    if (!quotation) throw new NotFoundError('Quotation not found');

    const mult = Math.max(0.5, input.volumeMultiplier || 1.0);
    const discTweak = input.discountTweakPercent || 0;
    const terms = input.paymentTerms || 'Net 30';

    // Base figures
    const baseSubtotal = quotation.subtotal * mult;
    const baseCost = quotation.costTotal * mult;

    // Adjusted discount
    const currentDiscPercent = quotation.subtotal > 0 ? (quotation.totalDiscount / quotation.subtotal) * 100 : 0;
    const effectiveDiscountPercent = Math.min(100, Math.max(0, currentDiscPercent + discTweak));
    const projectedDiscountAmount = baseSubtotal * (effectiveDiscountPercent / 100);

    const projectedRevenue = Math.max(0, baseSubtotal - projectedDiscountAmount);
    const projectedGrossMargin = projectedRevenue - baseCost;
    const projectedMarginPercent = projectedRevenue > 0 ? (projectedGrossMargin / projectedRevenue) * 100 : 0;

    // Win Probability Elasticity Model
    // Baseline 65%. Extra discount lifts win rate (+1.5% per 1% discount). Volume lifts (+10% for 1.5x). Longer payment terms hurt (-3% for Net 60).
    const termsPenalty = terms === 'Net 60' ? -4 : terms === 'Net 15' ? 4 : 0;
    const rawWinRate = 60 + (effectiveDiscountPercent - 10) * 1.8 + (mult - 1) * 20 + termsPenalty;
    const winProbabilityPercent = Math.min(96, Math.max(25, Math.round(rawWinRate)));

    // Governance prediction
    let governancePrediction = 'WITHIN_LIMIT';
    if (effectiveDiscountPercent > 30) {
      governancePrediction = 'BLOCKED';
    } else if (effectiveDiscountPercent > 12) {
      governancePrediction = 'APPROVAL_REQUIRED';
    }

    // Strategic Best Path Recommendation
    let bestPathRecommendation = 'Current deal structure balances margin retention and conversion velocity.';
    if (effectiveDiscountPercent > 20 && projectedMarginPercent < 25) {
      bestPathRecommendation =
        'High margin leakage detected. Recommend offering Net 15 payment terms with an additional 1-year support bundle instead of deeper discount to protect margin.';
    } else if (effectiveDiscountPercent <= 8 && winProbabilityPercent < 60) {
      bestPathRecommendation =
        'Win probability below threshold. Consider conceding 3%–5% extra discount in exchange for a 2-year commitment to boost win rate to 82%.';
    } else if (mult > 1.2) {
      bestPathRecommendation =
        'Volume tier unlock: Bundle multi-site deployment to secure standard authority while capturing 20% greater net revenue.';
    }

    const simulation = await DealTwinSimulation.create({
      quotationId: quotation._id,
      discountTweakPercent: discTweak,
      volumeMultiplier: mult,
      paymentTerms: terms,
      projectedRevenue: Math.round(projectedRevenue),
      projectedMarginPercent: Number(projectedMarginPercent.toFixed(1)),
      winProbabilityPercent,
      governancePrediction,
      bestPathRecommendation,
      simulatedBy: input.userId,
    });

    return simulation;
  }

  public static async getSimulations(quotationId: string) {
    return DealTwinSimulation.find({ quotationId }).sort({ createdAt: -1 }).limit(10);
  }

  public static async getBestPath(quotationId: string) {
    const quotation = await Quotation.findById(quotationId).populate('customerId');
    if (!quotation) throw new NotFoundError('Quotation not found');

    // Run simulated optimal frontier
    const optimalDiscountTweak = quotation.grossMarginPercent > 35 ? 4 : -2;
    const optimalVolume = 1.25;

    return this.simulate({
      quotationId,
      discountTweakPercent: optimalDiscountTweak,
      volumeMultiplier: optimalVolume,
      paymentTerms: 'Net 15',
    });
  }
}
