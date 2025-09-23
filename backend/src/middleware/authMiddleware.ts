import {NextFunction, Request, Response} from "express";
import config from "backend/configuration/config";
import jwt, {JwtPayload} from "jsonwebtoken";
import {sendProblemDetail} from "backend/middleware/errorHandler";
import {verifyJwt} from "backend/security/jwtUtils";

export interface AuthenticatedRequest extends Request {
    user?: string | JwtPayload;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction){
    const header: string | undefined = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return sendProblemDetail(req,res,401,"Authorization header missing or malformed");
    }

    const token: string = header.split(" ")[1];

    req.user = verifyJwt(token);

    next();
}