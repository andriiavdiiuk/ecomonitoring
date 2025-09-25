import {Status} from "backend/dal/entities/Station";
import {Pollutant} from "backend/dal/entities/Pollutant";

export interface Measurement {
    station_id: string;
    status?: Status;
    measurement_time: Date;
    pollutants: Pollutant[];
    metadata: {
        source: string;
        import_time: Date;
        original_data?: Date;
        processing_notes?: string;
    };
}