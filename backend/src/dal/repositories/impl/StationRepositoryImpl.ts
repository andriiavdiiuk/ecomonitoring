import StationRepository from "backend/dal/repositories/StationRepository";
import Station, {Status} from "common/entities/Station";
import {MongoCrudRepository} from "backend/dal/repositories/MongoCrudRepository";
import StationModel, {StationDocument} from "backend/dal/schemas/StationSchema";
import {PaginationResult} from "common/Results";

export default class StationRepositoryImpl extends MongoCrudRepository<StationDocument> implements StationRepository {

    constructor() {
        super(StationModel);
    }
    public async updateLastMeasurement(station_id: string): Promise<void> {
        await this.model.updateOne(
            {station_id},
            {
                $set: {
                    'metadata.last_measurement': new Date(),
                    'metadata.updated_at': new Date()
                }
            }
        ).exec();
    }

    public async findNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]> {
        return await this.model.find({
            geolocation: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistance
                }
            },
            status: Status.Active
        }).exec();
    }

    async getStationsPaginated(
        filter: Partial<Station> = {},
        options: { page?: number; limit?: number; sort?: Record<string, 1 | -1> } = {}
    ): Promise<PaginationResult<Station[]>> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 50;

        const { geolocation, measured_parameters, ...rest } = filter;

        const fuzzyFilter: Record<string, unknown> = Object.fromEntries(
            Object.entries(rest).map(([key, value]) => {
                if (typeof value === "string") {
                    return [key, { $regex: value, $options: "i" }]
                }
                return [key, value]
            })
        ) as Record<string, unknown>;

        if (measured_parameters && measured_parameters.length > 0) {
            fuzzyFilter.measured_parameters = { $in: measured_parameters }
        }

        if (geolocation?.coordinates.length === 2) {
            fuzzyFilter.geolocation = geolocation
        }

        const [data, total] =  await Promise.all([
            this.model.find(fuzzyFilter)
                .sort(options.sort)
                .skip((page - 1) * limit)
                .limit(limit)
                .exec(),
            this.count(filter)
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
}