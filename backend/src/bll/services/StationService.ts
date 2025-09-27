import Station, {Status} from "backend/dal/entities/Station";
import {PaginationResult} from "backend/bll/services/Results";
import {StationDTO} from "backend/bll/validation/schemas/stationSchemas";



export default interface StationService {
    getStations(filter: {city?: string, status?: Status, page?: number, limit?: number}): Promise<PaginationResult<Station[]>>;

    getStation(station_id: string): Promise<Station | null>

    createStation(station: StationDTO): Promise<Station>

    updateStation(station: StationDTO): Promise<Station | null>

    deleteStation(station_id: string): Promise<boolean>

    getStationsNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]>;
}