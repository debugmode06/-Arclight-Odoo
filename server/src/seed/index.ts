import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.config';
import { validateEnv } from '../config/env.config';
import { logger } from '../shared/utils/logger';
import { User, hashPassword } from '../modules/auth/models/user.model';
import { Customer } from '../modules/admin/models/customer.model';
import { Category } from '../modules/admin/models/category.model';
import { Product } from '../modules/admin/models/product.model';
import { DiscountRule } from '../modules/admin/models/discount-rule.model';
import { Quotation } from '../modules/quotations/models/quotation.model';
import { ApprovalRequest } from '../modules/approvals/models/approval-request.model';
import { ApprovalAction } from '../modules/approvals/models/approval-action.model';
import { QuotationService } from '../modules/quotations/services/quotation.service';
import { ApprovalService } from '../modules/approvals/services/approval.service';
import { UserRole, CustomerTier } from '../shared';
import { seedFulfillmentData } from './fulfillment.seed';

export async function seedDemoUsers(): Promise<void> {
  return seed();
}

export async function seed(): Promise<void> {
  validateEnv();
  await connectDatabase();

  logger.info('Seed', 'Clearing existing demo data...');
  await Promise.all([
    User.deleteMany({}),
    Customer.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    DiscountRule.deleteMany({}),
    Quotation.deleteMany({}),
    ApprovalRequest.deleteMany({}),
    ApprovalAction.deleteMany({}),
  ]);

  logger.info('Seed', 'Seeding demo team users...');
  const hashedPassword = await hashPassword('Password123!');
  const legacyHashedPassword = await bcrypt.hash('password123', 10);

  const [repUser, managerUser, financeUser, adminUser] = await User.create([
    {
      name: 'Sales Representative',
      firstName: 'Sales',
      lastName: 'Representative',
      email: 'sales@dealflow360.com',
      passwordHash: hashedPassword,
      password: hashedPassword,
      role: UserRole.SALES_REP,
      isActive: true,
    },
    {
      name: 'Sales Manager',
      firstName: 'Sales',
      lastName: 'Manager',
      email: 'manager@dealflow360.com',
      passwordHash: hashedPassword,
      password: hashedPassword,
      role: UserRole.SALES_MANAGER,
      isActive: true,
    },
    {
      name: 'Finance Officer',
      firstName: 'Finance',
      lastName: 'Officer',
      email: 'finance@dealflow360.com',
      passwordHash: hashedPassword,
      password: hashedPassword,
      role: UserRole.FINANCE,
      isActive: true,
    },
    {
      name: 'System Admin',
      firstName: 'System',
      lastName: 'Admin',
      email: 'admin@dealflow360.com',
      passwordHash: hashedPassword,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      name: 'Alex Morgan',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.rep@dealflow360.com',
      passwordHash: legacyHashedPassword,
      password: legacyHashedPassword,
      role: UserRole.SALES_REP,
      isActive: true,
    },
    {
      name: 'Sarah Chen',
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.manager@dealflow360.com',
      passwordHash: legacyHashedPassword,
      password: legacyHashedPassword,
      role: UserRole.SALES_MANAGER,
      isActive: true,
    },
    {
      name: 'Marcus Vance',
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.finance@dealflow360.com',
      passwordHash: legacyHashedPassword,
      password: legacyHashedPassword,
      role: UserRole.FINANCE,
      isActive: true,
    },
  ]);

  logger.info('Seed', 'Seeding categories...');
  const [hwCat, cloudCat, svcCat, secCat] = await Category.create([
    { name: 'Enterprise Hardware', code: 'HW', targetMarginPercent: 28 },
    { name: 'Cloud Infrastructure', code: 'CLOUD', targetMarginPercent: 45 },
    { name: 'Professional Services', code: 'SVC', targetMarginPercent: 35 },
    { name: 'Cybersecurity Suite', code: 'SEC', targetMarginPercent: 50 },
  ]);

  logger.info('Seed', 'Seeding products...');
  const [omniServer, edgeRouter, cloudCore, cloudStorage, archServices, socSec] = await Product.create([
    {
      name: 'OmniServer X-9000 Enterprise Rack',
      sku: 'HW-SRV-9000',
      categoryId: hwCat._id,
      basePrice: 12500,
      costPrice: 9000,
      unit: 'rack',
      description: 'High-density 4U compute node for virtualization & AI models',
    },
    {
      name: 'EdgeRouter Multi-Gig Enterprise',
      sku: 'HW-RTR-500',
      categoryId: hwCat._id,
      basePrice: 3200,
      costPrice: 2200,
      unit: 'unit',
      description: '10Gbps managed perimeter gateway with hardware encryption',
    },
    {
      name: 'Cloud Core Platform (Annual License)',
      sku: 'CLD-LIC-01',
      categoryId: cloudCat._id,
      basePrice: 24000,
      costPrice: 8000,
      unit: 'license',
      description: 'Multi-tenant control plane subscription with 99.99% SLA',
    },
    {
      name: 'Distributed Cloud Storage 10TB',
      sku: 'CLD-STR-10',
      categoryId: cloudCat._id,
      basePrice: 4800,
      costPrice: 1800,
      unit: 'tenant',
      description: 'High-availability encrypted object storage tier',
    },
    {
      name: 'Strategic Architecture Implementation',
      sku: 'SVC-ENG-01',
      categoryId: svcCat._id,
      basePrice: 15000,
      costPrice: 8500,
      unit: 'package',
      description: 'Dedicated professional services engineering onboarding',
    },
    {
      name: 'Managed Threat Hunting & SOC (Annual)',
      sku: 'SEC-SOC-12',
      categoryId: secCat._id,
      basePrice: 18000,
      costPrice: 7200,
      unit: 'subscription',
      description: '24/7 continuous incident response & SIEM oversight',
    },
  ]);

  logger.info('Seed', 'Seeding customers with commercial tiers...');
  const [acme, novaTech, vertex, starlight] = await Customer.create([
    {
      name: 'Acme Global Dynamics',
      email: 'procurement@acmeglobal.com',
      company: 'Acme Global Corporation',
      tier: CustomerTier.PLATINUM,
      phone: '+1 415-555-0199',
      isActive: true,
    },
    {
      name: 'NovaTech Systems Inc.',
      email: 'orders@novatech.io',
      company: 'NovaTech Systems',
      tier: CustomerTier.GOLD,
      phone: '+1 212-555-0144',
      isActive: true,
    },
    {
      name: 'Vertex BioHealth Research',
      email: 'it@vertexbiohealth.org',
      company: 'Vertex BioHealth Labs',
      tier: CustomerTier.SILVER,
      phone: '+1 617-555-0182',
      isActive: true,
    },
    {
      name: 'Starlight Retailers',
      email: 'tech@starlightretail.com',
      company: 'Starlight Retail Group',
      tier: CustomerTier.STANDARD,
      phone: '+1 312-555-0120',
      isActive: true,
    },
  ]);

  logger.info('Seed', 'Seeding discount governance rules...');
  await DiscountRule.create([
    {
      name: 'Platinum Tier Commercial Ceiling',
      priority: 3,
      customerTier: CustomerTier.PLATINUM,
      maxAllowedDiscount: 35,
      approvalThresholdDiscount: 15,
      minMarginPercent: 18,
      isActive: true,
    },
    {
      name: 'Gold Tier Commercial Ceiling',
      priority: 4,
      customerTier: CustomerTier.GOLD,
      maxAllowedDiscount: 25,
      approvalThresholdDiscount: 12,
      minMarginPercent: 20,
      isActive: true,
    },
    {
      name: 'Hardware Margins Guardrail',
      priority: 6,
      categoryId: hwCat._id,
      maxAllowedDiscount: 20,
      approvalThresholdDiscount: 8,
      minMarginPercent: 15,
      isActive: true,
    },
    {
      name: 'Cloud Services Standard Ceiling',
      priority: 6,
      categoryId: cloudCat._id,
      maxAllowedDiscount: 30,
      approvalThresholdDiscount: 15,
      minMarginPercent: 25,
      isActive: true,
    },
  ]);

  logger.info('Seed', 'Seeding demo quotations & approval workflows...');

  // 1. Safe Quotation (Within Standard Limits - Draft)
  const safeQuote = await QuotationService.createQuotation(
    {
      customerId: vertex._id.toString(),
      currency: 'USD',
      notes: 'Standard branch office upgrade package for Vertex labs.',
      lines: [
        {
          productId: edgeRouter._id.toString(),
          quantity: 2,
          unitPrice: 3200,
          discountPercent: 5,
        },
      ],
    },
    repUser._id.toString()
  );

  // 2. Medium-Risk Quotation (Pending Approval - Manager Step)
  const medQuote = await QuotationService.createQuotation(
    {
      customerId: novaTech._id.toString(),
      currency: 'USD',
      notes: 'Competitive cloud displacement deal. Requested 14% discount to secure annual commitment.',
      lines: [
        {
          productId: cloudCore._id.toString(),
          quantity: 2,
          unitPrice: 24000,
          discountPercent: 14,
        },
        {
          productId: cloudStorage._id.toString(),
          quantity: 3,
          unitPrice: 4800,
          discountPercent: 10,
        },
      ],
    },
    repUser._id.toString()
  );
  await QuotationService.submitQuotation(medQuote._id.toString(), {
    id: repUser._id.toString(),
    role: UserRole.SALES_REP,
  });

  // 3. High-Risk Quotation (Pending Approval - Manager + Finance Chain)
  const highQuote = await QuotationService.createQuotation(
    {
      customerId: acme._id.toString(),
      currency: 'USD',
      notes: 'Major global data center infrastructure contract. Requires dual management sign-off.',
      lines: [
        {
          productId: omniServer._id.toString(),
          quantity: 4,
          unitPrice: 12500,
          discountPercent: 18,
        },
        {
          productId: socSec._id.toString(),
          quantity: 2,
          unitPrice: 18000,
          discountPercent: 18,
        },
      ],
    },
    repUser._id.toString()
  );
  await QuotationService.submitQuotation(highQuote._id.toString(), {
    id: repUser._id.toString(),
    role: UserRole.SALES_REP,
  });

  // 4. Fully Approved Quotation with Action History
  const approvedQuote = await QuotationService.createQuotation(
    {
      customerId: starlight._id.toString(),
      currency: 'USD',
      notes: 'Enterprise architecture kickoff phase.',
      lines: [
        {
          productId: archServices._id.toString(),
          quantity: 1,
          unitPrice: 15000,
          discountPercent: 10,
        },
      ],
    },
    repUser._id.toString()
  );
  const submittedAppQuote = await QuotationService.submitQuotation(approvedQuote._id.toString(), {
    id: repUser._id.toString(),
    role: UserRole.SALES_REP,
  });

  if (submittedAppQuote.currentApprovalRequestId) {
    await ApprovalService.approve(
      submittedAppQuote.currentApprovalRequestId.toString(),
      { id: managerUser._id.toString(), role: UserRole.SALES_MANAGER },
      'Reviewed strategic value. Margin profile meets quarterly growth threshold. Approved.'
    );
  }

  // Member 3 Fulfillment data seed
  try {
    await seedFulfillmentData();
  } catch (fErr) {
    logger.warn('Seed', 'Fulfillment seed warning:', fErr);
  }

  logger.info(
    'Seed',
    `Database successfully seeded!
   - Team Users (Rep, Manager, Finance, Admin)
   - 4 Customer Accounts (Platinum, Gold, Silver, Standard)
   - 4 Categories & 6 Products
   - 4 Discount Governance Rules
   - 4 Demo Quotations (Safe Draft, Medium Risk, High Risk, Approved)
   - Multi-Warehouse Fulfillment & Stock Allocations`
  );
}

if (process.argv[1] && process.argv[1].includes('seed')) {
  seed()
    .then(() => disconnectDatabase())
    .catch((err) => {
      console.error('Seed execution failed:', err);
      process.exit(1);
    });
}
