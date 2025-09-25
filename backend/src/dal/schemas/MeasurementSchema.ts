import mongoose from "mongoose";
import {Measurement} from "backend/dal/entities/Measurement";
import {Status} from "backend/dal/entities/Station";
import PollutantSchema from "backend/dal/schemas/PollutantSchema";

export interface MeasurementDocument extends Measurement, Document {}

const MeasurementSchema = new mongoose.Schema<MeasurementDocument>({
        station_id: {
            type: String,
            required: true,
            index: true
        },
        status: {
            type: String,
            enum: Object.values(Status),
            default: Status.Active
        },
        measurement_time: {
            type: Date,
            required: true,
            index: true
        },
        pollutants: [PollutantSchema],
        metadata: {
            source: {
                type: String,
                default: 'SaveEcoBot'
            },
            import_time: {
                type: Date,
                default: Date.now
            },
            original_data: mongoose.Schema.Types.Mixed,
            processing_notes: String,
        },
    }, {timestamps: true}
);

MeasurementSchema.index({station_id: 1, measurement_time: -1});
MeasurementSchema.index({measurement_time: -1});
MeasurementSchema.index({'pollutants.pollutant': 1, measurement_time: -1});

MeasurementSchema.index({station_id: 1, measurement_time: 1}, {unique: true});

const MeasurementModel = mongoose.model<MeasurementDocument>('MeasurementModel', MeasurementSchema);

export default MeasurementModel;
