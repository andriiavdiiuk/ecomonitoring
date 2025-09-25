import {Measurement} from "backend/dal/entities/Measurement";
import Repository from "backend/dal/repositories/Repository";
import Station from "backend/dal/entities/Station";

export enum Severity {
    Normal = "normal",
    Warning= "warning",
    Alert="alert",
    Emergency= "emergency",
}

export type ThresholdExceedance = {
    pollutant: string;
    value: number;
    threshold: number;
    severity: Severity;
    ratio: string;
}

export type MeasurementStats = {
    count: number;
    avg: number;
    min: number;
    max: number;
    latest: Date;
};

export default interface MeasurementRepository extends Repository<Measurement> {
    checkThresholds(measurement: Measurement): ThresholdExceedance[];
    getLatestByStation(stationId: string): Promise<Measurement | null>;
    getStatistics(
        stationId: string,
        startDate: Date,
        endDate: Date,
        pollutant: string
    ): Promise<MeasurementStats[]>;
}