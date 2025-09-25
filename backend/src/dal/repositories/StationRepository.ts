import Station from "backend/dal/entities/Station";

export default interface StationRepository {
    updateLastMeasurement(station_id: string): Promise<void>;
    findNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]>;
}