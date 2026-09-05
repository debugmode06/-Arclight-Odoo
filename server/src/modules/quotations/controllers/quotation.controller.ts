import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { QuotationService } from '../services/quotation.service';
import { createQuotationSchema, updateQuotationSchema, listQuotationsQuerySchema } from '../schemas/quotation.schema';
import { sendSuccess, sendCreated, UserRole } from '../../../shared';
import { User } from '../../auth/models/user.model';

async function resolveUser(req: Request) {
  if (req.user) return req.user;
  const defaultUser = await User.findOne({ role: UserRole.SALES_REP }) || await User.findOne();
  if (defaultUser) {
    return { id: defaultUser._id.toString(), email: defaultUser.email, role: defaultUser.role };
  }
  return { id: new Types.ObjectId().toString(), email: 'rep@dealflow360.com', role: UserRole.SALES_REP };
}

export class QuotationController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = listQuotationsQuerySchema.parse(req.query);
      const result = await QuotationService.listQuotations(query);
      res.json({
        success: true,
        data: result.data,
        pagination: result.pagination,
      });
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const quotation = await QuotationService.getQuotationById(req.params.id);
      sendSuccess(res, quotation);
    } catch (err) {
      next(err);
    }
  }

  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await resolveUser(req);
      const body = createQuotationSchema.parse(req.body);
      const quotation = await QuotationService.createQuotation(body, user.id);
      sendCreated(res, quotation, 'Quotation created successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await resolveUser(req);
      const body = updateQuotationSchema.parse(req.body);
      const quotation = await QuotationService.updateQuotation(req.params.id, body, user.id);
      sendSuccess(res, quotation, 'Quotation updated successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await QuotationService.deleteQuotation(req.params.id);
      sendSuccess(res, null, 'Quotation deleted successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async recalculate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = createQuotationSchema.parse(req.body);
      const result = await QuotationService.recalculateDraft(body);
      sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  public static async submit(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await resolveUser(req);
      const quotation = await QuotationService.submitQuotation(req.params.id, user);
      sendSuccess(
        res,
        quotation,
        quotation.status === 'APPROVED'
          ? 'Quotation auto-approved within standard sales limit'
          : 'Quotation submitted for management approval'
      );
    } catch (err) {
      next(err);
    }
  }
}
