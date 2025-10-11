import express, {Request, Response, Router} from "express";

import SaveEcoBotServiceImpl from "backend/bll/services/impl/SaveEcoBotServiceImpl";
import {MeasurementRepositoryImpl} from "backend/dal/repositories/impl/MeasurementRepositoryImpl";
import StationRepositoryImpl from "backend/dal/repositories/impl/StationRepositoryImpl";
import SaveEcoBotController from "backend/api/controllers/SaveEcoBotController";
import {authMiddleware} from "backend/api/middleware/authMiddleware";
import Roles from "common/entities/Roles";
import Config from "backend/api/configuration/config"
import JwtUtils from "backend/api/security/JwtUtils";


export default function createSaveEcoBotRoutes(config: Config): Router {
    const saveEcoBotRoutes = express.Router();
    const measurementRepository = new MeasurementRepositoryImpl();
    const stationRepository = new StationRepositoryImpl()
    const saveEcoBotService = new SaveEcoBotServiceImpl(stationRepository, measurementRepository);
    const saveEcoBotController = new SaveEcoBotController(saveEcoBotService);
    const jwtUtils = new JwtUtils(config);


    saveEcoBotRoutes.post("/api/sync", authMiddleware(jwtUtils,[Roles.Admin]),
        async (req: Request, res: Response): Promise<Response> => {
            return await saveEcoBotController.sync(req, res);
        })
    return saveEcoBotRoutes;
}