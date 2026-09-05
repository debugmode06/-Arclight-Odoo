import mongoose, { Schema, Document, Types } from 'mongoose';
import { ApprovalStatus, UserRole } from '../../../shared';

export interface IApprovalStep {
  step: number;
  role: UserRole;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
}

export interface IApprovalRequest extends Document {
  quotationId: Types.ObjectId;
  quotationNumber: string;
  requestedBy: Types.ObjectId;
  requestedByNameSnapshot: string;
  status: ApprovalStatus;
  currentStep: number;
  requiredSteps: IApprovalStep[];
  reason: string;
  riskScoreSnapshot: number;
  riskLevelSnapshot: string;
  discountSnapshot: number;
  marginSnapshot: number;
  grandTotalSnapshot: number;
  actions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

const approvalStepSchema = new Schema<IApprovalStep>(
  {
    step: { type: Number, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
  },
  { _id: false }
);

const approvalRequestSchema = new Schema<IApprovalRequest>(
  {
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    quotationNumber: { type: String, required: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestedByNameSnapshot: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(ApprovalStatus),
      default: ApprovalStatus.PENDING,
      required: true,
    },
    currentStep: { type: Number, default: 1 },
    requiredSteps: { type: [approvalStepSchema], default: [] },
    reason: { type: String, required: true },
    riskScoreSnapshot: { type: Number, required: true },
    riskLevelSnapshot: { type: String, required: true },
    discountSnapshot: { type: Number, required: true },
    marginSnapshot: { type: Number, required: true },
    grandTotalSnapshot: { type: Number, required: true },
    actions: [{ type: Schema.Types.ObjectId, ref: 'ApprovalAction' }],
    completedAt: { type: Date },
  },
  { timestamps: true }
);

approvalRequestSchema.index({ quotationId: 1, status: 1 });
approvalRequestSchema.index({ status: 1, currentStep: 1 });

export const ApprovalRequest = mongoose.model<IApprovalRequest>('ApprovalRequest', approvalRequestSchema);
