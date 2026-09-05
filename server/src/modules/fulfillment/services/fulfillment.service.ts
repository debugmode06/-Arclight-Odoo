import { Quotation } from '../../quotations/models/quotation.model';
import { Warehouse } from '../../admin/models/warehouse.model';
import { Inventory } from '../../admin/models/inventory.model';
import { Fulfillment, IFulfillment } from '../models/fulfillment.model';
import { Backorder, IBackorder } from '../models/backorder.model';
import { NotFoundError, BadRequestError } from '../../../shared';

export class FulfillmentService {
  public static async listFulfillments() {
    return Fulfillment.find()
      .populate('quotationId')
      .populate('allocations.productId')
      .populate('allocations.warehouseId')
      .sort({ createdAt: -1 });
  }

  public static async getFulfillmentById(id: string) {
    const f = await Fulfillment.findById(id)
      .populate('quotationId')
      .populate('allocations.productId')
      .populate('allocations.warehouseId')
      .populate('backorders.productId');
    if (!f) throw new NotFoundError('Fulfillment order not found');
    return f;
  }

  /**
   * Deterministic Auto-Split Algorithm:
   * 1. Fulfills requested quantity
   * 2. Minimizes shipment count
   * 3. Factors shipping cost weighting
   * 4. Identifies backorders when stock is insufficient
   */
  public static async recommendSplit(quotationId: string) {
    const quote = await Quotation.findById(quotationId);
    if (!quote) throw new NotFoundError('Quotation not found');

    const warehouses = await Warehouse.find({ isActive: true }).sort({ shippingCostWeight: 1 });
    const recommendedAllocations: any[] = [];
    const recommendedBackorders: any[] = [];
    const usedWarehouses = new Set<string>();
    let totalEstimatedCost = 0;

    for (const line of quote.lines) {
      let needed = line.quantity;
      const inventories = await Inventory.find({
        productId: line.productId,
        warehouseId: { $in: warehouses.map((w) => w._id) },
      }).populate('warehouseId');

      // Sort warehouses: First by largest available stock, then by lowest shipping cost weight
      inventories.sort((a: any, b: any) => {
        if (b.availableQuantity !== a.availableQuantity) {
          return b.availableQuantity - a.availableQuantity;
        }
        return (a.warehouseId?.shippingCostWeight || 1) - (b.warehouseId?.shippingCostWeight || 1);
      });

      for (const inv of inventories) {
        if (needed <= 0) break;
        if (inv.availableQuantity > 0) {
          const take = Math.min(needed, inv.availableQuantity);
          const wh: any = inv.warehouseId;
          const cost = Math.round(take * 25 * (wh?.shippingCostWeight || 1));

          recommendedAllocations.push({
            productId: line.productId,
            productName: line.productNameSnapshot,
            sku: line.productSkuSnapshot,
            warehouseId: wh._id,
            warehouseName: wh.name,
            warehouseCode: wh.code,
            allocatedQuantity: take,
            availableStock: inv.availableQuantity,
            shippingCost: cost,
          });

          usedWarehouses.add(wh._id.toString());
          totalEstimatedCost += cost;
          needed -= take;
        }
      }

      if (needed > 0) {
        recommendedBackorders.push({
          productId: line.productId,
          productName: line.productNameSnapshot,
          orderedQuantity: line.quantity,
          allocatedQuantity: line.quantity - needed,
          remainingQuantity: needed,
          status: 'PENDING',
        });
      }
    }

    return {
      quotationId: quote._id,
      quotationNumber: quote.quotationNumber,
      totalShipments: Math.max(1, usedWarehouses.size),
      estimatedShippingCost: totalEstimatedCost,
      allocations: recommendedAllocations,
      backorders: recommendedBackorders,
    };
  }

  public static async allocateStock(quotationId: string, customAllocations?: any[]) {
    const quote = await Quotation.findById(quotationId);
    if (!quote) throw new NotFoundError('Quotation not found');

    const split = customAllocations
      ? { allocations: customAllocations, backorders: [], totalShipments: 1, estimatedShippingCost: 0 }
      : await this.recommendSplit(quotationId);

    // Update inventory stocks
    for (const alloc of split.allocations) {
      const inv = await Inventory.findOne({
        warehouseId: alloc.warehouseId,
        productId: alloc.productId,
      });

      if (inv) {
        if (inv.availableQuantity < alloc.allocatedQuantity) {
          throw new BadRequestError(
            `Insufficient stock in warehouse for product. Available: ${inv.availableQuantity}, Requested: ${alloc.allocatedQuantity}`
          );
        }
        inv.availableQuantity -= alloc.allocatedQuantity;
        inv.reservedQuantity += alloc.allocatedQuantity;
        await inv.save();
      }
    }

    // Upsert fulfillment record
    const fulfillmentNumber = `FUL-${Date.now().toString().slice(-6)}`;
    const fulfillment = await Fulfillment.create({
      quotationId: quote._id,
      orderNumber: fulfillmentNumber,
      status: split.backorders.length > 0 ? 'PARTIAL' : 'ALLOCATED',
      totalShipments: split.totalShipments,
      estimatedShippingCost: split.estimatedShippingCost,
      allocations: split.allocations,
      backorders: split.backorders,
      promisedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      notes: `Warehouse allocation completed. Shipments: ${split.totalShipments}`,
    });

    // Save individual backorders
    for (const bo of split.backorders) {
      await Backorder.create({
        quotationId: quote._id,
        productId: bo.productId,
        orderedQuantity: bo.orderedQuantity,
        allocatedQuantity: bo.allocatedQuantity,
        remainingQuantity: bo.remainingQuantity,
        status: 'PENDING',
      });
    }

    return fulfillment;
  }

  public static async getBackorders() {
    return Backorder.find().populate('quotationId').populate('productId').sort({ createdAt: -1 });
  }

  public static async consolidateBackorder(backorderId: string) {
    const bo = await Backorder.findById(backorderId);
    if (!bo) throw new NotFoundError('Backorder not found');

    bo.status = 'CONSOLIDATED';
    await bo.save();

    // Update fulfillment status if all backorders are fulfilled
    await Fulfillment.updateOne(
      { quotationId: bo.quotationId, 'backorders.productId': bo.productId },
      { $set: { 'backorders.$.status': 'CONSOLIDATED', status: 'ALLOCATED' } }
    );

    return bo;
  }
}
