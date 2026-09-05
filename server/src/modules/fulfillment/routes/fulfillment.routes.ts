import { Router } from 'express';
import { fulfillmentController } from '../controllers/fulfillment.controller';
import { requireAuth } from '../../../middleware/auth.middleware';

export const fulfillmentRouter = Router();

// Apply auth middleware
fulfillmentRouter.use(requireAuth);

// GET /api/fulfillment/current — Get current live MongoDB fulfillment state & audit logs
fulfillmentRouter.get('/current', fulfillmentController.getLatestFulfillment);

// GET /api/fulfillment — List fulfillment records
fulfillmentRouter.get('/', fulfillmentController.listFulfillments);

// GET /api/fulfillment/inventory — Get multi-warehouse stock overview matrix
fulfillmentRouter.get('/inventory', fulfillmentController.getInventorySummary);

// GET /api/fulfillment/backorders — List backorders from MongoDB
fulfillmentRouter.get('/backorders', fulfillmentController.listBackorders);

// GET /api/fulfillment/warehouses — List all warehouses
fulfillmentRouter.get('/warehouses', fulfillmentController.listWarehouses);

// POST /api/fulfillment/warehouses — Create new warehouse
fulfillmentRouter.post('/warehouses', fulfillmentController.createWarehouse);

// POST /api/fulfillment/recommend — Calculate smart stock allocation & split
fulfillmentRouter.post('/recommend', fulfillmentController.recommendAllocation);

// POST /api/fulfillment/allocate — Confirm and lock stock allocation in MongoDB
fulfillmentRouter.post('/allocate', fulfillmentController.confirmAllocation);

// POST /api/fulfillment/override — Server-validated manual warehouse allocation override
fulfillmentRouter.post('/override', fulfillmentController.manualOverride);

// POST /api/fulfillment/restore-split — Restore recommended split plan in MongoDB
fulfillmentRouter.post('/restore-split', fulfillmentController.restoreSplit);

// POST /api/fulfillment/inventory/receive — Receive stock arrival & auto-allocate backorders in MongoDB
fulfillmentRouter.post('/inventory/receive', fulfillmentController.receiveStock);

// PUT /api/fulfillment/inventory/:productId — Update stock level at warehouse
fulfillmentRouter.put('/inventory/:productId', fulfillmentController.updateStock);

// GET /api/fulfillment/:id — Get detailed fulfillment record
fulfillmentRouter.get('/:id', fulfillmentController.getFulfillmentDetail);
