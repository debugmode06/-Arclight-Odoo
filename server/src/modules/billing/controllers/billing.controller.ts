import { Request, Response } from 'express';
import { billingService } from '../services/billing.service';
import { sendSuccess, sendCreated } from '../../../shared';

export class BillingController {
  public async calculateBill(req: Request, res: Response): Promise<void> {
    const calc = billingService.calculateHybridBill(req.body);
    sendSuccess(res, calc, 'Hybrid bill preview calculated successfully');
  }

  public async createInvoice(req: Request, res: Response): Promise<void> {
    const invoice = await billingService.generateInvoice(req.body);
    sendCreated(res, invoice, 'Invoice generated and saved successfully');
  }

  public async listInvoices(_req: Request, res: Response): Promise<void> {
    const invoices = await billingService.listInvoices();
    sendSuccess(res, invoices, 'Invoices retrieved successfully');
  }

  public async getInvoiceDetail(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const invoice = await billingService.getInvoiceById(id);
    sendSuccess(res, invoice, 'Invoice detail retrieved successfully');
  }

  public async listSubscriptions(_req: Request, res: Response): Promise<void> {
    const plans = [
      {
        id: 'STARTER',
        name: 'Starter Tier',
        price: 199,
        interval: 'monthly',
        includedOrders: 500,
        storageRatePerPallet: 30,
        apiRatePerCall: 0.0015,
        features: ['Up to 5 Warehouses', 'Basic Split Engine', 'Email Support'],
      },
      {
        id: 'PROFESSIONAL',
        name: 'Professional Tier',
        price: 499,
        interval: 'monthly',
        isPopular: true,
        includedOrders: 2000,
        storageRatePerPallet: 25,
        apiRatePerCall: 0.001,
        features: ['Unlimited Warehouses', 'DealTwin AI Route Simulator', 'Priority Backorder Allocation', '24/7 SLA Support'],
      },
      {
        id: 'ENTERPRISE',
        name: 'Enterprise Tier',
        price: 999,
        interval: 'monthly',
        includedOrders: 10000,
        storageRatePerPallet: 20,
        apiRatePerCall: 0.0005,
        features: ['Custom Hub Consolidation', 'Dedicated Account Manager', 'Custom ERP Connectors', 'Zero Setup Fees'],
      },
    ];
    sendSuccess(res, plans, 'Subscriptions list retrieved successfully');
  }
}

export const billingController = new BillingController();
