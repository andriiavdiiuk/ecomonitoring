import express, {Request, Response, Router} from "express";

import StationRepositoryImpl from "backend/dal/repositories/impl/StationRepositoryImpl";
import {authMiddleware} from "backend/api/middleware/authMiddleware";
import Roles from "common/entities/Roles";
import StationController from "backend/api/controllers/StationController";
import {StationServiceImpl} from "backend/bll/services/impl/StationServiceImpl";
import {RequestSource, validationMiddleware} from "backend/api/middleware/validationMiddleware";
import {
    GetStationsDTO,
    GetStationsQuerySchema, NearbyStationsDTO,
    NearbyStationsParamsSchema, StationDTO,
    StationIdParamsSchema,
    StationSchema,
    UpdateStationSchema
} from "common/validation/schemas/stationSchemas";
import JwtUtils from "backend/api/security/JwtUtils";
import Config from "backend/api/configuration/config";

export default function createStationRoutes(config: Config): Router {

    const stationsRoutes = express.Router();
    const stationRepository = new StationRepositoryImpl()
    const stationService = new StationServiceImpl(stationRepository);
    const stationController = new StationController(stationService);
    const jwtUtils = new JwtUtils(config);

    stationsRoutes.get("/api/stations",
        validationMiddleware(GetStationsQuerySchema, RequestSource.Query),
        async (req: Request, res: Response): Promise<Response> => {
            const dto: GetStationsDTO = GetStationsQuerySchema.parse(req.query);
            return await stationController.getStations(req, res, dto);
        });

    stationsRoutes.get("/api/station/nearby/:longitude/:latitude/:maxDistance",
        validationMiddleware(NearbyStationsParamsSchema, RequestSource.Params),
        async (req: Request, res: Response): Promise<Response> => {
            const params: NearbyStationsDTO = NearbyStationsParamsSchema.parse(req.params);
            return await stationController.findNearbyStations(req, res, params);
        });

    stationsRoutes.get("/api/station/:id",
        validationMiddleware(StationIdParamsSchema, RequestSource.Params),
        async (req: Request, res: Response): Promise<Response> => {
            const {id} = StationIdParamsSchema.parse(req.params);
            return await stationController.getStationById(req, res, id);
        });

    stationsRoutes.post("/api/station",
        authMiddleware(jwtUtils, [Roles.Admin]),
        validationMiddleware(StationSchema),
        async (req: Request, res: Response): Promise<Response> => {
            const dto: StationDTO = StationSchema.parse(req.body);
            return await stationController.createStation(req, res, dto);
        });

    stationsRoutes.put("/api/station/:id",
        authMiddleware(jwtUtils, [Roles.Admin]),
        validationMiddleware(StationIdParamsSchema, RequestSource.Params),
        validationMiddleware(UpdateStationSchema),
        async (req: Request, res: Response): Promise<Response> => {
            const {id} = StationIdParamsSchema.parse(req.params);
            const dto: StationDTO = UpdateStationSchema.parse(req.body) as StationDTO;
            dto.station_id = id;
            return await stationController.updateStation(req, res, dto);
        });

    stationsRoutes.delete("/api/station/:id",
        authMiddleware(jwtUtils, [Roles.Admin]),
        validationMiddleware(StationIdParamsSchema, RequestSource.Params),
        async (req: Request, res: Response): Promise<Response> => {
            const {id} = StationIdParamsSchema.parse(req.params);
            return await stationController.deleteStation(req, res, id);
        });

    return stationsRoutes;
}