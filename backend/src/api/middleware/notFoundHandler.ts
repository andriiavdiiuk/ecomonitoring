import {Request, Response} from 'express';
import {sendProblemDetail} from "backend/api/middleware/errorHandler";

export function notFoundHandler(req: Request, res: Response) {
    return sendProblemDetail(req, res, 404, "Not Found");
}
