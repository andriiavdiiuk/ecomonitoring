import Station from "backend/dal/entities/Station";
import {PaginationResult} from "backend/bll/services/Results";
import {GetStationsDTO, StationDTO} from "backend/bll/validation/schemas/stationSchemas";



export default interface StationService {
    getStations(filter: GetStationsDTO): Promise<PaginationResult<Station[]>>;

    getStation(station_id: string): Promise<Station | null>

    createStation(station: StationDTO): Promise<Station>

    updateStation(station: StationDTO): Promise<Station | null>

    deleteStation(station_id: string): Promise<boolean>

    getStationsNearby(longitude: number, latitude: number, maxDistance: number): Promise<Station[]>;
}