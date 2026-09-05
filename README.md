# DealFlow360

**An Intelligent, Self-Governing Sales Operations Platform**

---

## Project Purpose

DealFlow360 is a full-stack sales operations platform designed to unify quotation management, deal approvals, fulfillment, billing, and customer negotiation into a single, intelligent workspace. The platform features a unique **DealTwin** innovation layer providing what-if simulation, explainable risk scoring, and AI-guided deal optimization.

---

## Architecture Overview

```
dealflow360/                  ← Monorepo root (npm workspaces)
├── client/                   ← React + Vite + TypeScript + Tailwind
├── server/                   ← Node.js + Express + TypeScript
├── docs/                     ← Architecture documentation
├── scripts/                  ← Utility scripts
└── .github/                  ← GitHub templates and workflows
```

**Single unified application:**
```
Browser → React SPA (port 5173)
              ↓ REST API calls
       Express Server (port 5000)
              ↓
         MongoDB Atlas
```

---

## Technology Stack

| Layer        | Technology                                        |
|--------------|---------------------------------------------------|
| Frontend     | React 18, Vite, TypeScript, Tailwind CSS          |
| UI System    | shadcn/ui, Lucide React                           |
| State        | TanStack Query, React Hook Form, Zod              |
| Routing      | React Router v6                                   |
| Backend      | Node.js 18+, Express, TypeScript                  |
| Database     | MongoDB / MongoDB Atlas (Mongoose)                |
| Auth         | JWT, bcrypt                                       |
| Dev Tools    | ESLint, Prettier, concurrently                    |

---

## Repository Structure

```
dealflow360/
├── client/
│   └── src/
│       ├── app/              ← Router, providers, App root
│       ├── components/       ← Shared UI components
│       ├── modules/          ← Feature modules (one per domain)
│       ├── services/         ← API client utilities
│       ├── hooks/            ← Shared custom hooks
│       ├── lib/              ← Utility libraries
│       ├── types/            ← Shared TypeScript types
│       ├── constants/        ← App-wide constants
│       └── styles/           ← Global styles / design tokens
│
├── server/
│   └── src/
│       ├── config/           ← Env, DB, app configuration
│       ├── middleware/       ← Auth, error, logging middleware
│       ├── modules/          ← Feature modules (mirror of client)
│       ├── shared/           ← Shared utilities, errors, helpers
│       ├── seed/             ← Database seed scripts
│       ├── app.ts            ← Express app setup
│       └── server.ts         ← Server entry point
│
├── docs/                     ← Architecture and API documentation
└── scripts/                  ← Developer utility scripts
```

---

## Module Ownership

| Module       | Member   | Client Path                    | Server Path                    |
|--------------|----------|--------------------------------|--------------------------------|
| auth         | Member 1 | `client/src/modules/auth/`     | `server/src/modules/auth/`     |
| admin        | Member 1 | `client/src/modules/admin/`    | `server/src/modules/admin/`    |
| quotations   | Member 2 | `client/src/modules/quotations/` | `server/src/modules/quotations/` |
| approvals    | Member 2 | `client/src/modules/approvals/`  | `server/src/modules/approvals/`  |
| dealTwin     | Member 2 | `client/src/modules/dealTwin/`   | `server/src/modules/dealTwin/`   |
| fulfillment  | Member 3 | `client/src/modules/fulfillment/`| `server/src/modules/fulfillment/`|
| billing      | Member 3 | `client/src/modules/billing/`    | `server/src/modules/billing/`    |
| portal       | Member 4 | `client/src/modules/portal/`     | `server/src/modules/portal/`     |
| analytics    | Member 4 | `client/src/modules/analytics/`  | `server/src/modules/analytics/`  |

See `docs/module-ownership.md` for full ownership rules.

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB Atlas account (or local MongoDB instance)

### 1. Clone the repository
```bash
git clone https://github.com/your-org/dealflow360.git
cd dealflow360
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example server/.env
# Edit server/.env with your values:
# - MONGODB_URI
# - JWT_SECRET
# - JWT_REFRESH_SECRET
```

### 4. Run development servers
```bash
npm run dev
# Client: http://localhost:5173
# Server: http://localhost:5000
```

---

## Environment Variables

| Variable              | Description                          | Required |
|-----------------------|--------------------------------------|----------|
| `MONGODB_URI`         | MongoDB connection string            | ✅       |
| `JWT_SECRET`          | JWT signing secret                   | ✅       |
| `JWT_REFRESH_SECRET`  | JWT refresh token secret             | ✅       |
| `JWT_EXPIRES_IN`      | Access token expiry (default: `7d`)  | ✅       |
| `PORT`                | Server port (default: `5000`)        | ✅       |
| `CLIENT_URL`          | Frontend URL for CORS                | ✅       |
| `NODE_ENV`            | `development` / `production`         | ✅       |

---

## Development Commands

| Command                  | Description                        |
|--------------------------|------------------------------------|
| `npm run dev`            | Start client + server concurrently |
| `npm run dev:client`     | Start client only                  |
| `npm run dev:server`     | Start server only                  |
| `npm run build`          | Build both client and server       |
| `npm run lint`           | Lint both client and server        |

---

## Git Workflow

1. **Never** push directly to `main`
2. Branch naming: `feat/<module>/<description>` or `fix/<module>/<description>`
3. Always branch from `develop`
4. PR must pass lint checks before merge
5. PR must be reviewed by at least 1 team member
6. Merge to `develop` first; `develop` → `main` for releases

See `docs/git-workflow.md` for the complete workflow.

---

## Implementation Phases

| Phase | Description                                        | Status        |
|-------|----------------------------------------------------|---------------|
| 0     | Project foundation & architecture                  | ✅ Complete   |
| 1     | Auth system, user management, admin configuration  | 🔲 Pending    |
| 2     | Quotation builder, approval workflow, DealTwin     | 🔲 Pending    |
| 3     | Fulfillment, billing, subscriptions                | 🔲 Pending    |
| 4     | Customer portal, analytics, reporting              | 🔲 Pending    |
| 5     | Integration, polish, demo preparation              | 🔲 Pending    |

---

## Contributing

Read `CONTRIBUTING.md` before starting any work.
