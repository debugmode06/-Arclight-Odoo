# DealFlow360 — API Contracts

---

## Overview

All API routes follow this convention:
- Base URL (dev): `http://localhost:5000`
- All endpoints prefixed with `/api`
- Content-Type: `application/json`
- Auth: `Authorization: Bearer <accessToken>` (where required)

### Standard Response Shape

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "Human readable message",
    "details": {}
  }
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## API Namespaces & Ownership

| Namespace | Owner | Description |
|-----------|-------|-------------|
| `/api/auth/*` | Member 1 | Authentication, session management |
| `/api/admin/*` | Member 1 | Products, categories, config, users |
| `/api/quotations/*` | Member 2 | Quotation CRUD, line items, calculations |
| `/api/approvals/*` | Member 2 | Approval workflow and actions |
| `/api/deal-twin/*` | Member 2 | Simulations, risk, recommendations |
| `/api/fulfillment/*` | Member 3 | Warehouses, inventory, fulfillment |
| `/api/billing/*` | Member 3 | Subscriptions, invoices, payments |
| `/api/portal/*` | Member 4 | Customer-facing portal endpoints |
| `/api/analytics/*` | Member 4 | Dashboards, reporting, deal health |

---

## /api/auth — Member 1

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login with email + password |
| POST | `/api/auth/logout` | ✅ | Invalidate session |
| POST | `/api/auth/refresh` | ❌ | Refresh access token |
| GET | `/api/auth/me` | ✅ | Get current user profile |
| POST | `/api/auth/change-password` | ✅ | Change password |

---

## /api/admin — Member 1

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/users` | ✅ ADMIN | List all users |
| POST | `/api/admin/users` | ✅ ADMIN | Create user |
| PUT | `/api/admin/users/:id` | ✅ ADMIN | Update user |
| DELETE | `/api/admin/users/:id` | ✅ ADMIN | Delete user |
| GET | `/api/admin/products` | ✅ | List products |
| POST | `/api/admin/products` | ✅ ADMIN | Create product |
| PUT | `/api/admin/products/:id` | ✅ ADMIN | Update product |
| GET | `/api/admin/categories` | ✅ | List categories |
| POST | `/api/admin/categories` | ✅ ADMIN | Create category |
| GET | `/api/admin/price-lists` | ✅ | List price lists |
| POST | `/api/admin/price-lists` | ✅ ADMIN | Create price list |
| GET | `/api/admin/customer-tiers` | ✅ | List customer tiers |
| GET | `/api/admin/discount-rules` | ✅ | List discount rules |
| POST | `/api/admin/discount-rules` | ✅ ADMIN | Create discount rule |
| GET | `/api/admin/warehouses` | ✅ | List warehouses |
| POST | `/api/admin/warehouses` | ✅ ADMIN | Create warehouse |

---

## /api/quotations — Member 2

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/quotations` | ✅ | List quotations (filtered by role) |
| POST | `/api/quotations` | ✅ | Create quotation |
| GET | `/api/quotations/:id` | ✅ | Get quotation detail |
| PUT | `/api/quotations/:id` | ✅ | Update quotation |
| DELETE | `/api/quotations/:id` | ✅ | Delete quotation |
| POST | `/api/quotations/:id/submit` | ✅ | Submit for approval |
| POST | `/api/quotations/:id/lines` | ✅ | Add quotation line |
| PUT | `/api/quotations/:id/lines/:lineId` | ✅ | Update quotation line |
| DELETE | `/api/quotations/:id/lines/:lineId` | ✅ | Remove quotation line |
| GET | `/api/quotations/:id/calculate` | ✅ | Recalculate totals |

---

## /api/approvals — Member 2

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/approvals` | ✅ | List pending approvals for current user |
| GET | `/api/approvals/:id` | ✅ | Get approval request detail |
| POST | `/api/approvals/:id/approve` | ✅ MANAGER/FINANCE | Approve request |
| POST | `/api/approvals/:id/reject` | ✅ MANAGER/FINANCE | Reject request |
| POST | `/api/approvals/:id/request-revision` | ✅ | Request revision |
| GET | `/api/approvals/:id/audit` | ✅ | Get audit trail |

---

## /api/deal-twin — Member 2

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/deal-twin/simulate` | ✅ | Run what-if simulation |
| GET | `/api/deal-twin/simulations/:quotationId` | ✅ | Get simulations for quotation |
| GET | `/api/deal-twin/risk/:quotationId` | ✅ | Get risk assessment |
| GET | `/api/deal-twin/best-path/:quotationId` | ✅ | Get best deal path recommendation |

---

## /api/fulfillment — Member 3

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/fulfillment` | ✅ | List fulfillment records |
| GET | `/api/fulfillment/:id` | ✅ | Get fulfillment detail |
| POST | `/api/fulfillment/:id/allocate` | ✅ WAREHOUSE | Allocate stock |
| POST | `/api/fulfillment/:id/ship` | ✅ WAREHOUSE | Mark as shipped |
| POST | `/api/fulfillment/:id/override` | ✅ ADMIN | Manual override |
| GET | `/api/fulfillment/inventory` | ✅ | Get inventory summary |
| PUT | `/api/fulfillment/inventory/:productId` | ✅ WAREHOUSE | Update stock level |
| GET | `/api/fulfillment/backorders` | ✅ | List backorders |

---

## /api/billing — Member 3

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/billing/invoices` | ✅ | List invoices |
| GET | `/api/billing/invoices/:id` | ✅ | Get invoice detail |
| POST | `/api/billing/invoices` | ✅ FINANCE | Create invoice |
| GET | `/api/billing/subscriptions` | ✅ | List subscriptions |
| POST | `/api/billing/subscriptions` | ✅ FINANCE | Create subscription |
| PUT | `/api/billing/subscriptions/:id` | ✅ FINANCE | Update subscription |
| POST | `/api/billing/payments` | ✅ FINANCE | Record payment |
| GET | `/api/billing/credit-notes` | ✅ | List credit notes |
| POST | `/api/billing/credit-notes` | ✅ FINANCE | Issue credit note |

---

## /api/portal — Member 4

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/portal/auth/login` | ❌ | Customer login |
| GET | `/api/portal/quotes` | ✅ CUSTOMER | Customer's quotes |
| GET | `/api/portal/quotes/:id` | ✅ CUSTOMER | Quote detail |
| POST | `/api/portal/quotes/:id/accept` | ✅ CUSTOMER | Accept quote |
| POST | `/api/portal/quotes/:id/negotiate` | ✅ CUSTOMER | Submit negotiation request |
| GET | `/api/portal/quotes/:id/negotiation` | ✅ CUSTOMER | Get negotiation status |

---

## /api/analytics — Member 4

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/analytics/dashboard` | ✅ | Main dashboard metrics |
| GET | `/api/analytics/deal-health` | ✅ | Deal health scores |
| GET | `/api/analytics/anomalies` | ✅ MANAGER | Anomaly alerts |
| GET | `/api/analytics/pipeline` | ✅ | Pipeline summary |
| GET | `/api/analytics/revenue` | ✅ FINANCE | Revenue report |
| GET | `/api/analytics/conversion` | ✅ | Quote conversion report |

---

## Notes for Implementation

1. **Validation**: All request bodies must be validated with Zod schemas before reaching service layer.
2. **Authorization**: Use `requireAuth` and `requireRole()` middleware from `server/src/middleware/`.
3. **Error codes**: Use constants from `server/src/shared/errors/`.
4. **Response format**: Always use `sendSuccess()` and `sendError()` helpers from `server/src/shared/`.
5. **Cross-module data**: If Module A needs data from Module B, call B's service directly (server-side). Do not duplicate models.
