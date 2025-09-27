import StationService from "backend/bll/services/StationService";
import {Request, Response} from "express";
import {Status} from "backend/dal/entities/Station";
import {sendProblemDetail} from "backend/api/middleware/errorHandler";
import {StationDTO} from "backend/bll/validation/schemas/stationSchemas";

export default class StationController {
    private readonly stationService: StationService

    constructor(stationService: StationService) {
        this.stationService = stationService;
    }

    async getStations(req: Request, res: Response): Promise<Response> {
        const city = req.query.city as string | undefined;
        const status = req.query.status as Status | undefined;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 50;

        const filter = {
            city: city,
            status: status,
            page: page,
            limit: limit
        };

        const stations = await this.stationService.getStations(filter);

        return res.json(stations);
    }

    async getStationById(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const station = await this.stationService.getStation(id);

        if (!station) {
            sendProblemDetail(req, res, 404, "Station not found")
        }

        return res.json(station);
    }

    async createStation(req: Request, res: Response): Promise<Response> {
        const stationData = req.body as StationDTO;

        const station = await this.stationService.createStation(stationData);
        return res.status(201).json(station);

    }

    async updateStation(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;
        const updateData = req.body as StationDTO;

        updateData.station_id = id;

        const station = await this.stationService.updateStation(updateData);

        if (!station) {
            sendProblemDetail(req, res, 404, "Station not found")
        }

        return res.status(200).json(station);

    }

    async deleteStation(req: Request, res: Response): Promise<Response> {
        const {id} = req.params;

        const deleted = await this.stationService.deleteStation(id);

        if (!deleted) {
            sendProblemDetail(req, res, 404, "Station not found")
        }

        return res.status(200).json();
    }

    async findNearbyStations(req: Request, res: Response): Promise<Response>
    {
        const {longitude, latitude, maxDistance} = req.params;

        const stations = await this.stationService.getStationsNearby( parseFloat(longitude), parseFloat(latitude), parseFloat(maxDistance));

        return res.status(200).json(stations);
    }
}