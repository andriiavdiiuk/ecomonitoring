import StationRepository from "backend/dal/repositories/StationRepository";
import Station from "backend/dal/entities/Station";
import {MongoCrudRepository} from "backend/dal/repositories/MongoCrudRepository";
import StationModel, {StationDocument} from "backend/dal/schemas/StationSchema";

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
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: maxDistance
                }
            },
            status: 'active'
        }).exec();
    }
}