import Station, {Status} from "backend/dal/entities/Station";
import Repository from "backend/dal/repositories/Repository";


export default interface StationRepository extends Repository<Station> {
    updateLastMeasurement(station_id: string): Promise<void>;

    findNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]>;

    getStations(
        filter?: { city?: string; status?: Status },
        options?: { page?: number; limit?: number; sort?: Record<string, 1 | -1> }
    ): Promise<Station[]>;
}