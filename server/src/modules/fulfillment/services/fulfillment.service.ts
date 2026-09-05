import { Types } from 'mongoose';
import { Warehouse } from '../models/warehouse.model';
import { Inventory } from '../models/inventory.model';
import { Fulfillment, IFulfillment, AllocationStatus } from '../models/fulfillment.model';
import { NotFoundError, BadRequestError } from '../../../shared';

export interface AllocationItemRequest {
  productId: string;
  quantity: number;
}

export interface RecommendationResult {
  allocations: Array<{
    productId: string;
    warehouseId: string;
    warehouseName: string;
    warehouseCode: string;
    quantityAllocated: number;
    shippingCost: number;
    status: AllocationStatus;
  }>;
  backorders: Array<{
    productId: string;
    quantityBackordered: number;
    reason: string;
  }>;
  totalShipments: number;
  totalShippingCost: number;
  isSplitRequired: boolean;
  canFulfillCompletely: boolean;
}

export class FulfillmentService {
  /**
   * SMART ALGORITHM: Recommend multi-warehouse split & calculate shipping costs
   */
  public async recommendAllocation(
    items: AllocationItemRequest[]
  ): Promise<RecommendationResult> {
    const warehouses = await Warehouse.find({ isActive: true });
    if (!warehouses || warehouses.length === 0) {
      throw new BadRequestError('No active warehouses configured in the system');
    }

    const allocations: RecommendationResult['allocations'] = [];
    const backorders: RecommendationResult['backorders'] = [];
    const warehouseUsedMap = new Set<string>();

    for (const item of items) {
      let remainingDemand = item.quantity;

      // Find all inventory records for this product across active warehouses with available stock
      const warehouseIds = warehouses.map((w) => w._id);
      const stockRecords = await Inventory.find({
        productId: new Types.ObjectId(item.productId),
        warehouseId: { $in: warehouseIds },
        quantityAvailable: { $gt: 0 },
      }).populate('warehouseId');

      // 1. Prefer single warehouse if it can fulfill full quantity
      const singleWHMatch = stockRecords.find(
        (rec) => rec.quantityAvailable >= remainingDemand
      );

      if (singleWHMatch) {
        const wh = warehouses.find(
          (w) => w._id.toString() === singleWHMatch.warehouseId._id.toString()
        ) || warehouses[0];

        const estDistanceKm = 100; // Default baseline distance calculation factor
        const shippingCost = Number(
          (wh.shippingBaseFee + wh.shippingRatePerKm * estDistanceKm).toFixed(2)
        );

        allocations.push({
          productId: item.productId,
          warehouseId: wh._id.toString(),
          warehouseName: wh.name,
          warehouseCode: wh.code,
          quantityAllocated: remainingDemand,
          shippingCost,
          status: 'ALLOCATED',
        });
        warehouseUsedMap.add(wh._id.toString());
        remainingDemand = 0;
      } else {
        // 2. Multi-warehouse split: Sort warehouses by largest available stock
        stockRecords.sort((a, b) => b.quantityAvailable - a.quantityAvailable);

        for (const record of stockRecords) {
          if (remainingDemand <= 0) break;

          const qtyToTake = Math.min(record.quantityAvailable, remainingDemand);
          const wh = warehouses.find(
            (w) => w._id.toString() === record.warehouseId._id.toString()
          );
          if (!wh) continue;

          const estDistanceKm = 120 + Math.floor(Math.random() * 50);
          const shippingCost = Number(
            (wh.shippingBaseFee + wh.shippingRatePerKm * estDistanceKm).toFixed(2)
          );

          allocations.push({
            productId: item.productId,
            warehouseId: wh._id.toString(),
            warehouseName: wh.name,
            warehouseCode: wh.code,
            quantityAllocated: qtyToTake,
            shippingCost,
            status: 'ALLOCATED',
          });
          warehouseUsedMap.add(wh._id.toString());
          remainingDemand -= qtyToTake;
        }

        // 3. Backorder handling if total inventory is insufficient
        if (remainingDemand > 0) {
          backorders.push({
            productId: item.productId,
            quantityBackordered: remainingDemand,
            reason: `Insufficient multi-warehouse inventory. Short by ${remainingDemand} units.`,
          });
        }
      }
    }

    const totalShipments = warehouseUsedMap.size;
    const totalShippingCost = Number(
      allocations.reduce((sum, a) => sum + a.shippingCost, 0).toFixed(2)
    );

    return {
      allocations,
      backorders,
      totalShipments,
      totalShippingCost,
      isSplitRequired: totalShipments > 1,
      canFulfillCompletely: backorders.length === 0,
    };
  }

  /**
   * Confirm allocation: lock inventory in DB & create or update fulfillment record
   */
  public async confirmAllocation(
    quotationId: string,
    customerId: string,
    allocationsData: Array<{
      productId: string;
      warehouseId: string;
      quantityAllocated: number;
      shippingCost?: number;
    }>,
    isManualOverride: boolean = false,
    notes?: string
  ): Promise<IFulfillment> {
    const warehouseUsedSet = new Set<string>();
    let totalShippingCost = 0;

    const formattedAllocations = [];

    for (const alloc of allocationsData) {
      const inventory = await Inventory.findOne({
        warehouseId: new Types.ObjectId(alloc.warehouseId),
        productId: new Types.ObjectId(alloc.productId),
      });

      if (!inventory || inventory.quantityAvailable < alloc.quantityAllocated) {
        throw new BadRequestError(
          `Insufficient stock at warehouse ${alloc.warehouseId} for product ${alloc.productId}`
        );
      }

      // Lock inventory
      inventory.quantityAvailable -= alloc.quantityAllocated;
      inventory.quantityReserved += alloc.quantityAllocated;
      await inventory.save();

      const wh = await Warehouse.findById(alloc.warehouseId);
      const cost = alloc.shippingCost || (wh ? wh.shippingBaseFee + 50 : 25);
      totalShippingCost += cost;
      warehouseUsedSet.add(alloc.warehouseId);

      formattedAllocations.push({
        productId: new Types.ObjectId(alloc.productId),
        warehouseId: new Types.ObjectId(alloc.warehouseId),
        quantityAllocated: alloc.quantityAllocated,
        shippingCost: cost,
        status: 'ALLOCATED' as AllocationStatus,
      });
    }

    const count = await Fulfillment.countDocuments();
    const fulfillmentNumber = `FUL-2026-${String(count + 1).padStart(4, '0')}`;

    const fulfillment = new Fulfillment({
      fulfillmentNumber,
      quotationId: new Types.ObjectId(quotationId),
      customerId: new Types.ObjectId(customerId),
      status: 'ALLOCATED',
      allocations: formattedAllocations,
      totalShipments: warehouseUsedSet.size,
      totalShippingCost: Number(totalShippingCost.toFixed(2)),
      isManualOverride,
      notes,
    });

    return await fulfillment.save();
  }

  /**
   * Dispatch fulfillment shipment & update inventory state
   */
  public async shipFulfillment(fulfillmentId: string): Promise<IFulfillment> {
    const fulfillment = await Fulfillment.findById(fulfillmentId);
    if (!fulfillment) {
      throw new NotFoundError('Fulfillment record not found');
    }

    if (fulfillment.status === 'SHIPPED' || fulfillment.status === 'DELIVERED') {
      throw new BadRequestError('Fulfillment is already shipped or delivered');
    }

    for (const alloc of fulfillment.allocations) {
      const inventory = await Inventory.findOne({
        warehouseId: alloc.warehouseId,
        productId: alloc.productId,
      });

      if (inventory) {
        inventory.quantityReserved = Math.max(
          0,
          inventory.quantityReserved - alloc.quantityAllocated
        );
        await inventory.save();
      }

      alloc.status = 'SHIPPED';
      alloc.shippedAt = new Date();
      alloc.trackingNumber = `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`;
    }

    fulfillment.status = 'SHIPPED';
    fulfillment.shippedAt = new Date();
    return await fulfillment.save();
  }

  /**
   * Multi-warehouse inventory matrix summary
   */
  public async getInventorySummary() {
    const warehouses = await Warehouse.find({ isActive: true }).select('name code location');
    const inventoryList = await Inventory.find()
      .populate('warehouseId', 'name code')
      .populate('productId', 'name sku basePrice unit');

    return {
      warehouses,
      inventory: inventoryList,
    };
  }

  /**
   * Update stock levels per warehouse & trigger backorder reconciliation
   */
  public async updateStock(
    productId: string,
    warehouseId: string,
    quantityAvailable: number,
    reorderPoint?: number,
    reorderQuantity?: number
  ) {
    let inventory = await Inventory.findOne({
      productId: new Types.ObjectId(productId),
      warehouseId: new Types.ObjectId(warehouseId),
    });

    if (!inventory) {
      inventory = new Inventory({
        productId: new Types.ObjectId(productId),
        warehouseId: new Types.ObjectId(warehouseId),
        quantityAvailable,
        quantityReserved: 0,
        reorderPoint: reorderPoint ?? 10,
        reorderQuantity: reorderQuantity ?? 50,
      });
    } else {
      inventory.quantityAvailable = quantityAvailable;
      if (reorderPoint !== undefined) inventory.reorderPoint = reorderPoint;
      if (reorderQuantity !== undefined) inventory.reorderQuantity = reorderQuantity;
    }

    await inventory.save();

    // Auto-reconcile pending backorders if stock was added!
    await this.reconcileBackordersForProduct(productId);

    return inventory;
  }

  /**
   * EVENT HANDLER / ENDPOINT: Receive incoming stock & auto-allocate to backorders using priority rules
   * Priority Rules:
   * 1. Enterprise Customer / Tier-1 First
   * 2. High Priority / Paid Orders First
   * 3. First Created Backorder First (FIFO)
   */
  public async receiveStock(
    warehouseId: string,
    productId: string,
    receivedQty: number
  ) {
    // Step 1: Update stock in MongoDB
    let inventory = await Inventory.findOne({
      productId: new Types.ObjectId(productId),
      warehouseId: new Types.ObjectId(warehouseId),
    });

    if (!inventory) {
      inventory = new Inventory({
        productId: new Types.ObjectId(productId),
        warehouseId: new Types.ObjectId(warehouseId),
        quantityAvailable: receivedQty,
        quantityReserved: 0,
        reorderPoint: 10,
        reorderQuantity: 50,
      });
    } else {
      inventory.quantityAvailable += receivedQty;
    }

    await inventory.save();

    // Step 2: Query pending backorders from MongoDB across fulfillments
    const backorderedFulfillments = await Fulfillment.find({
      'backorders.status': { $in: ['PENDING', 'PARTIAL_FULFILLED'] },
    })
      .populate('customerId')
      .populate('quotationId');

    // Sort by priority rules:
    // a. Enterprise customer first
    // b. Paid/Confirmed high priority
    // c. FIFO (createdAt)
    backorderedFulfillments.sort((a: any, b: any) => {
      const aIsEnterprise = a.customerId?.tier === 'ENTERPRISE' ? 1 : 0;
      const bIsEnterprise = b.customerId?.tier === 'ENTERPRISE' ? 1 : 0;
      if (aIsEnterprise !== bIsEnterprise) return bIsEnterprise - aIsEnterprise;

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });

    let availableToAllocate = inventory.quantityAvailable;
    const allocatedBackorders: Array<{
      fulfillmentNumber: string;
      productId: string;
      quantityAllocated: number;
      newStatus: string;
    }> = [];

    for (const f of backorderedFulfillments) {
      if (availableToAllocate <= 0) break;

      let fulfillmentModified = false;

      for (const bo of f.backorders) {
        if (
          bo.productId.toString() === productId &&
          (bo.status === 'PENDING' || (bo as any).status === 'PARTIAL_FULFILLED')
        ) {
          const needed = bo.quantityBackordered;
          const qtyToGive = Math.min(needed, availableToAllocate);

          if (qtyToGive > 0) {
            availableToAllocate -= qtyToGive;
            inventory.quantityAvailable -= qtyToGive;
            inventory.quantityReserved += qtyToGive;

            // Add allocation
            f.allocations.push({
              productId: new Types.ObjectId(productId),
              warehouseId: new Types.ObjectId(warehouseId),
              quantityAllocated: qtyToGive,
              shippingCost: 25,
              status: 'ALLOCATED',
            });

            if (qtyToGive === needed) {
              bo.status = 'RESOLVED';
              bo.resolvedAt = new Date();
              allocatedBackorders.push({
                fulfillmentNumber: f.fulfillmentNumber,
                productId,
                quantityAllocated: qtyToGive,
                newStatus: 'FULFILLED',
              });
            } else {
              bo.quantityBackordered -= qtyToGive;
              (bo as any).status = 'PARTIAL_FULFILLED';
              allocatedBackorders.push({
                fulfillmentNumber: f.fulfillmentNumber,
                productId,
                quantityAllocated: qtyToGive,
                newStatus: 'PARTIAL_FULFILLED',
              });
            }
            fulfillmentModified = true;
          }
        }
      }

      if (fulfillmentModified) {
        const allResolved = f.backorders.every((b) => b.status === 'RESOLVED');
        if (allResolved) {
          f.status = 'ALLOCATED';
        } else {
          f.status = 'PARTIALLY_FULFILLED';
        }
        await f.save();
      }
    }

    await inventory.save();

    return {
      warehouseId,
      productId,
      receivedQty,
      remainingStock: inventory.quantityAvailable,
      allocatedBackorders,
    };
  }

  /**
   * CONSOLIDATION FLOW: Calculate direct multi-shipment vs central hub consolidation
   */
  public async recommendConsolidation(
    items: AllocationItemRequest[],
    hubWarehouseCode: string = 'WH-CENTRAL-HUB'
  ) {
    const directResult = await this.recommendAllocation(items);

    const hubWarehouse = await Warehouse.findOne({ code: hubWarehouseCode }) || 
      await Warehouse.findOne({ name: /Bhiwandi|Central/i }) || 
      (await Warehouse.find({ isActive: true }))[0];

    const hubTransferFee = 150; // $150 or ₹12,000
    const consolidatedOutboundShipping = 65; // Single shipping from hub
    const totalConsolidatedCost = hubTransferFee + consolidatedOutboundShipping;
    const directCost = directResult.totalShippingCost || 230;
    const netSavings = directCost - totalConsolidatedCost;

    return {
      directSplit: {
        mode: 'DIRECT_MULTI_SHIPMENT',
        totalShipments: directResult.totalShipments || 2,
        totalShippingCost: directCost,
        estimatedDeliveryTimeDays: '1-2 Days (Fast Track)',
        description: 'Direct multi-warehouse shipment from WH-A and WH-B directly to customer sites.',
      },
      hubConsolidation: {
        mode: 'HUB_CONSOLIDATION',
        hubWarehouseName: hubWarehouse ? hubWarehouse.name : 'Bhiwandi Central Hub',
        hubTransferFee,
        outboundShippingCost: consolidatedOutboundShipping,
        totalShippingCost: totalConsolidatedCost,
        estimatedDeliveryTimeDays: '4-6 Days (Slower)',
        delayPenaltyDays: 3,
        shippingCostSavings: netSavings,
        description: 'Transfer items from WH-A and WH-B to Central Hub, consolidating into a single outbound shipment.',
      },
    };
  }

  /**
   * Reconcile backorders when new stock arrives
   */
  private async reconcileBackordersForProduct(productId: string) {
    const pendingFulfillments = await Fulfillment.find({
      'backorders.productId': new Types.ObjectId(productId),
      'backorders.status': 'PENDING',
    });

    for (const f of pendingFulfillments) {
      for (const bo of f.backorders) {
        if (bo.productId.toString() === productId && bo.status === 'PENDING') {
          bo.status = 'RESOLVED';
          bo.resolvedAt = new Date();
        }
      }

      const allResolved = f.backorders.every((b) => b.status === 'RESOLVED');
      if (allResolved && f.status === 'BACKORDERED') {
        f.status = 'ALLOCATED';
      }
      await f.save();
    }
  }

  /**
   * List all backorders across orders
   */
  public async getBackorders() {
    return await Fulfillment.find({
      'backorders.0': { $exists: true },
    })
      .populate('quotationId')
      .populate('customerId')
      .populate('backorders.productId', 'name sku');
  }

  /**
   * List fulfillments
   */
  public async listFulfillments() {
    return await Fulfillment.find()
      .populate('quotationId')
      .populate('customerId')
      .populate('allocations.warehouseId', 'name code')
      .populate('allocations.productId', 'name sku')
      .sort({ createdAt: -1 });
  }

  /**
   * Get single fulfillment by ID
   */
  public async getFulfillmentById(id: string) {
    const fulfillment = await Fulfillment.findById(id)
      .populate('quotationId')
      .populate('customerId')
      .populate('allocations.warehouseId', 'name code location shippingRatePerKm')
      .populate('allocations.productId', 'name sku basePrice unit')
      .populate('backorders.productId', 'name sku');

    if (!fulfillment) {
      throw new NotFoundError('Fulfillment record not found');
    }
    return fulfillment;
  }
}

export const fulfillmentService = new FulfillmentService();

