import StationService from "backend/bll/services/StationService";
import Station from "common/entities/Station";
import StationRepository from "backend/dal/repositories/StationRepository";
import {PaginationResult} from "common/Results";
import {GetStationsDTO, StationDTO} from "common/validation/schemas/stationSchemas";

export class StationServiceImpl implements StationService {
    private readonly stationRepository: StationRepository

    constructor(stationRepository: StationRepository) {
        this.stationRepository = stationRepository;

    }

    async getStations(filter: GetStationsDTO): Promise<PaginationResult<Station[]>> {
        const { page = 1, limit = 50, ...query } = filter;
        return await this.stationRepository.getStationsPaginated(query, {page: page, limit: limit});
    }

    async getStation(station_id: string): Promise<Station | null> {
        return await this.stationRepository.findOneBy({station_id: station_id});
    }

    async createStation(station: Station): Promise<Station> {
        return await this.stationRepository.create(station);
    }

    async updateStation(station: Station): Promise<Station | null> {
        return await this.stationRepository.updateBy({station_id: station.station_id}, station);
    }

    async deleteStation(id: string): Promise<boolean> {
        return await this.stationRepository.deleteBy({station_id: id});
    }

    async getStationsNearby(longitude: number, latitude: number, maxDistance:number = 10000): Promise<Station[]> {
        return await this.stationRepository.findNearby(longitude, latitude, maxDistance);
    }
}
