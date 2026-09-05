import { Router } from 'express';
import { ApprovalController } from '../controllers/approval.controller';

export const approvalsRouter = Router();

// Approvals Queue & Detail
approvalsRouter.get('/', ApprovalController.list);
approvalsRouter.get('/:id', ApprovalController.getById);

// Workflow Actions
approvalsRouter.post('/:id/approve', ApprovalController.approve);
approvalsRouter.post('/:id/reject', ApprovalController.reject);
approvalsRouter.post('/:id/return', ApprovalController.returnForRevision);
