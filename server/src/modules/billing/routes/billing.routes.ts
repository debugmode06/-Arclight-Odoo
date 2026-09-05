import { Router } from 'express';
import { billingController } from '../controllers/billing.controller';
import { requireAuth } from '../../../middleware/auth.middleware';

export const billingRouter = Router();

// Apply auth to all billing endpoints
billingRouter.use(requireAuth);

// POST /api/billing/calculate — Real-time hybrid bill preview
billingRouter.post('/calculate', billingController.calculateBill);

// GET /api/billing/invoices — List invoices
billingRouter.get('/invoices', billingController.listInvoices);

// POST /api/billing/invoices — Generate & save invoice
billingRouter.post('/invoices', billingController.createInvoice);

// GET /api/billing/invoices/:id — Get invoice detail
billingRouter.get('/invoices/:id', billingController.getInvoiceDetail);

// GET /api/billing/subscriptions — List available subscription tiers
billingRouter.get('/subscriptions', billingController.listSubscriptions);
