# DealFlow360 — Module Ownership

This is the authoritative ownership document. All team members must respect these boundaries.

---

## Member 1

**Responsibilities:** App Foundation, Auth System, Admin Configuration

### Client Paths
```
client/src/app/                          ← App root, router, providers
client/src/components/                   ← ALL shared UI components
client/src/modules/auth/                 ← Login, signup, session
client/src/modules/admin/                ← Products, config, users
client/src/hooks/                        ← Shared hooks
client/src/services/                     ← HTTP client, base API setup
client/src/lib/                          ← Utility functions
client/src/types/                        ← Shared TypeScript types
client/src/constants/                    ← App-wide constants
client/src/styles/                       ← Global styles, design tokens
client/tailwind.config.ts                ← Design system config
client/vite.config.ts                    ← Build config
```

### Server Paths
```
server/src/config/                       ← Env, DB, app config
server/src/middleware/                   ← Auth, error, request middleware
server/src/shared/                       ← Shared utilities, helpers
server/src/modules/auth/                 ← Auth routes, JWT, bcrypt
server/src/modules/admin/                ← Admin CRUD routes
server/src/app.ts                        ← Express app + route registration
server/src/server.ts                     ← Server bootstrap
```

### API Namespaces
- `POST /api/auth/*`
- `GET|POST|PUT|DELETE /api/admin/*`

---

## Member 2

**Responsibilities:** Quotation System, Approval Workflow, DealTwin Layer

### Client Paths
```
client/src/modules/quotations/           ← Quotation list, builder, pipeline
client/src/modules/approvals/            ← Approval queue, workflow UI
client/src/modules/dealTwin/             ← What-if, risk, recommendations
```

### Server Paths
```
server/src/modules/quotations/           ← Quotation CRUD, calculations
server/src/modules/approvals/            ← Approval workflow, audit
server/src/modules/dealTwin/             ← Simulation, risk engine
```

### API Namespaces
- `GET|POST|PUT|DELETE /api/quotations/*`
- `GET|POST /api/approvals/*`
- `GET|POST /api/deal-twin/*`

### Models Owned
- `Quotation`
- `QuotationLine`
- `ApprovalRequest`
- `ApprovalAction`
- `DealTwinSimulation`

---

## Member 3

**Responsibilities:** Fulfillment Operations, Billing & Subscriptions

### Client Paths
```
client/src/modules/fulfillment/          ← Warehouse, stock, shipment
client/src/modules/billing/              ← Invoices, subscriptions, payments
```

### Server Paths
```
server/src/modules/fulfillment/          ← Allocation, inventory, backorders
server/src/modules/billing/              ← Billing schedules, invoices, payments
```

### API Namespaces
- `GET|POST|PUT /api/fulfillment/*`
- `GET|POST|PUT /api/billing/*`

### Models Owned
- `Warehouse`
- `Inventory`
- `Fulfillment`
- `SubscriptionPlan`
- `Subscription`
- `BillingSchedule`
- `Invoice`
- `Payment`
- `CreditNote`

---

## Member 4

**Responsibilities:** Customer Portal, Analytics & Reporting

### Client Paths
```
client/src/modules/portal/               ← Customer-facing portal
client/src/modules/analytics/            ← Dashboards, reporting
```

### Server Paths
```
server/src/modules/portal/               ← Customer auth, quote access, negotiation
server/src/modules/analytics/            ← Aggregations, deal health, alerts
```

### API Namespaces
- `GET|POST /api/portal/*`
- `GET /api/analytics/*`

### Models Owned
- `Negotiation`
- `DealHealthAlert`

---

## Shared Ownership

These are shared responsibilities requiring team coordination:

| Path | Owner | Others who may need to discuss |
|------|-------|-------------------------------|
| `client/src/app/router.tsx` | Member 1 | All (adding routes) |
| `client/src/app/App.tsx` | Member 1 | All |
| `server/src/app.ts` | Member 1 | All (registering module routers) |
| `server/src/shared/` | Member 1 | All (using shared utilities) |
| `docs/` | All | Collaborative |
| `README.md` | Member 1 | All |
| `CONTRIBUTING.md` | Member 1 | All |
| `.env.example` | Member 1 | Any (adding new env vars) |

---

## Cross-Module Dependency Rules

When your module needs something from another module:

### Client-side
- **Allowed**: Call `/api/<their-namespace>/...` via TanStack Query
- **Not Allowed**: Directly import from `client/src/modules/<other>/`

### Server-side
- **Allowed**: Import and call another module's **service functions**
- **Allowed**: Import another module's **Mongoose models** (for references/lookups)
- **Not Allowed**: Duplicate another module's model definition
- **Not Allowed**: Import another module's **routes or controllers**

---

## Escalation Process

If you need to:
1. **Add a shared component**: Request Member 1 to add it to `client/src/components/shared/`
2. **Add a shared utility**: Request Member 1 to add it to `server/src/shared/`
3. **Modify a shared model**: Discuss with the model owner and create a focused PR
4. **Add a new route namespace**: Discuss with Member 1 (who registers all routes in `app.ts`)
5. **Add a new dependency**: Open a GitHub issue → team vote → Member 1 implements

Raise a GitHub issue for any cross-boundary request.
