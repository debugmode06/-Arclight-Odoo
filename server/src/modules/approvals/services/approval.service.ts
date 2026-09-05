import { Types } from 'mongoose';
import { ApprovalStatus, UserRole, NotFoundError, BadRequestError, ForbiddenError } from '../../../shared';
import { ApprovalRequest, IApprovalRequest, IApprovalStep } from '../models/approval-request.model';
import { ApprovalAction, ApprovalActionType } from '../models/approval-action.model';
import { Quotation, IQuotation } from '../../quotations/models/quotation.model';
import { QuotationStatus } from '../../../shared';
import { User } from '../../auth/models/user.model';

export class ApprovalService {
  /**
   * Creates a sequential multi-step approval request for a quotation.
   */
  public static async createApprovalRequest(
    quotation: IQuotation,
    user: { id: string; role: UserRole }
  ): Promise<IApprovalRequest> {
    const userDoc = await User.findById(user.id);
    const requestedByName = userDoc ? `${userDoc.firstName} ${userDoc.lastName}` : 'Sales Representative';

    // Invalidate any existing pending approval for this quote
    await ApprovalRequest.updateMany(
      { quotationId: quotation._id, status: { $in: [ApprovalStatus.PENDING, ApprovalStatus.MANAGER_APPROVED] } },
      { status: ApprovalStatus.REJECTED, completedAt: new Date() }
    );

    // Determine required approval steps
    const requiredSteps: IApprovalStep[] = [
      {
        step: 1,
        role: UserRole.SALES_MANAGER,
        status: 'PENDING',
      },
    ];

    // Finance approval required if high/critical risk, low margin, or large deal value
    const requiresFinance =
      quotation.discountRiskScore >= 60 ||
      quotation.grossMarginPercent < 15 ||
      quotation.grandTotal >= 50000 ||
      quotation.lines.some((l) => l.discountPercent >= 20);

    if (requiresFinance) {
      requiredSteps.push({
        step: 2,
        role: UserRole.FINANCE,
        status: 'PENDING',
      });
    }

    const reason =
      quotation.discountRiskFactors.length > 0
        ? quotation.discountRiskFactors.slice(0, 3).join('; ')
        : 'Quotation requires commercial governance review';

    const approvalRequest = await ApprovalRequest.create({
      quotationId: quotation._id,
      quotationNumber: quotation.quotationNumber,
      requestedBy: quotation.createdBy,
      requestedByNameSnapshot: requestedByName,
      status: ApprovalStatus.PENDING,
      currentStep: 1,
      requiredSteps,
      reason,
      riskScoreSnapshot: quotation.discountRiskScore,
      riskLevelSnapshot: quotation.discountRiskLevel,
      discountSnapshot: quotation.totalDiscount,
      marginSnapshot: quotation.grossMarginPercent,
      grandTotalSnapshot: quotation.grandTotal,
      actions: [],
    });

    return approvalRequest;
  }

  /**
   * Lists approval requests with optional filters and role scoping.
   */
  public static async listApprovals(filter: {
    status?: ApprovalStatus;
    quotationId?: string;
    role?: UserRole;
    userId?: string;
  }) {
    const query: Record<string, any> = {};

    if (filter.status) {
      query.status = filter.status;
    }
    if (filter.quotationId) {
      query.quotationId = filter.quotationId;
    }

    const approvals = await ApprovalRequest.find(query)
      .populate('quotationId', 'quotationNumber grandTotal grossMarginPercent discountRiskScore discountRiskLevel customerId status')
      .populate('requestedBy', 'firstName lastName email role')
      .sort({ createdAt: -1 })
      .lean();

    return approvals;
  }

  /**
   * Fetches single approval request with full action history.
   */
  public static async getApprovalById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError('Invalid approval request ID');
    }

    const approval = await ApprovalRequest.findById(id)
      .populate({
        path: 'quotationId',
        populate: [{ path: 'customerId' }, { path: 'createdBy', select: 'firstName lastName email role' }],
      })
      .populate('requestedBy', 'firstName lastName email role')
      .populate({
        path: 'actions',
        populate: { path: 'actorId', select: 'firstName lastName email role' },
      })
      .lean();

    if (!approval) {
      throw new NotFoundError('Approval request not found');
    }

    return approval;
  }

  /**
   * Processes an approval decision (Approve).
   */
  public static async approve(
    id: string,
    actor: { id: string; role: UserRole },
    comment: string
  ) {
    const approval = await ApprovalRequest.findById(id);
    if (!approval) throw new NotFoundError('Approval request not found');

    if (approval.status === ApprovalStatus.APPROVED || approval.status === ApprovalStatus.REJECTED) {
      throw new BadRequestError(`Approval request has already been finalized (${approval.status})`);
    }

    const currentStepObj = approval.requiredSteps.find((s) => s.step === approval.currentStep);
    if (!currentStepObj) {
      throw new BadRequestError('Invalid approval step state');
    }

    // Role check: Actor must match the required role for the current step, or be SUPER_ADMIN / ADMIN
    const isAuthorized =
      actor.role === currentStepObj.role ||
      actor.role === UserRole.ADMIN ||
      actor.role === UserRole.SUPER_ADMIN;

    if (!isAuthorized) {
      throw new ForbiddenError(
        `Action requires role ${currentStepObj.role}. Your role is ${actor.role}.`
      );
    }

    const actorDoc = await User.findById(actor.id);
    const actorName = actorDoc ? `${actorDoc.firstName} ${actorDoc.lastName}` : actor.role;

    // Create audit action
    const action = await ApprovalAction.create({
      approvalRequestId: approval._id,
      quotationId: approval.quotationId,
      actorId: actor.id,
      actorNameSnapshot: actorName,
      actorRole: actor.role,
      action: 'APPROVE' as ApprovalActionType,
      comment: comment || 'Approved commercial proposal',
      timestamp: new Date(),
    });

    approval.actions.push(action._id as Types.ObjectId);
    currentStepObj.status = 'APPROVED';
    currentStepObj.approvedBy = new Types.ObjectId(actor.id);
    currentStepObj.approvedAt = new Date();

    const hasNextStep = approval.requiredSteps.some((s) => s.step > approval.currentStep);

    if (hasNextStep) {
      approval.currentStep += 1;
      approval.status = ApprovalStatus.MANAGER_APPROVED;
    } else {
      // Final step approved -> Quotation is now APPROVED
      approval.status = ApprovalStatus.APPROVED;
      approval.completedAt = new Date();

      await Quotation.findByIdAndUpdate(approval.quotationId, {
        status: QuotationStatus.APPROVED,
        updatedBy: actor.id,
      });
    }

    await approval.save();
    return this.getApprovalById(id);
  }

  /**
   * Processes a rejection.
   */
  public static async reject(
    id: string,
    actor: { id: string; role: UserRole },
    comment: string
  ) {
    if (!comment || comment.trim().length === 0) {
      throw new BadRequestError('A comment is required when rejecting a quotation');
    }

    const approval = await ApprovalRequest.findById(id);
    if (!approval) throw new NotFoundError('Approval request not found');

    const actorDoc = await User.findById(actor.id);
    const actorName = actorDoc ? `${actorDoc.firstName} ${actorDoc.lastName}` : actor.role;

    const action = await ApprovalAction.create({
      approvalRequestId: approval._id,
      quotationId: approval.quotationId,
      actorId: actor.id,
      actorNameSnapshot: actorName,
      actorRole: actor.role,
      action: 'REJECT' as ApprovalActionType,
      comment,
      timestamp: new Date(),
    });

    approval.actions.push(action._id as Types.ObjectId);
    approval.status = ApprovalStatus.REJECTED;
    approval.completedAt = new Date();

    const currentStepObj = approval.requiredSteps.find((s) => s.step === approval.currentStep);
    if (currentStepObj) {
      currentStepObj.status = 'REJECTED';
    }

    await approval.save();

    await Quotation.findByIdAndUpdate(approval.quotationId, {
      status: QuotationStatus.REJECTED,
      updatedBy: actor.id,
    });

    return this.getApprovalById(id);
  }

  /**
   * Returns quotation for revision.
   */
  public static async returnForRevision(
    id: string,
    actor: { id: string; role: UserRole },
    comment: string
  ) {
    if (!comment || comment.trim().length === 0) {
      throw new BadRequestError('Revision instructions must be specified in the comment');
    }

    const approval = await ApprovalRequest.findById(id);
    if (!approval) throw new NotFoundError('Approval request not found');

    const actorDoc = await User.findById(actor.id);
    const actorName = actorDoc ? `${actorDoc.firstName} ${actorDoc.lastName}` : actor.role;

    const action = await ApprovalAction.create({
      approvalRequestId: approval._id,
      quotationId: approval.quotationId,
      actorId: actor.id,
      actorNameSnapshot: actorName,
      actorRole: actor.role,
      action: 'RETURN' as ApprovalActionType,
      comment,
      timestamp: new Date(),
    });

    approval.actions.push(action._id as Types.ObjectId);
    approval.status = ApprovalStatus.REVISION_REQUESTED;
    approval.completedAt = new Date();
    await approval.save();

    await Quotation.findByIdAndUpdate(approval.quotationId, {
      status: QuotationStatus.RETURNED,
      notes: `Returned for revision: ${comment}`,
      updatedBy: actor.id,
    });

    return this.getApprovalById(id);
  }
}
