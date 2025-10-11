import {Status} from "common/entities/Station";
import {type Pollutant} from "common/entities/Pollutant"

export interface Measurement {
    _id: string,
    station_id: string;
    status: Status;
    measurement_time: Date;
    pollutants: Pollutant[];
    metadata: {
        source: string;
        import_time: Date;
        original_data?: unknown;
        processing_notes?: string;
    };
}