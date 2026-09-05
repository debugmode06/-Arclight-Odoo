import { Router } from 'express';
import { DealTwinController } from '../controllers/deal-twin.controller';

export const dealTwinRouter = Router();

// POST /api/deal-twin/simulate
dealTwinRouter.post('/simulate', DealTwinController.simulate);

// GET /api/deal-twin/simulations/:quotationId
dealTwinRouter.get('/simulations/:quotationId', DealTwinController.getSimulations);

// GET /api/deal-twin/best-path/:quotationId
dealTwinRouter.get('/best-path/:quotationId', DealTwinController.getBestPath);
