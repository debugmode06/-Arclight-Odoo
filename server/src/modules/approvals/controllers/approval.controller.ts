import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { ApprovalService } from '../services/approval.service';
import { approvalActionSchema, listApprovalsQuerySchema } from '../schemas/approval.schema';
import { sendSuccess, UserRole } from '../../../shared';
import { User } from '../../auth/models/user.model';

async function resolveActor(req: Request, defaultRole = UserRole.SALES_MANAGER) {
  if (req.user) return req.user;
  const user = await User.findOne({ role: defaultRole }) || await User.findOne();
  if (user) {
    return { id: user._id.toString(), email: user.email, role: user.role };
  }
  return { id: new Types.ObjectId().toString(), email: 'manager@dealflow360.com', role: defaultRole };
}

export class ApprovalController {
  public static async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = listApprovalsQuerySchema.parse(req.query);
      const user = await resolveActor(req);
      const approvals = await ApprovalService.listApprovals({
        status: query.status,
        quotationId: query.quotationId,
        role: user.role,
        userId: user.id,
      });
      sendSuccess(res, approvals);
    } catch (err) {
      next(err);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const approval = await ApprovalService.getApprovalById(req.params.id);
      sendSuccess(res, approval);
    } catch (err) {
      next(err);
    }
  }

  public static async approve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = approvalActionSchema.parse(req.body);
      const actor = await resolveActor(req, UserRole.SALES_MANAGER);
      const result = await ApprovalService.approve(req.params.id, actor, body.comment);
      sendSuccess(res, result, 'Quotation approved successfully');
    } catch (err) {
      next(err);
    }
  }

  public static async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = approvalActionSchema.parse(req.body);
      const actor = await resolveActor(req, UserRole.SALES_MANAGER);
      const result = await ApprovalService.reject(req.params.id, actor, body.comment);
      sendSuccess(res, result, 'Quotation rejected');
    } catch (err) {
      next(err);
    }
  }

  public static async returnForRevision(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = approvalActionSchema.parse(req.body);
      const actor = await resolveActor(req, UserRole.SALES_MANAGER);
      const result = await ApprovalService.returnForRevision(req.params.id, actor, body.comment);
      sendSuccess(res, result, 'Quotation returned for revision');
    } catch (err) {
      next(err);
    }
  }
}
