import express from "express";

import StationRepositoryImpl from "backend/dal/repositories/impl/StationRepositoryImpl";
import {authMiddleware} from "backend/api/middleware/authMiddleware";
import {Roles} from "backend/dal/entities/Roles";
import StationController from "backend/api/controllers/StationController";
import {StationServiceImpl} from "backend/bll/services/impl/StationServiceImpl";
import {RequestSource, validationMiddleware} from "backend/api/middleware/validationMiddleware";
import {
    GetStationsQuerySchema,
    NearbyStationsParamsSchema,
    StationIdParamsSchema,
    StationSchema,
    UpdateStationSchema
} from "backend/bll/validation/schemas/stationSchemas";

const stationsRoutes = express.Router();
const stationRepository = new StationRepositoryImpl()
const stationService = new StationServiceImpl(stationRepository);
const stationController = new StationController(stationService);

stationsRoutes.get("/api/stations",
    validationMiddleware(GetStationsQuerySchema, RequestSource.Query),
    stationController.getStations.bind(stationController));

stationsRoutes.get("/api/station/:id",
    validationMiddleware(StationIdParamsSchema, RequestSource.Params),
    stationController.getStationById.bind(stationController));

stationsRoutes.post("/api/station",
    authMiddleware([Roles.Admin]),
    validationMiddleware(StationSchema),
    stationController.createStation.bind(stationController));

stationsRoutes.put("/api/station/:id",
    authMiddleware([Roles.Admin]),
    validationMiddleware(StationIdParamsSchema, RequestSource.Params),
    validationMiddleware(UpdateStationSchema),
    stationController.updateStation.bind(stationController));

stationsRoutes.delete("/api/station/:id",
    authMiddleware([Roles.Admin]),
    validationMiddleware(StationIdParamsSchema, RequestSource.Params),
    stationController.deleteStation.bind(stationController));

stationsRoutes.get("/api/station/nearby/:longitude/:latitude/:maxDistance",
    validationMiddleware(NearbyStationsParamsSchema, RequestSource.Params),
    stationController.findNearbyStations.bind(stationController));
export default stationsRoutes;