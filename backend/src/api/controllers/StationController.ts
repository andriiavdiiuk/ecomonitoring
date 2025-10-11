import StationService from "backend/bll/services/StationService";
import {Request, Response} from "express";
import {sendProblemDetail} from "backend/api/middleware/errorHandler";
import {
    GetStationsDTO,
    NearbyStationsDTO,
    StationDTO
} from "common/validation/schemas/stationSchemas";
import Station from "common/entities/Station";

export default class StationController {
    private readonly stationService: StationService

    constructor(stationService: StationService) {
        this.stationService = stationService;
    }

    async getStations(req: Request, res: Response,getStationsDto: GetStationsDTO): Promise<Response> {
        const stations = await this.stationService.getStations(getStationsDto);
        return res.status(200).json(stations);
    }

    async getStationById(req: Request, res: Response, id: string): Promise<Response> {
        const station = await this.stationService.getStation(id);

        if (!station) {
            sendProblemDetail(req, res, 404, "Station not found")
        }

        return res.status(200).json(station);
    }

    async createStation(req: Request, res: Response, stationDto: StationDTO): Promise<Response> {
        const station = await this.stationService.createStation(stationDto as Station);
        return res.status(201).json(station);
    }

    async updateStation(req: Request, res: Response, stationDto: StationDTO): Promise<Response> {
        const station = await this.stationService.updateStation(stationDto as Station);

        if (!station) {
            sendProblemDetail(req, res, 404, "Station not found")
        }

        return res.status(200).json(station);

    }

    async deleteStation(req: Request, res: Response, id: string): Promise<Response> {
        const deleted = await this.stationService.deleteStation(id);

        if (!deleted) {
            sendProblemDetail(req, res, 404, "Station not found")
        }

        return res.status(204).json();
    }

    async findNearbyStations(req: Request, res: Response, nearbyStationsDto: NearbyStationsDTO): Promise<Response>
    {
        const stations = await this.stationService.getStationsNearby( nearbyStationsDto.longitude,nearbyStationsDto.latitude,nearbyStationsDto.maxDistance);

        return res.status(200).json(stations);
    }
}