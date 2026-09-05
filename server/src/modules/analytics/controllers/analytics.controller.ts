import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';
import { sendSuccess } from '../../../shared';

export class AnalyticsController {
  public static async getDashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await AnalyticsService.getDashboardMetrics();
      sendSuccess(res, metrics);
    } catch (err) {
      next(err);
    }
  }

  public static async getDealHealth(_req: Request, res: Response, next: NextFunction) {
    try {
      const alerts = await AnalyticsService.getDealHealthAlerts();
      sendSuccess(res, alerts);
    } catch (err) {
      next(err);
    }
  }

  public static async sendNudge(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AnalyticsService.sendNudge(req.params.id);
      sendSuccess(res, result, 'Automated nudge dispatched');
    } catch (err) {
      next(err);
    }
  }

  public static async getPipeline(_req: Request, res: Response, next: NextFunction) {
    try {
      const pipeline = await AnalyticsService.getPipelineSummary();
      sendSuccess(res, pipeline);
    } catch (err) {
      next(err);
    }
  }

  public static async getReports(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getReportsData(req.query);
      sendSuccess(res, data);
    } catch (err) {
      next(err);
    }
  }

  public static async exportReports(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AnalyticsService.getReportsData(req.query);
      // Generate CSV
      const header = 'Quotation,Customer,Tier,GrandTotal,Discount,MarginPercent,RiskLevel,Status,Date\n';
      const rows = data
        .map(
          (d) =>
            `${d.quotationNumber},"${d.customer}",${d.tier},${d.grandTotal},${d.discount},${d.grossMarginPercent},${d.riskLevel},${d.status},${d.date}`
        )
        .join('\n');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="dealflow360-report.csv"');
      res.status(200).send(header + rows);
    } catch (err) {
      next(err);
    }
  }
}
