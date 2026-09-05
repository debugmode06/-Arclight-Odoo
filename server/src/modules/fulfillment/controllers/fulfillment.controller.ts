import { Request, Response } from 'express';
import { fulfillmentService } from '../services/fulfillment.service';
import { sendSuccess, sendCreated } from '../../../shared';
import { Warehouse } from '../models/warehouse.model';

export class FulfillmentController {
  public async getLatestFulfillment(req: Request, res: Response): Promise<void> {
    const fulfillmentNumber = (req.query.fulfillmentNumber as string) || 'FUL-Q-2025-0842';
    const result = await fulfillmentService.getLatestFulfillment(fulfillmentNumber);
    sendSuccess(res, result, 'Latest MongoDB fulfillment state retrieved successfully');
  }

  public async listFulfillments(_req: Request, res: Response): Promise<void> {
    const list = await fulfillmentService.listFulfillments();
    sendSuccess(res, list, 'Fulfillments retrieved successfully');
  }

  public async getFulfillmentDetail(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const detail = await fulfillmentService.getFulfillmentById(id);
    sendSuccess(res, detail, 'Fulfillment detail retrieved successfully');
  }

  public async recommendAllocation(req: Request, res: Response): Promise<void> {
    const { items, strategy, depotAQtyOverride, quotationId, customerId } = req.body;
    const result = await fulfillmentService.recommendAllocation({
      items: items || [{ productId: '64f1a2b3c4d5e6f7a8b9c101', quantity: 10 }],
      strategy,
      depotAQtyOverride,
      quotationId,
      customerId,
    });
    sendSuccess(res, result, 'Stock allocation split recommended from MongoDB successfully');
  }

  public async confirmAllocation(req: Request, res: Response): Promise<void> {
    const {
      fulfillmentNumber = 'FUL-Q-2025-0842',
      quotationId = '64f1a2b3c4d5e6f7a8b9c201',
      customerId = '64f1a2b3c4d5e6f7a8b9c202',
      allocations,
      strategy = 'DIRECT_SPLIT',
      isManualOverride = false,
      notes,
    } = req.body;

    const user = (req as any).user?.name || 'Vikram Mehta (Logistics Manager)';

    const result = await fulfillmentService.confirmAndReleaseAllocation(
      fulfillmentNumber,
      quotationId,
      customerId,
      allocations,
      strategy,
      isManualOverride,
      user,
      notes
    );
    sendCreated(res, result, 'Stock allocation confirmed and locked in MongoDB successfully');
  }

  public async manualOverride(req: Request, res: Response): Promise<void> {
    const { fulfillmentNumber = 'FUL-Q-2025-0842', depotAQty, depotBQty, notes } = req.body;
    const user = (req as any).user?.name || 'Vikram Mehta (Logistics Manager)';

    const result = await fulfillmentService.manualOverrideAllocation(
      fulfillmentNumber,
      Number(depotAQty),
      Number(depotBQty),
      user,
      notes
    );
    sendSuccess(res, result, 'Manual allocation override validated and saved to MongoDB');
  }

  public async restoreSplit(req: Request, res: Response): Promise<void> {
    const { fulfillmentNumber = 'FUL-Q-2025-0842' } = req.body;
    const user = (req as any).user?.name || 'Vikram Mehta (Logistics Manager)';

    const result = await fulfillmentService.restoreSuggestedSplitPlan(fulfillmentNumber, user);
    sendSuccess(res, result, 'Suggested split plan restored in MongoDB successfully');
  }

  public async receiveStock(req: Request, res: Response): Promise<void> {
    const { warehouseId, productId, receivedQty } = req.body;
    const user = (req as any).user?.name || 'Vikram Mehta (Logistics Manager)';

    const result = await fulfillmentService.receiveStock(
      warehouseId,
      productId,
      Number(receivedQty),
      user
    );
    sendSuccess(res, result, 'Stock received and backorders auto-allocated in MongoDB');
  }

  public async getInventorySummary(_req: Request, res: Response): Promise<void> {
    const result = await fulfillmentService.getInventorySummary();
    sendSuccess(res, result, 'Inventory matrix retrieved from MongoDB');
  }

  public async updateStock(req: Request, res: Response): Promise<void> {
    const { productId } = req.params;
    const { warehouseId, quantityAvailable, reorderPoint, reorderQuantity } = req.body;
    const result = await fulfillmentService.updateStock(
      productId,
      warehouseId,
      quantityAvailable,
      reorderPoint,
      reorderQuantity
    );
    sendSuccess(res, result, 'Inventory stock level updated in MongoDB');
  }

  public async listBackorders(_req: Request, res: Response): Promise<void> {
    const result = await fulfillmentService.getBackorders();
    sendSuccess(res, result, 'Backorders retrieved from MongoDB');
  }

  public async createWarehouse(req: Request, res: Response): Promise<void> {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    sendCreated(res, warehouse, 'Warehouse created in MongoDB');
  }

  public async listWarehouses(_req: Request, res: Response): Promise<void> {
    const warehouses = await Warehouse.find();
    sendSuccess(res, warehouses, 'Warehouses retrieved from MongoDB');
  }
}

export const fulfillmentController = new FulfillmentController();
