import { Request, Response, NextFunction } from 'express';
import { DealTwinService } from '../services/deal-twin.service';
import { sendSuccess } from '../../../shared';

export class DealTwinController {
  public static async simulate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quotationId, discountTweakPercent, volumeMultiplier, paymentTerms } = req.body;
      if (!quotationId) {
        res.status(400).json({ success: false, error: { message: 'quotationId is required' } });
        return;
      }
      const simulation = await DealTwinService.simulate({
        quotationId,
        discountTweakPercent: Number(discountTweakPercent || 0),
        volumeMultiplier: Number(volumeMultiplier || 1.0),
        paymentTerms,
        userId: req.user?.id,
      });
      sendSuccess(res, simulation, 'Simulation completed');
    } catch (err) {
      next(err);
    }
  }

  public static async getSimulations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quotationId } = req.params;
      const simulations = await DealTwinService.getSimulations(quotationId);
      sendSuccess(res, simulations);
    } catch (err) {
      next(err);
    }
  }

  public static async getBestPath(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { quotationId } = req.params;
      const bestPath = await DealTwinService.getBestPath(quotationId);
      sendSuccess(res, bestPath);
    } catch (err) {
      next(err);
    }
  }
}
