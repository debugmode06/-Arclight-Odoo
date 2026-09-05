# DealFlow360 — System Architecture

---

## Overview

DealFlow360 is a **monorepo** containing a single React frontend, a single Express backend, and a single MongoDB database. There are no microservices, no separate databases per module, and no separate applications.

```
┌─────────────────────────────────────────────────────────┐
│                     dealflow360/                         │
│                                                          │
│  ┌─────────────────────┐  ┌─────────────────────────┐   │
│  │     client/         │  │       server/            │   │
│  │  React + Vite +     │  │  Express + TypeScript    │   │
│  │  TypeScript +       │  │  port: 5000              │   │
│  │  Tailwind CSS       │  │                          │   │
│  │  port: 5173         │  │  ┌───────────────────┐  │   │
│  │                     │  │  │  MongoDB Atlas    │  │   │
│  │  [TanStack Query]   │←─┼─→│  (single database)│  │   │
│  │  REST calls to      │  │  └───────────────────┘  │   │
│  │  /api/*             │  │                          │   │
│  └─────────────────────┘  └─────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## Module Architecture

Each business domain is a **module** that exists symmetrically in both client and server.

### Client Module Structure
```
client/src/modules/<module-name>/
├── components/     ← Module-specific React components
├── pages/          ← Page-level components (used by router)
├── hooks/          ← Module-specific React hooks
├── services/       ← API call functions (call backend)
├── types/          ← TypeScript types/interfaces
├── schemas/        ← Zod validation schemas
└── index.ts        ← Public exports (barrel file)
```

### Server Module Structure
```
server/src/modules/<module-name>/
├── controllers/    ← Request handlers (thin, call services)
├── routes/         ← Express route definitions
├── services/       ← Business logic layer
├── models/         ← Mongoose models
├── schemas/        ← Zod request/response validation schemas
├── types/          ← TypeScript types for this module
└── index.ts        ← Module export (router, models, types)
```

---

## Data Flow

```
Browser Action
     ↓
React Component (UI only)
     ↓
Custom Hook / Service (client/src/modules/<name>/services/)
     ↓
TanStack Query → HTTP Request → /api/<route>
     ↓
Express Route (server/src/modules/<name>/routes/)
     ↓
Controller (thin — parse, validate, call service)
     ↓
Service (business logic — calculations, rules)
     ↓
Mongoose Model → MongoDB
     ↓
Response → JSON → TanStack Query Cache → Component re-render
```

---

## Authentication Architecture

```
Client: React → /api/auth/login
                      ↓
          Server: Validate → bcrypt compare → JWT issue
                      ↓
          Tokens returned: { accessToken, refreshToken }
                      ↓
          Client: Store in memory + httpOnly cookie
                      ↓
          All future requests: Authorization: Bearer <token>
                      ↓
          Server middleware: verifyToken → attach user to req
```

**Role-Based Access:**
- `SUPER_ADMIN` — Full access
- `ADMIN` — Admin module access
- `SALES_MANAGER` — Quotation + Approval access
- `SALES_REP` — Quotation creation
- `FINANCE` — Billing + Approval (finance step)
- `WAREHOUSE` — Fulfillment access
- `CUSTOMER` — Portal only

---

## Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Monorepo | 4 members share one codebase, avoiding integration hell |
| Module-per-domain | Each member owns a vertical slice (UI + API + DB) |
| No microservices | Hackathon scope; single process is simpler to deploy |
| Shared MongoDB | Entities like `Quotation` link across all modules |
| Zod everywhere | Shared validation prevents client/server drift |
| TanStack Query | Eliminates manual loading/error state, caches responses |
| shadcn/ui | Consistent design system without per-member CSS fights |

---

## Central Entity: Quotation

The `Quotation` is the central business entity. All other modules orbit it:

```
Customer
   └── Quotation
         ├── QuotationLine[]      (products + quantities + pricing)
         ├── ApprovalRequest      (approval workflow state)
         ├── DealTwinSimulation[] (what-if analysis snapshots)
         ├── Fulfillment          (warehouse allocation)
         ├── Subscription         (if recurring billing)
         ├── Invoice[]            (generated billing documents)
         └── Negotiation          (customer portal interaction)
```

---

## Directory Ownership Summary

| Directory | Owner |
|-----------|-------|
| `client/src/app/` | Member 1 |
| `client/src/components/` | Member 1 |
| `client/src/modules/auth/` | Member 1 |
| `client/src/modules/admin/` | Member 1 |
| `server/src/config/` | Member 1 |
| `server/src/middleware/` | Member 1 |
| `server/src/shared/` | Member 1 |
| `server/src/modules/auth/` | Member 1 |
| `server/src/modules/admin/` | Member 1 |
| `client/src/modules/quotations/` | Member 2 |
| `client/src/modules/approvals/` | Member 2 |
| `client/src/modules/dealTwin/` | Member 2 |
| `server/src/modules/quotations/` | Member 2 |
| `server/src/modules/approvals/` | Member 2 |
| `server/src/modules/dealTwin/` | Member 2 |
| `client/src/modules/fulfillment/` | Member 3 |
| `client/src/modules/billing/` | Member 3 |
| `server/src/modules/fulfillment/` | Member 3 |
| `server/src/modules/billing/` | Member 3 |
| `client/src/modules/portal/` | Member 4 |
| `client/src/modules/analytics/` | Member 4 |
| `server/src/modules/portal/` | Member 4 |
| `server/src/modules/analytics/` | Member 4 |
