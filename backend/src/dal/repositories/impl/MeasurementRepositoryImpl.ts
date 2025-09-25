import {Measurement} from "backend/dal/entities/Measurement";
import MeasurementRepository, {MeasurementStats, Severity, ThresholdExceedance} from "backend/dal/repositories/MeasurementRepository";
import {MeasuredParameters} from "backend/dal/entities/Pollutant";
import {MongoCrudRepository} from "backend/dal/repositories/MongoCrudRepository";
import MeasurementModel, {MeasurementDocument} from "backend/dal/schemas/MeasurementSchema";

export class MeasurementRepositoryImpl extends MongoCrudRepository<MeasurementDocument> implements MeasurementRepository {
    constructor() {
        super(MeasurementModel);
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

    public async getLatestByStation(stationId: string): Promise<Measurement | null> {
        return await this.model.findOne({station_id: stationId})
            .sort({measurement_time: -1})
            .exec();
    }

    public async getStatistics(
        stationId: string,
        startDate: Date,
        endDate: Date,
        pollutant: MeasuredParameters
    ): Promise<MeasurementStats[]> {
        const matchStage = {
            station_id: stationId,
            measurement_time: {$gte: startDate, $lte: endDate},
            'pollutants.pollutant': pollutant,
        };

        return await this.model.aggregate([
            {$match: matchStage},
            {$unwind: '$pollutants'},
            {$match: {'pollutants.pollutant': pollutant}},
            {
                $group: {
                    _id: null,
                    count: {$sum: 1},
                    avg: {$avg: '$pollutants.value'},
                    min: {$min: '$pollutants.value'},
                    max: {$max: '$pollutants.value'},
                    latest: {$last: '$measurement_time'},
                },
            },
        ]).exec() as MeasurementStats[];
    }
}