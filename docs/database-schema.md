# DealFlow360 — Database Schema

---

## Overview

**Single MongoDB database** shared by all modules. Every module that needs to reference another module's data uses MongoDB `ObjectId` references — no data duplication.

Connection: `MONGODB_URI` (set in `.env`)
ORM: Mongoose

---

## Entity Ownership

Each Mongoose model lives in exactly ONE module's `models/` directory. No model is defined twice.

| Entity | Module Owner | File Location |
|--------|-------------|---------------|
| `User` | auth | `server/src/modules/auth/models/user.model.ts` |
| `Customer` | admin | `server/src/modules/admin/models/customer.model.ts` |
| `Product` | admin | `server/src/modules/admin/models/product.model.ts` |
| `Category` | admin | `server/src/modules/admin/models/category.model.ts` |
| `PriceList` | admin | `server/src/modules/admin/models/price-list.model.ts` |
| `DiscountRule` | admin | `server/src/modules/admin/models/discount-rule.model.ts` |
| `ApprovalRule` | admin | `server/src/modules/admin/models/approval-rule.model.ts` |
| `Quotation` | quotations | `server/src/modules/quotations/models/quotation.model.ts` |
| `QuotationLine` | quotations | `server/src/modules/quotations/models/quotation-line.model.ts` |
| `ApprovalRequest` | approvals | `server/src/modules/approvals/models/approval-request.model.ts` |
| `ApprovalAction` | approvals | `server/src/modules/approvals/models/approval-action.model.ts` |
| `DealTwinSimulation` | dealTwin | `server/src/modules/dealTwin/models/deal-twin-simulation.model.ts` |
| `Warehouse` | fulfillment | `server/src/modules/fulfillment/models/warehouse.model.ts` |
| `Inventory` | fulfillment | `server/src/modules/fulfillment/models/inventory.model.ts` |
| `Fulfillment` | fulfillment | `server/src/modules/fulfillment/models/fulfillment.model.ts` |
| `SubscriptionPlan` | billing | `server/src/modules/billing/models/subscription-plan.model.ts` |
| `Subscription` | billing | `server/src/modules/billing/models/subscription.model.ts` |
| `BillingSchedule` | billing | `server/src/modules/billing/models/billing-schedule.model.ts` |
| `Invoice` | billing | `server/src/modules/billing/models/invoice.model.ts` |
| `Payment` | billing | `server/src/modules/billing/models/payment.model.ts` |
| `CreditNote` | billing | `server/src/modules/billing/models/credit-note.model.ts` |
| `Negotiation` | portal | `server/src/modules/portal/models/negotiation.model.ts` |
| `DealHealthAlert` | analytics | `server/src/modules/analytics/models/deal-health-alert.model.ts` |
| `AuditLog` | shared | `server/src/shared/models/audit-log.model.ts` |

---

## Entity Relationship Overview

```
User ──────────────────────── (internal users: reps, managers, finance, admin)
Customer ──────────────────── (customers who receive quotations)

Quotation (CENTRAL ENTITY)
  ├── customerId → Customer
  ├── createdBy → User
  ├── QuotationLine[] (embedded or referenced)
  │     ├── productId → Product
  │     └── priceListId → PriceList
  │
  ├── ApprovalRequest
  │     ├── requestedBy → User
  │     └── ApprovalAction[]
  │           └── actionBy → User
  │
  ├── DealTwinSimulation[]
  │     └── createdBy → User
  │
  ├── Fulfillment
  │     └── Warehouse → Inventory
  │
  ├── Subscription (if recurring)
  │     ├── SubscriptionPlan
  │     └── BillingSchedule[]
  │
  ├── Invoice[]
  │     └── Payment[]
  │
  └── Negotiation (from customer portal)
        └── customerId → Customer
```

---

## Key Entity Schemas (Planned)

> ⚠️ These are architectural previews only. Actual Zod/Mongoose schemas will be implemented by each module owner.

### User
```typescript
{
  _id: ObjectId,
  email: string,          // unique
  password: string,       // hashed with bcrypt
  firstName: string,
  lastName: string,
  role: UserRole,         // SUPER_ADMIN | ADMIN | SALES_MANAGER | SALES_REP | FINANCE | WAREHOUSE
  isActive: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Customer
```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  phone: string,
  company: string,
  tier: CustomerTier,     // STANDARD | SILVER | GOLD | PLATINUM
  priceListId: ObjectId,  // → PriceList
  portalAccessEnabled: boolean,
  portalPassword: string, // hashed
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```typescript
{
  _id: ObjectId,
  name: string,
  sku: string,            // unique
  categoryId: ObjectId,   // → Category
  basePrice: number,
  unit: string,
  isActive: boolean,
  description: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Quotation
```typescript
{
  _id: ObjectId,
  quotationNumber: string, // auto-generated, unique
  customerId: ObjectId,    // → Customer
  createdBy: ObjectId,     // → User
  assignedTo: ObjectId,    // → User
  status: QuotationStatus, // DRAFT | PENDING_APPROVAL | APPROVED | REJECTED | WON | LOST
  validUntil: Date,
  subtotal: number,
  discountAmount: number,
  taxAmount: number,
  total: number,
  margin: number,
  currency: string,
  notes: string,
  createdAt: Date,
  updatedAt: Date
}
```

### QuotationLine
```typescript
{
  _id: ObjectId,
  quotationId: ObjectId,  // → Quotation
  productId: ObjectId,    // → Product
  quantity: number,
  unitPrice: number,
  discountPercent: number,
  discountAmount: number,
  lineTotal: number,
  notes: string
}
```

### ApprovalRequest
```typescript
{
  _id: ObjectId,
  quotationId: ObjectId,  // → Quotation
  requestedBy: ObjectId,  // → User
  status: ApprovalStatus, // PENDING | MANAGER_APPROVED | FINANCE_APPROVED | APPROVED | REJECTED
  requiredApprovalSteps: ApprovalStep[],
  currentStep: number,
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice
```typescript
{
  _id: ObjectId,
  invoiceNumber: string,  // auto-generated, unique
  quotationId: ObjectId,  // → Quotation
  customerId: ObjectId,   // → Customer
  status: InvoiceStatus,  // DRAFT | SENT | PAID | OVERDUE | CANCELLED
  dueDate: Date,
  subtotal: number,
  taxAmount: number,
  total: number,
  paidAmount: number,
  balanceDue: number,
  createdAt: Date,
  updatedAt: Date
}
```

---

## Cross-Module Data Access Rules

| If module... | needs data from... | must... |
|---|---|---|
| quotations | admin (products) | Call `adminService.getProductById()` from server side |
| approvals | quotations | Reference `Quotation` model via `quotationId` ObjectId |
| billing | quotations | Reference `Quotation` model via `quotationId` ObjectId |
| fulfillment | admin (warehouses) | Use `Warehouse` model owned by fulfillment |
| analytics | all modules | Query models directly; analytics is a read-only consumer |
| portal | quotations | Reference `Quotation` model via `quotationId` ObjectId |

> **Rule**: Cross-module data access on the **server** is acceptable by importing models.
> Cross-module data access on the **client** goes through API calls only.
