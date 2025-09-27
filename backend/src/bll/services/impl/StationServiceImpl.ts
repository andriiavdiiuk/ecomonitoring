import StationService from "backend/bll/services/StationService";
import Station, {Status} from "backend/dal/entities/Station";
import StationRepository from "backend/dal/repositories/StationRepository";
import {PaginationResult} from "backend/bll/services/Results";
import {StationDTO} from "backend/bll/validation/schemas/stationSchemas";

export class StationServiceImpl implements StationService {
    private readonly stationRepository: StationRepository

    constructor(stationRepository: StationRepository) {
        this.stationRepository = stationRepository;

    }

    async getStations(filter: {
        city?: string;
        status?: Status;
        page?: number;
        limit?: number;
    }): Promise<PaginationResult<Station[]>> {
        const page = filter.page ?? 1;
        const limit = filter.limit ?? 50;


        const query: Partial<Station> = {};
        if (filter.city) query.city_name = filter.city
        if (filter.status) query.status = filter.status;


        const [stations, total] = await Promise.all([
            this.stationRepository.getStations(query, {page: page, limit: limit}),
            this.stationRepository.count(query)
        ]);

        return {
            stations,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit),
            },
        };
    }

    async getStation(station_id: string): Promise<Station | null> {
        return await this.stationRepository.findOneBy({station_id: station_id});
    }

    async createStation(station: StationDTO): Promise<Station> {
        return await this.stationRepository.create(station);
    }

    async updateStation(station: StationDTO): Promise<Station | null> {
        return await this.stationRepository.updateBy({station_id: station.station_id}, station);
    }

    async deleteStation(id: string): Promise<boolean> {
        return await this.stationRepository.deleteBy({station_id: id});
    }

    async getStationsNearby(longitude: number, latitude: number, maxDistance:number = 10000): Promise<Station[]> {
        return await this.stationRepository.findNearby(longitude, latitude, maxDistance);
    }
}
