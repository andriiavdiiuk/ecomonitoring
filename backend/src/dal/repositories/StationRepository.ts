import Station from "backend/dal/entities/Station";
import Repository from "backend/dal/repositories/Repository";

export default interface StationRepository extends Repository<Station>{
    updateLastMeasurement(station_id: string): Promise<void>;
    findNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]>;
}