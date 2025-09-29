import express, {Request, Response} from "express";

import {authMiddleware} from "backend/api/middleware/authMiddleware";
import {Roles} from "backend/dal/entities/Roles";
import {RequestSource, validationMiddleware} from "backend/api/middleware/validationMiddleware";
import {
    GetStationsQuerySchema,
    NearbyStationsParamsSchema,
    StationIdParamsSchema,
    StationSchema,
    UpdateStationSchema
} from "backend/bll/validation/schemas/stationSchemas";
import MeasurementController from "backend/api/controllers/MeasurementController";
import {MeasurementServiceImpl} from "backend/bll/services/impl/MeasurementServiceImpl";
import {MeasurementRepositoryImpl} from "backend/dal/repositories/impl/MeasurementRepositoryImpl";
import {
    GetMeasurementsSchema, MeasurementDTO, MeasurementFilterSchema,
    MeasurementIdParamsSchema,
    MeasurementSchema, UpdateMeasurementSchema
} from "backend/bll/validation/schemas/measurementSchemas";
import {Measurement} from "backend/dal/entities/Measurement";

const stationsRoutes = express.Router();
const measurementRepository = new MeasurementRepositoryImpl()
const measurementService = new MeasurementServiceImpl(measurementRepository);
const measurementController = new MeasurementController(measurementService);
stationsRoutes.get("/api/measurements",
    validationMiddleware(GetMeasurementsSchema, RequestSource.Query),
    async (req: Request, res: Response): Promise<Response> => {
        const dto = GetMeasurementsSchema.parse(req.query);
        return await measurementController.getMeasurements(req, res, dto);
    }
);

stationsRoutes.get("/api/measurement/latest",
    async (req: Request, res: Response): Promise<Response> => {
        return await measurementController.getLatest(req, res);
    }
);

stationsRoutes.get("/api/measurement/statistics",
    validationMiddleware(MeasurementFilterSchema, RequestSource.Query),
    async (req: Request, res: Response): Promise<Response> => {
        const dto = MeasurementFilterSchema.parse(req.query);
        return await measurementController.getStatistics(req, res, dto);
    }
);

stationsRoutes.get("/api/measurement/:id",
    validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
    async (req: Request, res: Response): Promise<Response> => {
        const {id} = MeasurementIdParamsSchema.parse(req.params);
        return await measurementController.getMeasurementById(req, res, id);
    }
);

stationsRoutes.post("/api/measurement",
    authMiddleware([Roles.Admin]),
    validationMiddleware(MeasurementSchema),
    async (req: Request, res: Response): Promise<Response> => {
        const dto: Measurement = MeasurementSchema.parse(req.body) as Measurement;
        return await measurementController.createMeasurement(req, res, dto);
    }
);

stationsRoutes.put("/api/measurement/:id",
    authMiddleware([Roles.Admin]),
    validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
    validationMiddleware(UpdateMeasurementSchema),
    async (req: Request, res: Response): Promise<Response> => {
        const {id} = MeasurementIdParamsSchema.parse(req.params);
        const dto: Measurement = UpdateMeasurementSchema.parse(req.body) as Measurement;
        dto.id = id;
        return await measurementController.updateMeasurement(req, res, dto);
    }
);

stationsRoutes.delete("/api/measurement/:id",
    authMiddleware([Roles.Admin]),
    validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
    async (req: Request, res: Response): Promise<Response> => {
        const {id} = MeasurementIdParamsSchema.parse(req.params);
        return await measurementController.deleteMeasurement(req, res, id);
    }
);




export default stationsRoutes;