import { Router } from 'express';
import { requireAuth, requireRole } from '../../../middleware';
import { validateBody, UserRole } from '../../../shared';
import { portalController } from '../controllers/portal.controller';
import {
  portalLoginSchema,
  lineCommentSchema,
  changeRequestSchema,
  counterOfferSchema,
  confirmQuoteSchema,
} from '../schemas/portal.schemas';

export const portalRouter = Router();

// Public Customer Authentication Endpoint
portalRouter.post(
  '/auth/login',
  validateBody(portalLoginSchema),
  portalController.login
);

// Protected Customer Quotes List
portalRouter.get(
  '/quotes',
  requireAuth,
  requireRole(UserRole.CUSTOMER),
  portalController.getQuotes
);

// Protected Customer Quote Details (Includes Ownership Verification)
portalRouter.get(
  '/quotes/:id',
  requireAuth,
  requireRole(UserRole.CUSTOMER),
  portalController.getQuoteById
);

// Add Comment on Line Item / Quote
portalRouter.post(
  '/quotes/:id/comments',
  requireAuth,
  requireRole(UserRole.CUSTOMER),
  validateBody(lineCommentSchema),
  portalController.addComment
);

// Submit Change Request (Quantity, Product, Commercial, Delivery)
portalRouter.post(
  '/quotes/:id/change-requests',
  requireAuth,
  requireRole(UserRole.CUSTOMER),
  validateBody(changeRequestSchema),
  portalController.submitChangeRequest
);

// Submit Counter Discount Offer
portalRouter.post(
  '/quotes/:id/counter-offers',
  requireAuth,
  requireRole(UserRole.CUSTOMER),
  validateBody(counterOfferSchema),
  portalController.submitCounterOffer
);

// Confirm Quotation
portalRouter.post(
  '/quotes/:id/confirm',
  requireAuth,
  requireRole(UserRole.CUSTOMER),
  validateBody(confirmQuoteSchema),
  portalController.confirmQuote
);
