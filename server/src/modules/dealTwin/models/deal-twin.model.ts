import mongoose, { Schema, Document } from 'mongoose';

export interface IDealTwinSimulation extends Document {
  quotationId: mongoose.Types.ObjectId;
  discountTweakPercent: number;
  volumeMultiplier: number;
  paymentTerms: string;
  projectedRevenue: number;
  projectedMarginPercent: number;
  winProbabilityPercent: number;
  governancePrediction: string;
  bestPathRecommendation: string;
  simulatedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const dealTwinSimulationSchema = new Schema<IDealTwinSimulation>(
  {
    quotationId: { type: Schema.Types.ObjectId, ref: 'Quotation', required: true },
    discountTweakPercent: { type: Number, required: true, default: 0 },
    volumeMultiplier: { type: Number, required: true, default: 1.0 },
    paymentTerms: { type: String, default: 'Net 30' },
    projectedRevenue: { type: Number, required: true },
    projectedMarginPercent: { type: Number, required: true },
    winProbabilityPercent: { type: Number, required: true },
    governancePrediction: { type: String, required: true },
    bestPathRecommendation: { type: String, required: true },
    simulatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const DealTwinSimulation = mongoose.model<IDealTwinSimulation>(
  'DealTwinSimulation',
  dealTwinSimulationSchema
);
