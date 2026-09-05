import { Router, Request, Response, NextFunction } from 'express';
import { QuotationController } from '../controllers/quotation.controller';
import { Customer } from '../../admin/models/customer.model';
import { Product } from '../../admin/models/product.model';
import { sendSuccess } from '../../../shared';

export const quotationsRouter = Router();

// Metadata helpers for Quotation Builder (Customer & Product pickers)
quotationsRouter.get('/meta/customers', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await Customer.find({ isActive: true }).sort({ name: 1 }).lean();
    sendSuccess(res, customers);
  } catch (err) {
    next(err);
  }
});

quotationsRouter.get('/meta/products', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ isActive: true }).populate('categoryId').sort({ name: 1 }).lean();
    sendSuccess(res, products);
  } catch (err) {
    next(err);
  }
});

// Live calculation preview endpoint (pre-save calculation)
quotationsRouter.post('/recalculate', QuotationController.recalculate);

// Standard Quotations CRUD
quotationsRouter.get('/', QuotationController.list);
quotationsRouter.post('/', QuotationController.create);
quotationsRouter.get('/:id', QuotationController.getById);
quotationsRouter.put('/:id', QuotationController.update);
quotationsRouter.delete('/:id', QuotationController.delete);
quotationsRouter.post('/:id/submit', QuotationController.submit);
