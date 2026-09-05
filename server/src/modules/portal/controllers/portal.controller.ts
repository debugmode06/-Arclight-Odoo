import { Request, Response, NextFunction } from 'express';
import { PortalService } from '../services/portal.service';
import { sendSuccess } from '../../../shared';
import { Customer } from '../../admin/models/customer.model';

async function resolveCustomerId(req: Request): Promise<string> {
  if (req.user?.id) {
    const cust = await Customer.findById(req.user.id);
    if (cust) return cust._id.toString();
  }
  // Fallback to query parameter or first customer for seamless testing
  if (req.query.customerId) return req.query.customerId as string;
  if (req.headers['x-customer-id']) return req.headers['x-customer-id'] as string;
  const first = await Customer.findOne();
  return first ? first._id.toString() : '';
}

export class PortalController {
  public static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      if (!email) {
        res.status(400).json({ success: false, error: { message: 'Email is required' } });
        return;
      }
      const result = await PortalService.customerLogin(email);
      sendSuccess(res, result, 'Customer authentication successful');
    } catch (err) {
      next(err);
    }
  }

  public static async getQuotes(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = await resolveCustomerId(req);
      const quotes = await PortalService.getCustomerQuotations(customerId);
      sendSuccess(res, quotes);
    } catch (err) {
      next(err);
    }
  }

  public static async getQuoteById(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = await resolveCustomerId(req);
      const data = await PortalService.getCustomerQuotationById(req.params.id, customerId);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async negotiate(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = await resolveCustomerId(req);
      const { text, counterDiscountPercent, lineId } = req.body;
      const result = await PortalService.submitNegotiation(req.params.id, customerId, {
        text,
        counterDiscountPercent: counterDiscountPercent ? Number(counterDiscountPercent) : undefined,
        lineId,
      });
      sendSuccess(res, result, 'Negotiation submitted');
    } catch (err) {
      next(err);
    }
  }

  public static async acceptQuote(req: Request, res: Response, next: NextFunction) {
    try {
      const customerId = await resolveCustomerId(req);
      const result = await PortalService.confirmQuotation(req.params.id, customerId);
      sendSuccess(res, result, 'Quotation accepted and confirmed');
    } catch (err) {
      next(err);
    }
  }
}
