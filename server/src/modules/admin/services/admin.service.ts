import { User } from '../../auth/models/user.model';
import { Customer } from '../models/customer.model';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { DiscountRule } from '../models/discount-rule.model';
import { ApprovalRule } from '../models/approval-rule.model';
import { Warehouse } from '../models/warehouse.model';
import { Inventory } from '../models/inventory.model';
import { SubscriptionPlan } from '../models/subscription-plan.model';

export class AdminService {
  // ─── Users ────────────────────────────────────────────────────────────────
  public static async getUsers() {
    return User.find().select('-password').sort({ createdAt: -1 });
  }

  // ─── Customers ────────────────────────────────────────────────────────────
  public static async getCustomers() {
    return Customer.find().sort({ name: 1 });
  }

  // ─── Categories ───────────────────────────────────────────────────────────
  public static async getCategories() {
    return Category.find().sort({ name: 1 });
  }

  public static async createCategory(data: any) {
    return Category.create(data);
  }

  public static async updateCategory(id: string, data: any) {
    return Category.findByIdAndUpdate(id, data, { new: true });
  }

  // ─── Products ─────────────────────────────────────────────────────────────
  public static async getProducts() {
    return Product.find().populate('categoryId').sort({ name: 1 });
  }

  public static async createProduct(data: any) {
    return Product.create(data);
  }

  public static async updateProduct(id: string, data: any) {
    return Product.findByIdAndUpdate(id, data, { new: true });
  }

  // ─── Discount Rules ───────────────────────────────────────────────────────
  public static async getDiscountRules() {
    return DiscountRule.find().populate('categoryId').sort({ priority: 1, createdAt: -1 });
  }

  public static async createDiscountRule(data: any) {
    return DiscountRule.create(data);
  }

  public static async updateDiscountRule(id: string, data: any) {
    return DiscountRule.findByIdAndUpdate(id, data, { new: true });
  }

  // ─── Approval Rules ───────────────────────────────────────────────────────
  public static async getApprovalRules() {
    return ApprovalRule.find().sort({ approvalOrder: 1 });
  }

  public static async createApprovalRule(data: any) {
    return ApprovalRule.create(data);
  }

  public static async updateApprovalRule(id: string, data: any) {
    return ApprovalRule.findByIdAndUpdate(id, data, { new: true });
  }

  // ─── Warehouses ───────────────────────────────────────────────────────────
  public static async getWarehouses() {
    return Warehouse.find().sort({ code: 1 });
  }

  public static async createWarehouse(data: any) {
    return Warehouse.create(data);
  }

  public static async updateWarehouse(id: string, data: any) {
    return Warehouse.findByIdAndUpdate(id, data, { new: true });
  }

  // ─── Inventory ────────────────────────────────────────────────────────────
  public static async getInventory() {
    return Inventory.find()
      .populate('warehouseId')
      .populate({ path: 'productId', populate: { path: 'categoryId' } })
      .sort({ warehouseId: 1 });
  }

  public static async updateInventoryStock(warehouseId: string, productId: string, availableQuantity: number) {
    return Inventory.findOneAndUpdate(
      { warehouseId, productId },
      { $set: { availableQuantity } },
      { new: true, upsert: true }
    );
  }

  // ─── Subscription Plans ───────────────────────────────────────────────────
  public static async getSubscriptionPlans() {
    return SubscriptionPlan.find().sort({ basePrice: 1 });
  }

  public static async createSubscriptionPlan(data: any) {
    return SubscriptionPlan.create(data);
  }

  public static async updateSubscriptionPlan(id: string, data: any) {
    return SubscriptionPlan.findByIdAndUpdate(id, data, { new: true });
  }
}
