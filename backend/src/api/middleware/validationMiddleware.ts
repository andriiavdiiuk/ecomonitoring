import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {sendProblemDetail} from "backend/api/middleware/errorHandler";
import {ZodErrorsToProblemDetailErrors} from "common/validation/ZodConverter";

export enum RequestSource {
    Body = "body",
    Query = "query",
    Params = "params"
}

export function validationMiddleware(schema: z.ZodType, source: RequestSource= RequestSource.Body) {
    return (req: Request, res: Response, next: NextFunction) => {
        const data: unknown = req[source]
        const result = schema.safeParse(data)
        if (!result.success) {
            const errors = ZodErrorsToProblemDetailErrors(result.error.issues);
            sendProblemDetail(req, res, 400, "Validation Error", errors);
        }

        next()
    }
}