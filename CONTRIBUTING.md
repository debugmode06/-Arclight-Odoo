# Contributing to DealFlow360

Read this entire document before writing a single line of code.

---

## Table of Contents

1. [Git Rules](#git-rules)
2. [Module Ownership](#module-ownership)
3. [Protected Files](#protected-files)
4. [Architecture Rules](#architecture-rules)
5. [Code Standards](#code-standards)
6. [PR Process](#pr-process)

---

## Git Rules

| # | Rule |
|---|------|
| 1 | **Never push directly to `main`**. All changes go through pull requests. |
| 2 | **Work inside your assigned feature branches**. Branch from `develop`, not `main`. |
| 3 | **Pull latest `develop` before starting** any new work to avoid conflicts. |
| 4 | **Respect module ownership**. Only modify files inside your assigned module directories. |
| 5 | **Do not modify another member's module** without explicit approval from that member. |
| 6 | **Do not modify protected files** (listed below) without team approval and a focused PR. |
| 7 | **Do not duplicate models**. One entity = one model file = one module. |
| 8 | **Do not create duplicate APIs**. All routes must be registered in `app.ts` by Member 1. |
| 9 | **Do not hardcode secrets**. Use environment variables. Never commit `.env`. |
| 10 | **Keep business logic inside services**. Routes → Controllers → Services → Models. |
| 11 | **Keep controllers thin**. Controllers receive requests, call services, return responses. |
| 12 | **Test before creating a PR**. Ensure the app starts and your feature works. |
| 13 | **Keep commits focused**. One logical change per commit. Write meaningful commit messages. |
| 14 | **Never commit `node_modules/`**. It is gitignored. |
| 15 | **Never commit `.env`**. It is gitignored. |

### Branch Naming Convention

```
feat/<module>/<short-description>
fix/<module>/<short-description>
chore/<short-description>
docs/<short-description>
```

**Examples:**
```
feat/quotations/quotation-builder-ui
feat/auth/jwt-refresh-token
fix/billing/invoice-total-calculation
docs/api-contracts-update
chore/eslint-config
```

---

## Module Ownership

Each team member owns specific modules. You are responsible for the entire stack of your module (frontend + backend).

### Member 1
| Area | Paths |
|------|-------|
| App Foundation | `client/src/app/*` |
| Shared Components | `client/src/components/*` |
| Frontend Auth | `client/src/modules/auth/*` |
| Frontend Admin | `client/src/modules/admin/*` |
| Server Config | `server/src/config/*` |
| Server Middleware | `server/src/middleware/*` |
| Server Shared | `server/src/shared/*` |
| Backend Auth | `server/src/modules/auth/*` |
| Backend Admin | `server/src/modules/admin/*` |

### Member 2
| Area | Paths |
|------|-------|
| Frontend Quotations | `client/src/modules/quotations/*` |
| Frontend Approvals | `client/src/modules/approvals/*` |
| Frontend DealTwin | `client/src/modules/dealTwin/*` |
| Backend Quotations | `server/src/modules/quotations/*` |
| Backend Approvals | `server/src/modules/approvals/*` |
| Backend DealTwin | `server/src/modules/dealTwin/*` |

### Member 3
| Area | Paths |
|------|-------|
| Frontend Fulfillment | `client/src/modules/fulfillment/*` |
| Frontend Billing | `client/src/modules/billing/*` |
| Backend Fulfillment | `server/src/modules/fulfillment/*` |
| Backend Billing | `server/src/modules/billing/*` |

### Member 4
| Area | Paths |
|------|-------|
| Frontend Portal | `client/src/modules/portal/*` |
| Frontend Analytics | `client/src/modules/analytics/*` |
| Backend Portal | `server/src/modules/portal/*` |
| Backend Analytics | `server/src/modules/analytics/*` |

---

## Protected Files

The following files require **team discussion and approval** before modification. They affect all members:

### Frontend Protected Files
```
client/src/app/App.tsx          ← App root. Only Member 1 modifies.
client/src/app/router.tsx       ← All routes. Changes require team sync.
client/src/app/providers.tsx    ← Global providers. Only Member 1 modifies.
client/src/styles/globals.css   ← Global styles. Only Member 1 modifies.
client/tailwind.config.ts       ← Tailwind config. Only Member 1 modifies.
client/package.json             ← Adding deps requires team agreement.
```

### Backend Protected Files
```
server/src/app.ts       ← Route registration. Only Member 1 modifies main routes.
server/src/server.ts    ← Server bootstrap. Only Member 1 modifies.
server/package.json     ← Adding deps requires team agreement.
```

### Root Protected Files
```
package.json            ← Root orchestration. Only Member 1 modifies.
tsconfig.base.json      ← Base TS config. Changes affect all members.
.env.example            ← Add new env vars here when needed.
README.md               ← Updated collectively.
CONTRIBUTING.md         ← Updated collectively.
```

### How to request a protected file change
1. Open a GitHub issue titled: `[PROTECTED] <filename>: <reason for change>`
2. Tag all team members
3. Get at least 2 approvals before touching the file
4. Make the change in an isolated PR with no other changes

---

## Architecture Rules

| # | Rule |
|---|------|
| R1 | No microservices. One backend, one database. |
| R2 | No separate databases per module. |
| R3 | No separate frontends per member. |
| R4 | No duplicate shared components. |
| R5 | No duplicate business entities/models. |
| R6 | No fake or hardcoded API responses in production code. |
| R7 | No hardcoded business results. |
| R8 | No business logic in React components. Use hooks or services. |
| R9 | No business logic directly in Express route files. |
| R10 | Modules communicate through defined API contracts, not by importing each other. |
| R11 | The final application must run from one cloned repository. |
| R12 | All new features must fit the established architecture. |

---

## Code Standards

### TypeScript
- Strict mode is enabled. No `any` types without explicit justification.
- Prefer `interface` for object shapes, `type` for unions/intersections.
- Always type function return values.

### Frontend
- Components go in `components/` (shared) or `modules/<name>/components/` (module-specific).
- Business logic belongs in hooks or services, not in JSX.
- Use `React.FC` or typed props interfaces for all components.
- Use TanStack Query for all server state.
- Use React Hook Form + Zod for all forms.

### Backend
- All routes → controllers → services → models.
- Always use `try/catch` or async error wrapper middleware.
- Always return consistent response shapes using `shared/response.helper.ts`.
- Never use `req.body` directly without Zod validation first.
- All Mongoose queries go in the service layer.

### Naming Conventions
| Context | Convention | Example |
|---------|------------|---------|
| Files | `kebab-case` | `quotation-builder.tsx` |
| React Components | `PascalCase` | `QuotationBuilder` |
| Functions/variables | `camelCase` | `getQuotationById` |
| Types/Interfaces | `PascalCase` | `QuotationLine` |
| Constants | `SCREAMING_SNAKE` | `MAX_DISCOUNT_RATE` |
| API routes | `kebab-case` | `/api/quotations/:id/approve` |

---

## PR Process

1. **Ensure your branch is up to date** with `develop` before raising a PR.
2. **Fill in the PR template completely**. Incomplete PRs will be rejected.
3. **Self-review your diff** before requesting review.
4. **Tag the appropriate module owner** as reviewer.
5. **Shared file changes** must be reviewed by ALL members.
6. **Merge strategy**: Squash and merge into `develop`.
7. `develop` → `main` merges are coordinated by Member 1.

---

> This document is the source of truth for team collaboration rules.
> If something is not covered here, discuss it as a team and update this document.
