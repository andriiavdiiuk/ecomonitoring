import {MeasurementStats, PaginationResult, Severity, ThresholdExceedance} from "common/Results";
import MeasurementService from "backend/bll/services/MeasurementService";
import {Measurement} from "common/entities/Measurement";
import {MeasuredParameters} from "common/entities/Pollutant";
import MeasurementRepository from "backend/dal/repositories/MeasurementRepository";
import {
    GetMeasurementDTO,
    MeasurementFilterDTO,
} from "common/validation/schemas/measurementSchemas";

export class MeasurementServiceImpl implements MeasurementService {
    private readonly measurementRepository: MeasurementRepository

    constructor(measurementRepository: MeasurementRepository) {
        this.measurementRepository = measurementRepository;

    }

    public async getMeasurements(filter: GetMeasurementDTO): Promise<PaginationResult<Measurement[]>> {
        const page = filter.page ?? 1;
        const limit = filter.limit ?? 50;

        return await
            this.measurementRepository.getMeasurementsPaginated({
                station_id: filter.station_id,
                end_date: filter.end_date,
                start_date: filter.start_date,
                pollutant: filter.pollutant
            }, {page: page, limit: limit});

    }

    public async getMeasurement(measurement_id: string): Promise<Measurement | null> {
        return await this.measurementRepository.find(measurement_id);
    }

    public async createMeasurement(measurement: Measurement): Promise<Measurement> {
        return await this.measurementRepository.create(measurement);
    }

    public async updateMeasurement(measurement: Measurement): Promise<Measurement | null> {
        return await this.measurementRepository.update(measurement._id, measurement);
    }

    public async deleteMeasurement(id: string): Promise<boolean> {
        return await this.measurementRepository.delete(id);
    }

    public async getLatest(): Promise<Measurement[]> {
        return await this.measurementRepository.getLatest();
    }

    public async getStatistics(filter: MeasurementFilterDTO): Promise<MeasurementStats[]> {
        return await this.measurementRepository.getStatistics(filter.station_id, filter.startDate, filter.endDate, filter.pollutant);
    }

    public checkThresholds(measurement: Measurement): ThresholdExceedance[] {
        const thresholds: Partial<Record<MeasuredParameters, { warning: number; alert: number; emergency: number }>> = {
            [MeasuredParameters.PM25]: {warning: 25, alert: 35, emergency: 75},
            [MeasuredParameters.PM10]: {warning: 50, alert: 75, emergency: 150},
            [MeasuredParameters.AirQualityIndex]: {warning: 50, alert: 100, emergency: 150},
        };

        const exceedances: ThresholdExceedance[] = [];

        measurement.pollutants.forEach(p => {
            const threshold = thresholds[p.pollutant];
            if (!threshold) return;

            let severity: Severity = Severity.Normal;
            if (p.value > threshold.emergency) severity = Severity.Emergency;
            else if (p.value > threshold.alert) severity = Severity.Alert;
            else if (p.value > threshold.warning) severity = Severity.Warning;

            if (severity !== Severity.Normal) {
                exceedances.push({
                    pollutant: p.pollutant,
                    value: p.value,
                    threshold: threshold[severity],
                    severity,
                    ratio: (p.value / threshold[severity]).toFixed(2),
                });
            }
        });

        return exceedances;
    }
}
