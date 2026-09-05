/**
 * Quotations Module — Owner: Member 2
 *
 * Responsibilities:
 * - Quotation list with pipeline view
 * - Quotation builder (line items, quantities, discounts, totals)
 * - Quotation detail page
 * - Submit for approval action
 * - Margin and total calculations (display only)
 *
 * API: /api/quotations/*
 */

export * from './types/quotation.types';
export * from './services/quotation.service';
export * from './components/CommercialSummaryCard';
export * from './components/QuotationStatusBadge';
export * from './components/RiskBadge';
export * from './components/QuotationNavbar';
export * from './pages/QuotationsPage';
export * from './pages/QuotationBuilderPage';
export * from './pages/QuotationDetailPage';
