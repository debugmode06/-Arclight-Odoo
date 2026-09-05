import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';
import { sendSuccess } from '../../../shared';

export class AdminController {
  public static async getUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const users = await AdminService.getUsers();
      sendSuccess(res, users);
    } catch (err) {
      next(err);
    }
  }

  public static async getCustomers(_req: Request, res: Response, next: NextFunction) {
    try {
      const customers = await AdminService.getCustomers();
      sendSuccess(res, customers);
    } catch (err) {
      next(err);
    }
  }

  public static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await AdminService.getCategories();
      sendSuccess(res, categories);
    } catch (err) {
      next(err);
    }
  }

  public static async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await AdminService.createCategory(req.body);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      next(err);
    }
  }

  public static async getProducts(_req: Request, res: Response, next: NextFunction) {
    try {
      const products = await AdminService.getProducts();
      sendSuccess(res, products);
    } catch (err) {
      next(err);
    }
  }

  public static async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await AdminService.createProduct(req.body);
      res.status(201).json({ success: true, data: product });
    } catch (err) {
      next(err);
    }
  }

  public static async getDiscountRules(_req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await AdminService.getDiscountRules();
      sendSuccess(res, rules);
    } catch (err) {
      next(err);
    }
  }

  public static async createDiscountRule(req: Request, res: Response, next: NextFunction) {
    try {
      const rule = await AdminService.createDiscountRule(req.body);
      res.status(201).json({ success: true, data: rule });
    } catch (err) {
      next(err);
    }
  }

  public static async getApprovalRules(_req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await AdminService.getApprovalRules();
      sendSuccess(res, rules);
    } catch (err) {
      next(err);
    }
  }

  public static async createApprovalRule(req: Request, res: Response, next: NextFunction) {
    try {
      const rule = await AdminService.createApprovalRule(req.body);
      res.status(201).json({ success: true, data: rule });
    } catch (err) {
      next(err);
    }
  }

  public static async getWarehouses(_req: Request, res: Response, next: NextFunction) {
    try {
      const warehouses = await AdminService.getWarehouses();
      sendSuccess(res, warehouses);
    } catch (err) {
      next(err);
    }
  }

  public static async createWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const warehouse = await AdminService.createWarehouse(req.body);
      res.status(201).json({ success: true, data: warehouse });
    } catch (err) {
      next(err);
    }
  }

  public static async getInventory(_req: Request, res: Response, next: NextFunction) {
    try {
      const inventory = await AdminService.getInventory();
      sendSuccess(res, inventory);
    } catch (err) {
      next(err);
    }
  }

  public static async updateInventoryStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { warehouseId, productId, availableQuantity } = req.body;
      const inv = await AdminService.updateInventoryStock(warehouseId, productId, Number(availableQuantity));
      sendSuccess(res, inv, 'Inventory stock updated');
    } catch (err) {
      next(err);
    }
  }

  public static async getSubscriptionPlans(_req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await AdminService.getSubscriptionPlans();
      sendSuccess(res, plans);
    } catch (err) {
      next(err);
    }
  }

  public static async createSubscriptionPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await AdminService.createSubscriptionPlan(req.body);
      res.status(201).json({ success: true, data: plan });
    } catch (err) {
      next(err);
    }
  }
}
