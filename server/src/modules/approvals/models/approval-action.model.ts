import mongoose, { Schema, Document, Types } from 'mongoose';
import { UserRole } from '../../../shared';

export type ApprovalActionType = 'APPROVE' | 'REJECT' | 'RETURN';

export interface IApprovalAction extends Document {
  approvalRequestId: Types.ObjectId;
  quotationId: Types.ObjectId;
  actorId: Types.ObjectId;
  actorNameSnapshot: string;
  actorRole: UserRole;
  action: ApprovalActionType;
  comment: string;
  timestamp: Date;
}

export const approvalActionSchema = new Schema<IApprovalAction>(
  {
    approvalRequestId: { type: Schema.Types.ObjectId, ref: 'ApprovalRequest', required: true },
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    actorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actorNameSnapshot: { type: String, required: true },
    actorRole: { type: String, enum: Object.values(UserRole), required: true },
    action: { type: String, enum: ['APPROVE', 'REJECT', 'RETURN'], required: true },
    comment: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ApprovalAction = mongoose.model<IApprovalAction>('ApprovalAction', approvalActionSchema);
