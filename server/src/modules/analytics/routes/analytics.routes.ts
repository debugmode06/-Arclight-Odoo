import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';

export const analyticsRouter = Router();

// Dashboard Metrics
analyticsRouter.get('/dashboard', AnalyticsController.getDashboard);

// Deal Health & Anomalies
analyticsRouter.get('/deal-health', AnalyticsController.getDealHealth);
analyticsRouter.post('/deal-health/:id/nudge', AnalyticsController.sendNudge);

// Pipeline
analyticsRouter.get('/pipeline', AnalyticsController.getPipeline);

// Reports & CSV Export
analyticsRouter.get('/reports', AnalyticsController.getReports);
analyticsRouter.get('/reports/export', AnalyticsController.exportReports);
