import Station, {Status} from "backend/dal/entities/Station";
import Repository from "backend/dal/repositories/Repository";
import {PaginationResult} from "backend/dal/repositories/Results";


export default interface StationRepository extends Repository<Station> {
    updateLastMeasurement(station_id: string): Promise<void>;

    findNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]>;

    getStationsPaginated(
        filter?: { city?: string; status?: Status },
        options?: { page?: number; limit?: number; sort?: Record<string, 1 | -1> }
    ): Promise<PaginationResult<Station[]>>;
}