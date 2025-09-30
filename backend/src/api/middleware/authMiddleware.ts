import {NextFunction, Request, Response} from "express";
import {JwtPayload} from "jsonwebtoken";
import {sendProblemDetail} from "backend/api/middleware/errorHandler";
import JwtUtils from "backend/api/security/JwtUtils";
import {Roles} from "backend/dal/entities/Roles";

export interface AuthenticatedRequest extends Request {
    user?: JwtPayload;
}

export function authMiddleware(jwtUtils: JwtUtils, allowedRoles?: Roles[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
        const header: string | undefined = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return sendProblemDetail(req, res, 401, "Authorization header missing or malformed");
        }

        const token: string = header.split(" ")[1];
        const payload = jwtUtils.verify(token) as JwtPayload;
        
        if (!payload.roles || typeof payload.roles !== "string") {
            return sendProblemDetail(req, res, 401, "Invalid token");
        }
        const userRoles: string[] = payload.roles.split(",").map(r => r.trim());

        if (allowedRoles && !userRoles.some(role => allowedRoles.includes(role as Roles))) {
            return sendProblemDetail(req, res, 403, "Access denied");
        }

        req.user = payload;

        next();
    };
}
