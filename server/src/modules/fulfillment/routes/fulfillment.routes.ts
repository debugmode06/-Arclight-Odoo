import { Router } from 'express';
import { fulfillmentController } from '../controllers/fulfillment.controller';
import { requireAuth, requireRole } from '../../../middleware/auth.middleware';
import { UserRole } from '../../../shared';
import { validateBody } from '../../../shared';
import {
  recommendAllocationSchema,
  manualAllocationOverrideSchema,
  updateInventorySchema,
  createWarehouseSchema,
} from '../schemas/fulfillment.schema';

export const fulfillmentRouter = Router();

// Apply auth to all fulfillment endpoints
fulfillmentRouter.use(requireAuth);

// GET /api/fulfillment — List fulfillment records
fulfillmentRouter.get('/', fulfillmentController.listFulfillments);

// GET /api/fulfillment/inventory — Get multi-warehouse stock overview matrix
fulfillmentRouter.get('/inventory', fulfillmentController.getInventorySummary);

// GET /api/fulfillment/backorders — List backorders
fulfillmentRouter.get('/backorders', fulfillmentController.listBackorders);

// GET /api/fulfillment/warehouses — List all warehouses
fulfillmentRouter.get('/warehouses', fulfillmentController.listWarehouses);

// POST /api/fulfillment/warehouses — Create new warehouse
fulfillmentRouter.post(
  '/warehouses',
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(createWarehouseSchema),
  fulfillmentController.createWarehouse
);

// POST /api/fulfillment/recommend — Calculate smart stock allocation & warehouse split
fulfillmentRouter.post('/recommend', fulfillmentController.recommendAllocation);

// POST /api/fulfillment/allocate — Confirm and lock stock allocation
fulfillmentRouter.post(
  '/allocate',
  requireRole(UserRole.WAREHOUSE, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fulfillmentController.confirmAllocation
);

// GET /api/fulfillment/:id — Get detailed fulfillment record
fulfillmentRouter.get('/:id', fulfillmentController.getFulfillmentDetail);

// POST /api/fulfillment/:id/ship — Mark fulfillment as shipped
fulfillmentRouter.post(
  '/:id/ship',
  requireRole(UserRole.WAREHOUSE, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fulfillmentController.shipFulfillment
);

// POST /api/fulfillment/:id/override — Manual warehouse allocation override
fulfillmentRouter.post(
  '/:id/override',
  requireRole(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.WAREHOUSE),
  validateBody(manualAllocationOverrideSchema),
  fulfillmentController.manualOverride
);

// PUT /api/fulfillment/inventory/:productId — Update stock level at warehouse
fulfillmentRouter.put(
  '/inventory/:productId',
  requireRole(UserRole.WAREHOUSE, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateBody(updateInventorySchema),
  fulfillmentController.updateStock
);

// POST /api/fulfillment/inventory/receive — Stock Arrival event handler & backorder auto-fulfillment
fulfillmentRouter.post(
  '/inventory/receive',
  requireRole(UserRole.WAREHOUSE, UserRole.ADMIN, UserRole.SUPER_ADMIN),
  fulfillmentController.receiveStock
);

// POST /api/fulfillment/consolidation — Calculate direct split vs hub consolidation costs
fulfillmentRouter.post(
  '/consolidation',
  fulfillmentController.recommendConsolidation
);

