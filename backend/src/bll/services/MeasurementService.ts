import {MeasurementStats, PaginationResult, ThresholdExceedance} from "common/Results";
import {Measurement} from "common/entities/Measurement";
import {
    GetMeasurementDTO, MeasurementDTO,
    MeasurementFilterDTO,
} from "common/validation/schemas/measurementSchemas";

export default interface MeasurementService {
    getMeasurements(filter: GetMeasurementDTO): Promise<PaginationResult<Measurement[]>>;

    getMeasurement(measurement_id: string): Promise<Measurement | null>

    createMeasurement(measurement_id: Measurement): Promise<Measurement>

    updateMeasurement(measurement_id: Measurement): Promise<Measurement | null>

    deleteMeasurement(measurement_id: string): Promise<boolean>

    getLatest(): Promise<Measurement[]>;

    getStatistics(filter: MeasurementFilterDTO): Promise<MeasurementStats[]>;

    checkThresholds(measurement: Measurement): ThresholdExceedance[]
}