import {NextFunction, Request, Response} from "express";
import {z} from "zod";
import {sendProblemDetail} from "backend/middleware/errorHandler";

export function validationMiddleware(schema: z.ZodType, source: 'body' | 'query' | 'params' = 'body') {
    return (req: Request, res: Response, next: NextFunction) => {
        const data: unknown = req[source]
        const result = schema.safeParse(data)
        if (!result.success) {
            const fieldErrors = result.error.issues.map(e => ({
                [e.path.join('.')]: e.message
            }))
            sendProblemDetail(req, res, 400, "Validation Error", fieldErrors)
        }

        next()
    }
}