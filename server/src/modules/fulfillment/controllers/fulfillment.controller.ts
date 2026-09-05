import { Request, Response } from 'express';
import { fulfillmentService } from '../services/fulfillment.service';
import { sendSuccess, sendCreated } from '../../../shared';
import { Warehouse } from '../models/warehouse.model';

export class FulfillmentController {
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
    const { items } = req.body;
    const result = await fulfillmentService.recommendAllocation(items);
    sendSuccess(res, result, 'Stock allocation split recommended successfully');
  }

  public async confirmAllocation(req: Request, res: Response): Promise<void> {
    const { quotationId, customerId, allocations, isManualOverride, notes } = req.body;
    const result = await fulfillmentService.confirmAllocation(
      quotationId,
      customerId,
      allocations,
      isManualOverride,
      notes
    );
    sendCreated(res, result, 'Stock allocation confirmed and locked successfully');
  }

  public async shipFulfillment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const result = await fulfillmentService.shipFulfillment(id);
    sendSuccess(res, result, 'Fulfillment marked as shipped');
  }

  public async manualOverride(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { allocations, notes } = req.body;
    const currentFulfillment = await fulfillmentService.getFulfillmentById(id);

    const result = await fulfillmentService.confirmAllocation(
      currentFulfillment.quotationId.toString(),
      currentFulfillment.customerId.toString(),
      allocations,
      true,
      notes || 'Manual warehouse manager override applied'
    );
    sendSuccess(res, result, 'Manual allocation override executed successfully');
  }

  public async getInventorySummary(_req: Request, res: Response): Promise<void> {
    const result = await fulfillmentService.getInventorySummary();
    sendSuccess(res, result, 'Inventory matrix retrieved successfully');
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
    sendSuccess(res, result, 'Inventory stock level updated successfully');
  }

  public async listBackorders(_req: Request, res: Response): Promise<void> {
    const result = await fulfillmentService.getBackorders();
    sendSuccess(res, result, 'Backorders retrieved successfully');
  }

  public async receiveStock(req: Request, res: Response): Promise<void> {
    const { warehouseId, productId, receivedQty } = req.body;
    const result = await fulfillmentService.receiveStock(
      warehouseId,
      productId,
      Number(receivedQty)
    );
    sendSuccess(res, result, 'Stock received and backorders auto-allocated successfully');
  }

  public async recommendConsolidation(req: Request, res: Response): Promise<void> {
    const { items, hubWarehouseCode } = req.body;
    const result = await fulfillmentService.recommendConsolidation(items, hubWarehouseCode);
    sendSuccess(res, result, 'Consolidation analysis calculated successfully');
  }

  public async createWarehouse(req: Request, res: Response): Promise<void> {
    const warehouse = new Warehouse(req.body);
    await warehouse.save();
    sendCreated(res, warehouse, 'Warehouse created successfully');
  }

  public async listWarehouses(_req: Request, res: Response): Promise<void> {
    const warehouses = await Warehouse.find();
    sendSuccess(res, warehouses, 'Warehouses retrieved successfully');
  }
}

export const fulfillmentController = new FulfillmentController();
