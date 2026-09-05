/**
 * Portal Module — Owner: Member 4
 *
 * Responsibilities:
 * - Customer portal layout & navigation
 * - Customer authentication & route protection (/customer/login)
 * - Customer quotation listing (/customer/quotes)
 * - Customer quote detail view (/customer/quotes/:id)
 * - Negotiation actions (line comments, change requests, counter discount offers)
 * - Customer quotation explicit confirmation
 * - Customer-safe Negotiation Timeline (WOW feature)
 *
 * API: /api/portal/*
 */
export * from './types/portal.types';
export * from './schemas/portal.schemas';
export * from './services/portal.service';
export * from './hooks/useCustomerPortal';
export * from './components/CustomerPortalLayout';
export * from './components/CustomerAuthGuard';
export * from './components/NegotiationTimeline';
export * from './components/LineCommentModal';
export * from './components/ChangeRequestModal';
export * from './components/CounterOfferModal';
export * from './components/QuoteConfirmDialog';
export * from './pages/CustomerLoginPage';
export * from './pages/CustomerDashboardPage';
export * from './pages/CustomerQuotesPage';
export * from './pages/CustomerQuoteDetailPage';
//# sourceMappingURL=index.d.ts.map