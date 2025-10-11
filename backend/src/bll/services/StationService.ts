import Station from "common/entities/Station";
import {PaginationResult} from "common/Results";
import {GetStationsDTO, StationDTO} from "common/validation/schemas/stationSchemas";

export default interface StationService {
    getStations(filter: GetStationsDTO): Promise<PaginationResult<Station[]>>;

    getStation(station_id: string): Promise<Station | null>

    createStation(station: Station): Promise<Station>

    updateStation(station: Station): Promise<Station | null>

    deleteStation(station_id: string): Promise<boolean>

    getStationsNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]>;
}