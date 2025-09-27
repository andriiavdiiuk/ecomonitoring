import {Measurement} from "backend/dal/entities/Measurement";
import Repository from "backend/dal/repositories/Repository";
import {MeasuredParameters, Pollutant} from "backend/dal/entities/Pollutant";
import {PaginationResult} from "backend/dal/repositories/Results";

export type MeasurementStats = {
    count: number;
    avg: number;
    min: number;
    max: number;
    latest: Date;
};

export default interface MeasurementRepository extends Repository<Measurement> {

    getLatestByStation(stationId: string): Promise<Measurement | null>;

    getStatistics(
        stationId: string,
        startDate: Date,
        endDate: Date,
        pollutant: string
    ): Promise<MeasurementStats[]>;

    getMeasurementsPaginated(
        filter: {
            station_id?: string,
            start_date?: Date,
            end_date?: Date,
            pollutant?: MeasuredParameters
        },
        options: { page?: number; limit?: number; sort?: Record<string, 1 | -1> }
    ): Promise<PaginationResult<Measurement[]>>;

    getLatest(): Promise<Measurement[]>;
}