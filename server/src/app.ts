import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import { env } from './config/env.config';
import { globalErrorHandler, notFoundHandler } from './middleware/error.middleware';

// Module routers
import { authRouter } from './modules/auth';
import { adminRouter } from './modules/admin';
import { quotationsRouter } from './modules/quotations';
import { approvalsRouter } from './modules/approvals';
import { dealTwinRouter } from './modules/dealTwin';
import { fulfillmentRouter } from './modules/fulfillment';
import { billingRouter } from './modules/billing';
import { portalRouter } from './modules/portal';
import { analyticsRouter } from './modules/analytics';

const app = express();

// ─── Security ──────────────────────────────────────────────────────────────
app.use(helmet());

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ─── Rate Limiting ─────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
});
app.use('/api', limiter);

// ─── Body Parsing ──────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Logging ───────────────────────────────────────────────────────────────
if (env.isDevelopment) {
  app.use(morgan('dev'));
}

// ─── Root & Health Check ───────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({
    name: 'DealFlow360 API',
    status: 'running',
    environment: env.NODE_ENV,
    api: '/api',
    health: '/health',
  });
});



app.get('/health', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});


// ─── API Routes ────────────────────────────────────────────────────────────
// Member 1 namespaces
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);

// Member 2 namespaces
app.use('/api/quotations', quotationsRouter);
app.use('/api/approvals', approvalsRouter);
app.use('/api/deal-twin', dealTwinRouter);

// Member 3 namespaces
app.use('/api/fulfillment', fulfillmentRouter);
app.use('/api/billing', billingRouter);

// Member 4 namespaces
app.use('/api/portal', portalRouter);
app.use('/api/analytics', analyticsRouter);

// ─── Error Handling (must be last) ─────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

export { app };
