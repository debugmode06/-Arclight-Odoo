import { Request, Response, NextFunction } from 'express';
import { FulfillmentService } from '../services/fulfillment.service';
import { sendSuccess } from '../../../shared';

export class FulfillmentController {
  public static async list(_req: Request, res: Response, next: NextFunction) {
    try {
      const list = await FulfillmentService.listFulfillments();
      sendSuccess(res, list);
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await FulfillmentService.getFulfillmentById(req.params.id);
      sendSuccess(res, item);
    } catch (err) {
      next(err);
    }
  }

  public static async recommendSplit(req: Request, res: Response, next: NextFunction) {
    try {
      const quotationId = (req.params.quotationId || req.query.quotationId) as string;
      const split = await FulfillmentService.recommendSplit(quotationId);
      sendSuccess(res, split);
    } catch (err) {
      next(err);
    }
  }

  public static async allocate(req: Request, res: Response, next: NextFunction) {
    try {
      const { quotationId, allocations } = req.body;
      const fulfillment = await FulfillmentService.allocateStock(quotationId, allocations);
      sendSuccess(res, fulfillment, 'Warehouse allocation successfully processed');
    } catch (err) {
      next(err);
    }
  }

  public static async getBackorders(_req: Request, res: Response, next: NextFunction) {
    try {
      const backorders = await FulfillmentService.getBackorders();
      sendSuccess(res, backorders);
    } catch (err) {
      next(err);
    }
  }

  public static async consolidateBackorder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await FulfillmentService.consolidateBackorder(req.params.id);
      sendSuccess(res, result, 'Backorder consolidated and fulfilled');
    } catch (err) {
      next(err);
    }
  }
}
