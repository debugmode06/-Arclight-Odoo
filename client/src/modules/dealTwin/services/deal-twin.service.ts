import apiClient from '@/services/api.client';

export interface SimulationResult {
  _id: string;
  quotationId: string;
  discountTweakPercent: number;
  volumeMultiplier: number;
  paymentTerms: string;
  projectedRevenue: number;
  projectedMarginPercent: number;
  winProbabilityPercent: number;
  governancePrediction: string;
  bestPathRecommendation: string;
  createdAt: string;
}

export class DealTwinService {
  public static async simulate(data: {
    quotationId: string;
    discountTweakPercent: number;
    volumeMultiplier: number;
    paymentTerms?: string;
  }): Promise<SimulationResult> {
    const res = await apiClient.post<{ success: boolean; data: SimulationResult }>(
      '/deal-twin/simulate',
      data
    );
    return res.data.data;
  }

  public static async getSimulations(quotationId: string): Promise<SimulationResult[]> {
    const res = await apiClient.get<{ success: boolean; data: SimulationResult[] }>(
      `/deal-twin/simulations/${quotationId}`
    );
    return res.data.data || [];
  }

  public static async getBestPath(quotationId: string): Promise<SimulationResult> {
    const res = await apiClient.get<{ success: boolean; data: SimulationResult }>(
      `/deal-twin/best-path/${quotationId}`
    );
    return res.data.data;
  }
}
