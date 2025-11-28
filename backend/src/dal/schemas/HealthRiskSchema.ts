import mongoose from "mongoose";
import {HealthRisk} from "common/entities/HealthRisk";

export interface HealthRiskDocument extends HealthRisk, Document {
}

export const HealthRiskSchema = new mongoose.Schema<HealthRiskDocument>(
    {
        medium: {type: String, required: true },
        C: {type: Number, required: true},
        IR: {type: Number, required: true},
        EF: {type: Number, required: true},
        ED: {type: Number, required: true},
        BW: {type: Number, required: true},
        AT: {type: Number, required: true},
        RfC: {type: Number, required: true},
        SF: {type: Number, required: true},
        CDI: {type: Number, required: true},
        HQ: {type: Number, required: true},
        HI: {type: Number, required: true},
        CR: {type: Number, required: true},
        createdAt: {type: Date, required: true, default: () => new Date()}
    },
    {_id: false}
);

const HealthRiskModel = mongoose.model<HealthRiskDocument>('HealthRiskModel', HealthRiskSchema);
export default HealthRiskModel;
