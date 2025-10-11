import mongoose from 'mongoose'
import Station, {Status} from "common/entities/Station";
import {MeasuredParameters} from "common/entities/Pollutant";

export interface StationDocument extends Station, Document {}

const StationSchema = new mongoose.Schema<StationDocument>({

    station_id: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true
    },

    city_name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },

    station_name: {
        type: String,
        required: true,
        trim: true
    },

    local_name: {
        type: String,
        trim: true
    },

    timezone: {
        type: String,
        default: '+0300'
    },

    geolocation: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true,
            validate: {
                validator: function(coords: number[]): boolean {
                    return coords.length === 2 &&
                        coords[0] >= -180 && coords[0] <= 180 &&
                        coords[1] >= -90 && coords[1] <= 90;
                },
                message: 'Invalid coordinates format'
            }
        }
    },


    platform_name: {
        type: String,
        default: 'SaveEcoBot'
    },


    status: {
        type: String,
        enum: Object.values(Status),
        default: Status.Active
    },


    measured_parameters: [{
        type: String,
        enum: Object.values(MeasuredParameters),
    }],


    metadata: {
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        data_source: { type: String, default: 'SaveEcoBot' },
        last_measurement: Date
    },
}, {
    timestamps: true
});


StationSchema.index({ geolocation: '2dsphere' });
StationSchema.index({ city_name: 1, status: 1 });
StationSchema.index({ 'metadata.last_measurement': -1 });

const StationModel = mongoose.model<StationDocument>('StationModel', StationSchema);

export default StationModel;