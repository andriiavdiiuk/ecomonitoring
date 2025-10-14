import express, {Request, Response, Router} from "express";

import {authMiddleware} from "backend/api/middleware/authMiddleware";
import Roles from "common/entities/Roles";
import {RequestSource, validationMiddleware} from "backend/api/middleware/validationMiddleware";
import {
    GetStationsQuerySchema,
    NearbyStationsParamsSchema,
    StationIdParamsSchema,
    StationSchema,
    UpdateStationSchema
} from "common/validation/schemas/stationSchemas";
import MeasurementController from "backend/api/controllers/MeasurementController";
import {MeasurementServiceImpl} from "backend/bll/services/impl/MeasurementServiceImpl";
import {MeasurementRepositoryImpl} from "backend/dal/repositories/impl/MeasurementRepositoryImpl";
import {
    GetMeasurementsSchema, MeasurementDTO, MeasurementFilterSchema,
    MeasurementIdParamsSchema,
    MeasurementSchema, UpdateMeasurementSchema
} from "common/validation/schemas/measurementSchemas";
import {Measurement} from "common/entities/Measurement";
import Config from "backend/api/configuration/config";
import JwtUtils from "backend/api/security/JwtUtils";


export default function createMeasurementRoutes(config: Config): Router {
    const measurementRoutes = express.Router();
    const measurementRepository = new MeasurementRepositoryImpl()
    const measurementService = new MeasurementServiceImpl(measurementRepository);
    const measurementController = new MeasurementController(measurementService);
    const jwtUtils = new JwtUtils(config);

    measurementRoutes.get("/api/measurements",
        validationMiddleware(GetMeasurementsSchema, RequestSource.Query),
        async (req: Request, res: Response): Promise<Response> => {
            const dto = GetMeasurementsSchema.parse(req.query);
            return await measurementController.getMeasurements(req, res, dto);
        }
    );

    measurementRoutes.get("/api/measurement/latest",
        async (req: Request, res: Response): Promise<Response> => {
            return await measurementController.getLatest(req, res);
        }
    );

    measurementRoutes.get("/api/measurement/statistics",
        validationMiddleware(MeasurementFilterSchema, RequestSource.Query),
        async (req: Request, res: Response): Promise<Response> => {
            const dto = MeasurementFilterSchema.parse(req.query);
            return await measurementController.getStatistics(req, res, dto);
        }
    );

    measurementRoutes.get("/api/measurement/:id",
        validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
        async (req: Request, res: Response): Promise<Response> => {
            const {id} = MeasurementIdParamsSchema.parse(req.params);
            return await measurementController.getMeasurementById(req, res, id);
        }
    );

    measurementRoutes.post("/api/measurement",
        authMiddleware(jwtUtils, [Roles.Admin]),
        validationMiddleware(MeasurementSchema),
        async (req: Request, res: Response): Promise<Response> => {
            const dto: Measurement = MeasurementSchema.parse(req.body) as Measurement;
            return await measurementController.createMeasurement(req, res, dto);
        }
    );

    measurementRoutes.put("/api/measurement/:id",
        authMiddleware(jwtUtils, [Roles.Admin]),
        validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
        validationMiddleware(UpdateMeasurementSchema),
        async (req: Request, res: Response): Promise<Response> => {
            const {id} = MeasurementIdParamsSchema.parse(req.params);
            const dto: Measurement = UpdateMeasurementSchema.parse(req.body) as Measurement;
            dto._id = id;
            return await measurementController.updateMeasurement(req, res, dto);
        }
    );

    measurementRoutes.delete("/api/measurement/:id",
        authMiddleware(jwtUtils, [Roles.Admin]),
        validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
        async (req: Request, res: Response): Promise<Response> => {
            const {id} = MeasurementIdParamsSchema.parse(req.params);
            return await measurementController.deleteMeasurement(req, res, id);
        }
    );

    return measurementRoutes
}