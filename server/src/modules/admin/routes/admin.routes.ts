import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

export const adminRouter = Router();

// Users & Customers
adminRouter.get('/users', AdminController.getUsers);
adminRouter.get('/customers', AdminController.getCustomers);

// Categories
adminRouter.get('/categories', AdminController.getCategories);
adminRouter.post('/categories', AdminController.createCategory);

// Products
adminRouter.get('/products', AdminController.getProducts);
adminRouter.post('/products', AdminController.createProduct);

// Discount Governance Rules
adminRouter.get('/discount-rules', AdminController.getDiscountRules);
adminRouter.post('/discount-rules', AdminController.createDiscountRule);

// Approval Rules
adminRouter.get('/approval-rules', AdminController.getApprovalRules);
adminRouter.post('/approval-rules', AdminController.createApprovalRule);

// Warehouses
adminRouter.get('/warehouses', AdminController.getWarehouses);
adminRouter.post('/warehouses', AdminController.createWarehouse);

// Inventory
adminRouter.get('/inventory', AdminController.getInventory);
adminRouter.post('/inventory/update-stock', AdminController.updateInventoryStock);

// Subscription Plans
adminRouter.get('/subscription-plans', AdminController.getSubscriptionPlans);
adminRouter.post('/subscription-plans', AdminController.createSubscriptionPlan);
