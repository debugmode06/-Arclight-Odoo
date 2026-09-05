import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendError, sendUnauthorized, sendForbidden, sendNotFound } from '../../../shared';
import { portalService } from '../services/portal.service';

export class PortalController {
  /**
   * POST /api/portal/auth/login
   */
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const result = await portalService.customerLogin(email, password);
      sendSuccess(res, result, 'Customer login successful');
    } catch (err: any) {
      if (err.name === 'UnauthorizedError' || err.statusCode === 401) {
        sendUnauthorized(res, err.message || 'Invalid customer credentials');
        return;
      }
      next(err);
    }
  }

  /**
   * GET /api/portal/quotes
   */
  public async getQuotes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        sendUnauthorized(res, 'Customer authentication required');
        return;
      }

      const quotes = await portalService.getCustomerQuotations(req.user.id);
      sendSuccess(res, quotes, 'Customer quotations retrieved successfully');
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /api/portal/quotes/:id
   */
  public async getQuoteById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        sendUnauthorized(res, 'Customer authentication required');
        return;
      }

      const quoteId = req.params.id;
      const quote = await portalService.getCustomerQuotationById(quoteId, req.user.id);
      sendSuccess(res, quote, 'Customer quotation retrieved successfully');
    } catch (err: any) {
      if (err.name === 'ForbiddenError' || err.statusCode === 403) {
        sendForbidden(res, err.message || 'Access denied');
        return;
      }
      if (err.name === 'NotFoundError' || err.statusCode === 404) {
        sendNotFound(res, err.message || 'Quotation not found');
        return;
      }
      next(err);
    }
  }

  /**
   * POST /api/portal/quotes/:id/comments
   */
  public async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        sendUnauthorized(res, 'Customer authentication required');
        return;
      }

      const quoteId = req.params.id;
      const customerName = (req.user as any).name || req.user.email;
      const updated = await portalService.addLineComment(quoteId, req.user.id, customerName, req.body);
      sendSuccess(res, updated, 'Comment added successfully');
    } catch (err: any) {
      if (err.name === 'ForbiddenError' || err.statusCode === 403) {
        sendForbidden(res, err.message || 'Access denied');
        return;
      }
      next(err);
    }
  }

  /**
   * POST /api/portal/quotes/:id/change-requests
   */
  public async submitChangeRequest(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        sendUnauthorized(res, 'Customer authentication required');
        return;
      }

      const quoteId = req.params.id;
      const updated = await portalService.submitChangeRequest(quoteId, req.user.id, req.body);
      sendSuccess(res, updated, 'Change request submitted successfully');
    } catch (err: any) {
      if (err.name === 'ForbiddenError' || err.statusCode === 403) {
        sendForbidden(res, err.message || 'Access denied');
        return;
      }
      next(err);
    }
  }

  /**
   * POST /api/portal/quotes/:id/counter-offers
   */
  public async submitCounterOffer(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        sendUnauthorized(res, 'Customer authentication required');
        return;
      }

      const quoteId = req.params.id;
      const updated = await portalService.submitCounterOffer(quoteId, req.user.id, req.body);
      sendSuccess(res, updated, 'Counter offer submitted successfully');
    } catch (err: any) {
      if (err.name === 'ForbiddenError' || err.statusCode === 403) {
        sendForbidden(res, err.message || 'Access denied');
        return;
      }
      next(err);
    }
  }

  /**
   * POST /api/portal/quotes/:id/confirm
   */
  public async confirmQuote(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        sendUnauthorized(res, 'Customer authentication required');
        return;
      }

      const quoteId = req.params.id;
      const updated = await portalService.confirmQuotation(quoteId, req.user.id);
      sendSuccess(res, updated, 'Quotation confirmed successfully');
    } catch (err: any) {
      if (err.name === 'ForbiddenError' || err.statusCode === 403) {
        sendForbidden(res, err.message || 'Access denied');
        return;
      }
      next(err);
    }
  }
}

export const portalController = new PortalController();
