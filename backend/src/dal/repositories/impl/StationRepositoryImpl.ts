import StationRepository from "backend/dal/repositories/StationRepository";
import Station from "backend/dal/entities/Station";
import StationModel from "backend/dal/schemas/StationSchema";

export default class StationRepositoryImpl implements StationRepository {
    public async updateLastMeasurement(station_id: string): Promise<void>{
        await StationModel.updateOne(
            { station_id },
            {
                $set: {
                    'metadata.last_measurement': new Date(),
                    'metadata.updated_at': new Date()
                }
            }
        ).exec();
    }

    public async findNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]> {
        return await StationModel.find({
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