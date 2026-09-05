import { Request, Response, NextFunction } from 'express';
import { BillingService } from '../services/billing.service';
import { sendSuccess } from '../../../shared';

export class BillingController {
  public static async listInvoices(_req: Request, res: Response, next: NextFunction) {
    try {
      const invoices = await BillingService.listInvoices();
      sendSuccess(res, invoices);
    } catch (err) {
      next(err);
    }
  }

  public static async getInvoiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const invoice = await BillingService.getInvoiceById(req.params.id);
      sendSuccess(res, invoice);
    } catch (err) {
      next(err);
    }
  }

  public static async recordPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, paymentMethod, transactionReference, notes } = req.body;
      const result = await BillingService.recordPayment(req.params.id, {
        amount,
        paymentMethod,
        transactionReference,
        notes,
      });
      sendSuccess(res, result, 'Payment recorded successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async listSubscriptions(_req: Request, res: Response, next: NextFunction) {
    try {
      const subs = await BillingService.listSubscriptions();
      sendSuccess(res, subs);
    } catch (err) {
      next(err);
    }
  }

  public static async modifySubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { newPlanId, newQuantity } = req.body;
      const result = await BillingService.modifySubscription(req.params.id, { newPlanId, newQuantity });
      sendSuccess(res, result, 'Subscription modified with calculated proration');
    } catch (err) {
      next(err);
    }
  }

  public static async cancelSubscription(req: Request, res: Response, next: NextFunction) {
    try {
      const { reason } = req.body;
      const result = await BillingService.cancelSubscription(req.params.id, reason);
      sendSuccess(res, result, 'Subscription cancelled with credit note evaluation');
    } catch (err) {
      next(err);
    }
  }

  public static async listBillingSchedules(req: Request, res: Response, next: NextFunction) {
    try {
      const { subscriptionId } = req.query;
      const schedules = await BillingService.listBillingSchedules(subscriptionId as string);
      sendSuccess(res, schedules);
    } catch (err) {
      next(err);
    }
  }

  public static async generateBilling(req: Request, res: Response, next: NextFunction) {
    try {
      const { quotationId } = req.body;
      const result = await BillingService.generateBillingForQuotation(quotationId);
      sendSuccess(res, result, 'Hybrid billing successfully generated');
    } catch (err) {
      next(err);
    }
  }
}
