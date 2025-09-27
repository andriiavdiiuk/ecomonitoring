import {PaginationResult} from "backend/dal/repositories/Results";
import {Measurement} from "backend/dal/entities/Measurement";
import {MeasurementStats} from "backend/dal/repositories/MeasurementRepository";
import {
    GetMeasurementDTO, MeasurementDTO,
    MeasurementFilterDTO,
} from "backend/bll/validation/schemas/measurementSchemas";

export enum Severity {
    Normal = "normal",
    Warning = "warning",
    Alert = "alert",
    Emergency = "emergency",
}

export type ThresholdExceedance = {
    pollutant: string;
    value: number;
    threshold: number;
    severity: Severity;
    ratio: string;
}



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