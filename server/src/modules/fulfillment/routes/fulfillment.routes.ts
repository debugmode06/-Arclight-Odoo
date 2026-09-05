import { Router } from 'express';
import { FulfillmentController } from '../controllers/fulfillment.controller';

export const fulfillmentRouter = Router();

// GET /api/fulfillment
fulfillmentRouter.get('/', FulfillmentController.list);

// GET /api/fulfillment/recommend-split?quotationId=... OR /api/fulfillment/recommend-split/:quotationId
fulfillmentRouter.get('/recommend-split', FulfillmentController.recommendSplit);
fulfillmentRouter.get('/recommend-split/:quotationId', FulfillmentController.recommendSplit);

// POST /api/fulfillment/allocate
fulfillmentRouter.post('/allocate', FulfillmentController.allocate);

// GET /api/fulfillment/backorders
fulfillmentRouter.get('/backorders', FulfillmentController.getBackorders);

// POST /api/fulfillment/backorders/:id/consolidate
fulfillmentRouter.post('/backorders/:id/consolidate', FulfillmentController.consolidateBackorder);

// GET /api/fulfillment/:id
fulfillmentRouter.get('/:id', FulfillmentController.getById);
