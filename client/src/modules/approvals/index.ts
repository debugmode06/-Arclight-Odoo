/**
 * Approvals Module — Owner: Member 2
 *
 * Responsibilities:
 * - Approval queue for sales managers and finance
 * - Detail view with multi-step review chain
 * - Approve, Reject, Return for Revision actions
 * - Full audit trail
 *
 * API: /api/approvals/*
 */

export * from './types/approval.types';
export * from './services/approval.service';
export * from './pages/ApprovalsPage';
export * from './pages/ApprovalDetailPage';
