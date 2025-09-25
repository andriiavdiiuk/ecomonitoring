import SaveEcoBotService from "backend/bll/services/SaveEcoBotService";
import {Request, Response} from "express";

export default class SaveEcoBotController {
    private readonly saveEcoBotService: SaveEcoBotService

    constructor(saveEcoBotService: SaveEcoBotService) {
        this.saveEcoBotService = saveEcoBotService;
    }

    public async sync(req: Request, res: Response): Promise<Response>
    {
        return res.status(200).json(await this.saveEcoBotService.sync());
    }
}