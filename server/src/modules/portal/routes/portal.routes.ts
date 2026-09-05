import { Router } from 'express';
import { PortalController } from '../controllers/portal.controller';

export const portalRouter = Router();

// Customer Portal Auth
portalRouter.post('/auth/login', PortalController.login);

// Customer Quotations (restricted & sanitized)
portalRouter.get('/quotes', PortalController.getQuotes);
portalRouter.get('/quotes/:id', PortalController.getQuoteById);

// Customer Negotiation & Counter-Offers (triggers automatic re-governance)
portalRouter.post('/quotes/:id/negotiate', PortalController.negotiate);

// Customer Confirmation & Order Conversion
portalRouter.post('/quotes/:id/accept', PortalController.acceptQuote);
