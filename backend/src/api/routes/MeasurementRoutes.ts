import express from "express";

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
    GetMeasurementsSchema, MeasurementFilterSchema,
    MeasurementIdParamsSchema,
    MeasurementSchema, UpdateMeasurementSchema
} from "backend/bll/validation/schemas/measurementSchemas";

const stationsRoutes = express.Router();
const measurementRepository = new MeasurementRepositoryImpl()
const measurementService = new MeasurementServiceImpl(measurementRepository);
const measurementController = new MeasurementController(measurementService);

stationsRoutes.get("/api/measurements",
    validationMiddleware(GetMeasurementsSchema, RequestSource.Query),
    measurementController.getMeasurements.bind(measurementController));


stationsRoutes.get("/api/measurement/latest",
    measurementController.getLatest.bind(measurementController));

stationsRoutes.get("/api/measurement/statistics",
    validationMiddleware(MeasurementFilterSchema, RequestSource.Query),
    measurementController.getStatistics.bind(measurementController));

stationsRoutes.get("/api/measurement/:id",
    validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
    measurementController.getMeasurementById.bind(measurementController));

stationsRoutes.post("/api/measurement",
    authMiddleware([Roles.Admin]),
    validationMiddleware(MeasurementSchema),
    measurementController.createMeasurement.bind(measurementController));

stationsRoutes.put("/api/measurement/:id",
    authMiddleware([Roles.Admin]),
    validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
    validationMiddleware(UpdateMeasurementSchema),
    measurementController.updateMeasurement.bind(measurementController));

stationsRoutes.delete("/api/measurement/:id",
    authMiddleware([Roles.Admin]),
    validationMiddleware(MeasurementIdParamsSchema, RequestSource.Params),
    measurementController.deleteMeasurement.bind(measurementController));

export default stationsRoutes;