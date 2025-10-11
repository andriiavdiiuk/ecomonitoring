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
        filter: { city?: string; status?: Status } = {},
        options: { page?: number; limit?: number; sort?: Record<string, 1 | -1> } = {}
    ): Promise<PaginationResult<Station[]>> {
        const page = options.page ?? 1;
        const limit = options.limit ?? 50;
        const sort = options.sort ?? { city_name: 1, station_name: 1 };

        const query: Partial<Station> = {};
        if (filter.city) query.city_name = filter.city
        if (filter.status) query.status = filter.status;

        const [data, total] =  await Promise.all([
            this.model.find(filter)
                .sort(sort)
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