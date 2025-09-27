import {Measurement} from "backend/dal/entities/Measurement";
import MeasurementRepository, {
    MeasurementStats,
} from "backend/dal/repositories/MeasurementRepository";
import {MeasuredParameters, Pollutant} from "backend/dal/entities/Pollutant";
import {MongoCrudRepository} from "backend/dal/repositories/MongoCrudRepository";
import MeasurementModel, {MeasurementDocument} from "backend/dal/schemas/MeasurementSchema";
import mongoose from "mongoose";
import {PaginationResult} from "backend/dal/repositories/Results";

export class MeasurementRepositoryImpl extends MongoCrudRepository<MeasurementDocument> implements MeasurementRepository {
    constructor() {
        super(MeasurementModel);
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
        return await this.model.aggregate([
            {
                $match: {
                    station_id: stationId,
                    measurement_time: {$gte: startDate, $lte: endDate},
                    'pollutants.pollutant': pollutant
                }
            },
            {$unwind: '$pollutants'},
            {$match: {'pollutants.pollutant': pollutant}},
            {
                $group: {
                    _id: null,
                    count: {$sum: 1},
                    avg: {$avg: '$pollutants.value'},
                    min: {$min: '$pollutants.value'},
                    max: {$max: '$pollutants.value'},
                    latest: {$last: '$measurement_time'}
                }
            }
        ]).exec() as MeasurementStats[];
    }

    public async getMeasurementsPaginated(
        filter: {
            station_id?: string,
            start_date?: Date,
            end_date?: Date,
            pollutant?: MeasuredParameters
        },
        options: { page?: number; limit?: number; sort?: Record<string, 1 | -1> }
    ): Promise<PaginationResult<Measurement[]>> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 50;

        const query: mongoose.FilterQuery<Measurement> = {};

        if (filter.station_id) query.station_id = filter.station_id;
        if (filter.pollutant) query["pollutants.pollutant"] = filter.pollutant;
        if (filter.start_date || filter.end_date) {
            query.measurement_time = {};
            if (filter.start_date) query.measurement_time.$gte = filter.start_date;
            if (filter.end_date) query.measurement_time.$lte = filter.end_date;
        }
        const [data, total] = await Promise.all([
            this.model.find(query)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.count(query)
        ]);

        return {
            data: data,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            }
        }
    }

    public async getLatest(): Promise<Measurement[]> {
        return await this.model.aggregate([
            {
                $sort: {measurement_time: -1}
            },
            {
                $group: {
                    _id: '$station_id',
                    latest_measurement: {$first: '$$ROOT'}
                }
            },
            {
                $replaceRoot: {newRoot: '$latest_measurement'}
            }
        ]).exec() as Measurement[];
    }

}