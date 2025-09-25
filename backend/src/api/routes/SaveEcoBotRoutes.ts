import express from "express";

import SaveEcoBotServiceImpl from "backend/bll/services/impl/SaveEcoBotServiceImpl";
import {MeasurementRepositoryImpl} from "backend/dal/repositories/impl/MeasurementRepositoryImpl";
import StationRepositoryImpl from "backend/dal/repositories/impl/StationRepositoryImpl";
import SaveEcoBotController from "backend/api/controllers/SaveEcoBotController";
import {authMiddleware} from "backend/api/middleware/authMiddleware";
import {Roles} from "backend/dal/entities/Roles";
import UserRepositoryImpl from "backend/dal/repositories/impl/UserRepositoryImpl";

const saveEcoBotRoutes = express.Router();
const userRepository = new UserRepositoryImpl();
const measurementRepository = new MeasurementRepositoryImpl();
const stationRepository = new StationRepositoryImpl()
const saveEcoBotService = new SaveEcoBotServiceImpl(stationRepository,measurementRepository);
const saveEcoBotController = new SaveEcoBotController(saveEcoBotService);

saveEcoBotRoutes.post("/api/sync",authMiddleware(userRepository, [Roles.Admin]), saveEcoBotController.sync.bind(saveEcoBotController))
export default saveEcoBotRoutes;