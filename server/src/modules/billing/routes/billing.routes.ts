import { Router } from 'express';
import { BillingController } from '../controllers/billing.controller';

export const billingRouter = Router();

// Invoices
billingRouter.get('/invoices', BillingController.listInvoices);
billingRouter.get('/invoices/:id', BillingController.getInvoiceById);
billingRouter.post('/invoices/:id/payments', BillingController.recordPayment);
billingRouter.post('/generate', BillingController.generateBilling);

// Subscriptions & Proration
billingRouter.get('/subscriptions', BillingController.listSubscriptions);
billingRouter.post('/subscriptions/:id/modify', BillingController.modifySubscription);
billingRouter.post('/subscriptions/:id/cancel', BillingController.cancelSubscription);

// Billing Schedules
billingRouter.get('/schedules', BillingController.listBillingSchedules);
