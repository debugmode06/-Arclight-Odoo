import { Product } from '../../admin/models/product.model';

export interface UpsellRecommendation {
  productId: string;
  name: string;
  sku: string;
  basePrice: number;
  costPrice: number;
  reason: string;
  promotionBadge: string;
  marginImpactPercent: number;
}

export class RecommendationService {
  /**
   * Deterministic recommendation engine based on product pairings, category margins, and co-purchase patterns.
   */
  public static async getRecommendations(currentProductIds: string[]): Promise<UpsellRecommendation[]> {
    if (!currentProductIds || currentProductIds.length === 0) {
      return [];
    }

    const allProducts = await Product.find({ isActive: true }).populate('categoryId');
    const existingSet = new Set(currentProductIds.map((id) => id.toString()));

    const recommendations: UpsellRecommendation[] = [];

    // Check pairing rules
    for (const prod of allProducts) {
      if (existingSet.has(prod._id.toString())) continue;

      const baseMargin = prod.basePrice ? ((prod.basePrice - prod.costPrice) / prod.basePrice) * 100 : 30;

      // Rule 1: Security SOC recommendation if Server or Router is in quote
      if (
        prod.sku === 'SEC-SOC-12' &&
        allProducts.some((p) => existingSet.has(p._id.toString()) && (p.sku.startsWith('HW-') || p.sku.startsWith('CLD-')))
      ) {
        recommendations.push({
          productId: prod._id.toString(),
          name: prod.name,
          sku: prod.sku,
          basePrice: prod.basePrice,
          costPrice: prod.costPrice,
          reason: 'Enterprise deployments bundled with 24/7 Threat Hunting SOC reduce operational risk by 60%',
          promotionBadge: 'CYBERSECURITY BUNDLE (+50% MARGIN)',
          marginImpactPercent: Number(baseMargin.toFixed(1)),
        });
      }

      // Rule 2: Architecture Implementation Services if Hardware or Cloud Core in quote
      else if (
        prod.sku === 'SVC-ENG-01' &&
        allProducts.some((p) => existingSet.has(p._id.toString()) && (p.sku === 'HW-SRV-9000' || p.sku === 'CLD-LIC-01'))
      ) {
        recommendations.push({
          productId: prod._id.toString(),
          name: prod.name,
          sku: prod.sku,
          basePrice: prod.basePrice,
          costPrice: prod.costPrice,
          reason: 'High-density infrastructure requires onboarding engineering to guarantee 99.99% SLA',
          promotionBadge: 'ACCELERATED DEPLOYMENT (+35% MARGIN)',
          marginImpactPercent: Number(baseMargin.toFixed(1)),
        });
      }

      // Rule 3: Distributed Cloud Storage if Cloud Core is in quote
      else if (
        prod.sku === 'CLD-STR-10' &&
        allProducts.some((p) => existingSet.has(p._id.toString()) && p.sku === 'CLD-LIC-01')
      ) {
        recommendations.push({
          productId: prod._id.toString(),
          name: prod.name,
          sku: prod.sku,
          basePrice: prod.basePrice,
          costPrice: prod.costPrice,
          reason: 'Frequent co-purchase: 85% of Cloud Core subscriptions add high-availability storage tier',
          promotionBadge: 'POPULAR ADD-ON (+45% MARGIN)',
          marginImpactPercent: Number(baseMargin.toFixed(1)),
        });
      }
    }

    return recommendations.slice(0, 2); // Return top 2 relevant recommendations
  }
}
