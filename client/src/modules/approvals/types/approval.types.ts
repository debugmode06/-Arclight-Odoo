import { Quotation } from '../../quotations/types/quotation.types';

export type ApprovalStatus =
  | 'PENDING'
  | 'MANAGER_APPROVED'
  | 'FINANCE_APPROVED'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVISION_REQUESTED';

export interface ApprovalStep {
  step: number;
  role: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  approvedAt?: string;
}

export interface ApprovalActionRecord {
  _id: string;
  actorId?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  actorNameSnapshot: string;
  actorRole: string;
  action: 'APPROVE' | 'REJECT' | 'RETURN';
  comment: string;
  timestamp: string;
}

export interface ApprovalRequest {
  _id: string;
  quotationId: Quotation;
  quotationNumber: string;
  requestedBy: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  requestedByNameSnapshot: string;
  status: ApprovalStatus;
  currentStep: number;
  requiredSteps: ApprovalStep[];
  reason: string;
  riskScoreSnapshot: number;
  riskLevelSnapshot: string;
  discountSnapshot: number;
  marginSnapshot: number;
  grandTotalSnapshot: number;
  actions: ApprovalActionRecord[];
  createdAt: string;
  completedAt?: string;
}
