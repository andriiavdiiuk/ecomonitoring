import {type Measurement} from "common/entities/Measurement";

export type ProblemDetailErrors<T> = {
    [K in keyof T]?: T[K] extends object ? ProblemDetailErrors<T[K]> : string[] | undefined
};

export interface ProblemDetail<T> {
    type: string;
    status: number;
    title: string;
    detail: string;
    instance: string;
    errors?: ProblemDetailErrors<T>;
}

export interface PaginationResult<T> {
    data: T,
    pagination: {
        page: number,
        limit: number
        total: number
        pages: number
    }
}

export interface MeasurementStats {
    count: number;
    avg: number;
    min: number;
    max: number;
    latest: Date;
};

export enum Severity {
    Normal = "normal",
    Warning = "warning",
    Alert = "alert",
    Emergency = "emergency",
}

export interface ThresholdExceedance {
    pollutant: string;
    value: number;
    threshold: number;
    severity: Severity;
    ratio: string;
}

export interface MeasurementThreshold {
    measurement: Measurement,
    thresholds: ThresholdExceedance[],
}