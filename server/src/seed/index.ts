import bcrypt from 'bcryptjs';
import { connectDatabase, disconnectDatabase } from '../config/database.config';
import { validateEnv } from '../config/env.config';
import { logger } from '../shared/utils/logger';
import { User } from '../modules/auth/models/user.model';
import { Customer } from '../modules/admin/models/customer.model';
import { Category } from '../modules/admin/models/category.model';
import { Product } from '../modules/admin/models/product.model';
import { DiscountRule } from '../modules/admin/models/discount-rule.model';
import { Warehouse } from '../modules/admin/models/warehouse.model';
import { Inventory } from '../modules/admin/models/inventory.model';
import { SubscriptionPlan } from '../modules/admin/models/subscription-plan.model';
import { ApprovalRule } from '../modules/admin/models/approval-rule.model';
import { Quotation } from '../modules/quotations/models/quotation.model';
import { ApprovalRequest } from '../modules/approvals/models/approval-request.model';
import { ApprovalAction } from '../modules/approvals/models/approval-action.model';
import { Fulfillment } from '../modules/fulfillment/models/fulfillment.model';
import { Backorder } from '../modules/fulfillment/models/backorder.model';
import { Invoice } from '../modules/billing/models/invoice.model';
import { Subscription } from '../modules/billing/models/subscription.model';
import { BillingSchedule } from '../modules/billing/models/billing-schedule.model';
import { Payment } from '../modules/billing/models/payment.model';
import { Negotiation } from '../modules/portal/models/negotiation.model';
import { DealHealthAlert } from '../modules/analytics/models/deal-health.model';
import { DealTwinSimulation } from '../modules/dealTwin/models/deal-twin.model';

import { QuotationService } from '../modules/quotations/services/quotation.service';
import { ApprovalService } from '../modules/approvals/services/approval.service';
import { FulfillmentService } from '../modules/fulfillment/services/fulfillment.service';
import { BillingService } from '../modules/billing/services/billing.service';
import { UserRole, CustomerTier, QuotationStatus } from '../shared';

async function seed(): Promise<void> {
  validateEnv();
  await connectDatabase();

  logger.info('Seed', 'Clearing existing demo data across all modules...');
  await Promise.all([
    User.deleteMany({}),
    Customer.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    DiscountRule.deleteMany({}),
    ApprovalRule.deleteMany({}),
    Warehouse.deleteMany({}),
    Inventory.deleteMany({}),
    SubscriptionPlan.deleteMany({}),
    Quotation.deleteMany({}),
    ApprovalRequest.deleteMany({}),
    ApprovalAction.deleteMany({}),
    Fulfillment.deleteMany({}),
    Backorder.deleteMany({}),
    Invoice.deleteMany({}),
    Subscription.deleteMany({}),
    BillingSchedule.deleteMany({}),
    Payment.deleteMany({}),
    Negotiation.deleteMany({}),
    DealHealthAlert.deleteMany({}),
    DealTwinSimulation.deleteMany({}),
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. Customers
  // ─────────────────────────────────────────────────────────────────────────────
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. Users (Internal Roles + Customer Portal Users)
  // ─────────────────────────────────────────────────────────────────────────────
  logger.info('Seed', 'Seeding demo team users and customer portal accounts...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const [repUser, managerUser, financeUser, adminUser, acmeCustomerUser, novaCustomerUser] = await User.create([
    {
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.rep@dealflow360.com',
      password: hashedPassword,
      role: UserRole.SALES_REP,
      isActive: true,
    },
    {
      firstName: 'Sarah',
      lastName: 'Chen',
      email: 'sarah.manager@dealflow360.com',
      password: hashedPassword,
      role: UserRole.SALES_MANAGER,
      isActive: true,
    },
    {
      firstName: 'Marcus',
      lastName: 'Vance',
      email: 'marcus.finance@dealflow360.com',
      password: hashedPassword,
      role: UserRole.FINANCE,
      isActive: true,
    },
    {
      firstName: 'Admin',
      lastName: 'Director',
      email: 'admin@dealflow360.com',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
    },
    {
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'customer@acmeglobal.com',
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      customerId: acme._id,
      company: 'Acme Global Corporation',
      isActive: true,
    },
    {
      firstName: 'David',
      lastName: 'Kao',
      email: 'customer@novatech.io',
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      customerId: novaTech._id,
      company: 'NovaTech Systems Inc.',
      isActive: true,
    },
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. Categories & Products
  // ─────────────────────────────────────────────────────────────────────────────
  logger.info('Seed', 'Seeding product categories...');
  const [hwCat, cloudCat, svcCat, secCat] = await Category.create([
    { name: 'Enterprise Hardware', code: 'HW', targetMarginPercent: 28 },
    { name: 'Cloud Infrastructure', code: 'CLOUD', targetMarginPercent: 45 },
    { name: 'Professional Services', code: 'SVC', targetMarginPercent: 35 },
    { name: 'Cybersecurity Suite', code: 'SEC', targetMarginPercent: 50 },
  ]);

  logger.info('Seed', 'Seeding catalog products...');
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

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. Governance & Approval Chains
  // ─────────────────────────────────────────────────────────────────────────────
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

  logger.info('Seed', 'Seeding multi-tier approval rules...');
  await ApprovalRule.create([
    {
      name: 'Rep Standard Autonomy (0-8%)',
      minDiscount: 0,
      maxDiscount: 8,
      requiredRole: UserRole.SALES_REP,
      approvalOrder: 1,
      isActive: true,
    },
    {
      name: 'Manager Approval Required (8.01-15%)',
      minDiscount: 8.01,
      maxDiscount: 15,
      requiredRole: UserRole.SALES_MANAGER,
      approvalOrder: 1,
      isActive: true,
    },
    {
      name: 'Finance Executive Oversight (>15%)',
      minDiscount: 15.01,
      maxDiscount: 100,
      requiredRole: UserRole.FINANCE,
      approvalOrder: 2,
      isActive: true,
    },
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. Multi-Warehouse Fulfillment Infrastructure & Inventory
  // ─────────────────────────────────────────────────────────────────────────────
  logger.info('Seed', 'Seeding warehouses...');
  const [whA, whB, whC] = await Warehouse.create([
    {
      name: 'Austin Central Depot',
      code: 'WH-A',
      location: 'Austin, TX',
      capacity: 25000,
      shippingCostWeight: 1.0,
      isActive: true,
    },
    {
      name: 'Seattle Secondary Hub',
      code: 'WH-B',
      location: 'Seattle, WA',
      capacity: 15000,
      shippingCostWeight: 1.25,
      isActive: true,
    },
    {
      name: 'Chicago Distribution Node',
      code: 'WH-C',
      location: 'Chicago, IL',
      capacity: 10000,
      shippingCostWeight: 1.15,
      isActive: true,
    },
  ]);

  logger.info('Seed', 'Seeding multi-warehouse inventory (WH-A: 6, WH-B: 4 for OmniServer)...');
  await Inventory.create([
    // OmniServer X-9000: WH-A has 6, WH-B has 4 -> exactly fulfills 10 via 6+4 split!
    {
      warehouseId: whA._id,
      productId: omniServer._id,
      availableQuantity: 6,
      reservedQuantity: 0,
    },
    {
      warehouseId: whB._id,
      productId: omniServer._id,
      availableQuantity: 4,
      reservedQuantity: 0,
    },
    {
      warehouseId: whC._id,
      productId: omniServer._id,
      availableQuantity: 0,
      reservedQuantity: 0,
    },

    // EdgeRouter Multi-Gig
    {
      warehouseId: whA._id,
      productId: edgeRouter._id,
      availableQuantity: 18,
      reservedQuantity: 0,
    },
    {
      warehouseId: whB._id,
      productId: edgeRouter._id,
      availableQuantity: 12,
      reservedQuantity: 0,
    },
    {
      warehouseId: whC._id,
      productId: edgeRouter._id,
      availableQuantity: 8,
      reservedQuantity: 0,
    },

    // Software & Virtual Services (High availability stock)
    {
      warehouseId: whA._id,
      productId: cloudCore._id,
      availableQuantity: 999,
      reservedQuantity: 0,
    },
    {
      warehouseId: whA._id,
      productId: cloudStorage._id,
      availableQuantity: 999,
      reservedQuantity: 0,
    },
    {
      warehouseId: whA._id,
      productId: archServices._id,
      availableQuantity: 999,
      reservedQuantity: 0,
    },
    {
      warehouseId: whA._id,
      productId: socSec._id,
      availableQuantity: 999,
      reservedQuantity: 0,
    },
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. Subscription Plans
  // ─────────────────────────────────────────────────────────────────────────────
  logger.info('Seed', 'Seeding recurring subscription plans...');
  await SubscriptionPlan.create([
    {
      name: 'Cloud Core Platform (Monthly)',
      code: 'SUB-CLOUD-M',
      billingCycle: 'MONTHLY',
      basePrice: 4800,
      description: 'Standard multi-tenant cloud orchestration platform with automated proration',
      prorationRule: 'DAILY_PRO_RATA',
      cancellationRefundWindowDays: 30,
      isActive: true,
    },
    {
      name: 'Managed Threat Hunting & SOC (Annual)',
      code: 'SUB-SOC-A',
      billingCycle: 'YEARLY',
      basePrice: 18000,
      description: '24/7 dedicated enterprise security monitoring and incident response team',
      prorationRule: 'DAILY_PRO_RATA',
      cancellationRefundWindowDays: 14,
      isActive: true,
    },
    {
      name: 'Enterprise Advanced Analytics Tier',
      code: 'SUB-ANALYTICS-Q',
      billingCycle: 'QUARTERLY',
      basePrice: 7500,
      description: 'Quarterly continuous pipeline health and DealTwin what-if simulations',
      prorationRule: 'DAILY_PRO_RATA',
      cancellationRefundWindowDays: 30,
      isActive: true,
    },
  ]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. Quotations & Approval Workflows
  // ─────────────────────────────────────────────────────────────────────────────
  logger.info('Seed', 'Seeding demo quotations and approval workflows...');

  // Quote 1: Safe Quotation (Draft, within rep limits)
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

  // Quote 2: Medium-Risk Quotation (Pending Manager Step)
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

  // Quote 3: High-Risk Quotation (Pending Manager + Finance Chain)
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

  // Quote 4: Fully Approved Quotation
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

  // Quote 5: Confirmed Order with Multi-Warehouse Split (WH-A: 6, WH-B: 4)
  logger.info('Seed', 'Seeding multi-warehouse split quotation (10 OmniServers)...');
  const whQuote = await QuotationService.createQuotation(
    {
      customerId: acme._id.toString(),
      currency: 'USD',
      notes: 'Global Compute Cluster deployment. Exactly 10 OmniServer X-9000 units.',
      lines: [
        {
          productId: omniServer._id.toString(),
          quantity: 10,
          unitPrice: 12500,
          discountPercent: 5,
        },
      ],
    },
    repUser._id.toString()
  );
  // Transition to APPROVED/WON so fulfillment can take place
  whQuote.status = QuotationStatus.WON;
  await whQuote.save();

  // Execute Auto-Split: 6 to WH-A, 4 to WH-B
  logger.info('Seed', 'Allocating stock across warehouses (WH-A: 6, WH-B: 4)...');
  await FulfillmentService.allocateStock(whQuote._id.toString());

  // Generate Invoicing & Partial Payment
  logger.info('Seed', 'Generating billing and recording payment for split order...');
  const billingResult = await BillingService.generateBillingForQuotation(whQuote._id.toString());
  if (billingResult.invoice) {
    await BillingService.recordPayment(billingResult.invoice._id.toString(), {
      amount: 50000,
      paymentMethod: 'WIRE',
      transactionReference: 'WIRE-ACME-884912',
      notes: 'Initial 40% milestone wire transfer received.',
    });
  }

  // Quote 6: Hybrid Hardware + Recurring Subscription Contract
  logger.info('Seed', 'Seeding hybrid hardware + SaaS quotation...');
  const hybridQuote = await QuotationService.createQuotation(
    {
      customerId: novaTech._id.toString(),
      currency: 'USD',
      notes: 'Perimeter hardware security plus annual continuous threat hunting managed SOC.',
      lines: [
        {
          productId: edgeRouter._id.toString(),
          quantity: 2,
          unitPrice: 3200,
          discountPercent: 6,
        },
        {
          productId: socSec._id.toString(),
          quantity: 1,
          unitPrice: 18000,
          discountPercent: 8,
        },
      ],
    },
    repUser._id.toString()
  );
  hybridQuote.status = QuotationStatus.WON;
  await hybridQuote.save();

  // Generate Hybrid Billing (Invoices + Active Subscription + 3-month schedule)
  await BillingService.generateBillingForQuotation(hybridQuote._id.toString());

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. Deal Health Alerts & AI DealTwin Simulations
  // ─────────────────────────────────────────────────────────────────────────────
  logger.info('Seed', 'Seeding deal health alerts & DealTwin simulations...');
  await DealHealthAlert.create([
    {
      quotationId: medQuote._id,
      alertType: 'STALLED_DEAL',
      severity: 'MEDIUM',
      title: 'Awaiting Manager Review > 6 Days',
      description: `Quotation ${medQuote.quotationNumber} has been awaiting sales manager review for 6 days.`,
      suggestedAction: 'Send automated reminder nudge to Sales Manager Sarah Chen.',
      status: 'OPEN',
    },
    {
      quotationId: highQuote._id,
      alertType: 'DISCOUNT_ANOMALY',
      severity: 'HIGH',
      title: 'Discount Anomaly: 18% Requested',
      description: `Quotation ${highQuote.quotationNumber} requests 18% discount, exceeding the portfolio average (8.2%) by 2.2x.`,
      suggestedAction: 'Simulate margin sensitivity on DealTwin before final finance sign-off.',
      status: 'OPEN',
    },
  ]);

  await DealTwinSimulation.create({
    quotationId: highQuote._id,
    discountTweakPercent: 12,
    volumeMultiplier: 1.0,
    paymentTerms: 'Net 30',
    projectedRevenue: highQuote.grandTotal * 1.05,
    projectedMarginPercent: 33.2,
    winProbabilityPercent: 74,
    governancePrediction: 'Requires Sales Manager Approval Only',
    bestPathRecommendation: 'Reduces approval turnaround time by 3 days while protecting 33% gross margins.',
    simulatedBy: repUser._id,
  });

  logger.info(
    'Seed',
    `Database successfully seeded!
   ✓ 6 Users (Rep, Manager, Finance, Admin + 2 Customer Portal accounts)
   ✓ 4 Customer Accounts (Platinum, Gold, Silver, Standard)
   ✓ 4 Categories & 6 Products
   ✓ 4 Discount Governance Rules & 3 Approval Rules
   ✓ 3 Warehouses (WH-A, WH-B, WH-C) & Multi-Depot Inventory (6+4 split verified)
   ✓ 3 Subscription Plans (Monthly, Yearly, Quarterly)
   ✓ 6 Quotations (Safe, Medium, High Risk, Approved, WH Split Won, Hybrid Won)
   ✓ 1 Multi-Warehouse Fulfillment Allocation (6 Austin, 4 Seattle)
   ✓ Hybrid Invoices, Active Subscriptions & 3-Month Billing Schedules
   ✓ Active Deal Health Alerts & DealTwin AI Simulations`
  );

  await disconnectDatabase();
}

seed().catch((err) => {
  console.error('Seed execution failed:', err);
  process.exit(1);
});
