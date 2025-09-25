import mongoose from "mongoose";
import {AveragingPeriod, MeasuredParameters, Pollutant, QualityFlag, Unit} from "../entities/Pollutant";

export interface PollutantDocument extends Pollutant, Document {}

const PollutantSchema = new mongoose.Schema<PollutantDocument>(
    {
        pollutant: {
            type: String,
            required: true,
            enum: Object.values(MeasuredParameters),
        },
        value: {
            type: Number,
            required: true },
        unit: {
            type: String,
            required: true,
            enum: Object.values(Unit),
        },
        averaging_period: {
            type: String,
            default: AveragingPeriod.TwoMinutes,
            enum:  Object.values(AveragingPeriod),
        },
        quality_flag: {
            type: String,
            default: QualityFlag.Preliminary,
            enum: Object.values(QualityFlag),
        },
    },
    { _id: false }
);

const PollutantModel = mongoose.model<PollutantDocument>('PollutantModel',PollutantSchema);
export default PollutantModel;