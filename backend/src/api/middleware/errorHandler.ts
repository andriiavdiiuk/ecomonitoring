import {Request, Response, NextFunction} from 'express';
import {MongoServerError} from 'mongodb';
import mongoose from 'mongoose';
import jwt from "jsonwebtoken";
import {STATUS_CODES} from "http";
import config from "backend/api/configuration/config";
import ValidationError from "backend/bll/errors/validationError";

interface ProblemDetail {
    type: string;
    status: number;
    title: string;
    detail: string;
    instance: string;
    errors?: Array<Partial<Record<string, string|object>>>;
}

export function getProblemDetail(req: Request, status: number, detail: string, errors?: Array<Partial<Record<string, string|object>>>): ProblemDetail {
    return {
        type: "about:blank",
        status: status,
        title: STATUS_CODES[status] as string,
        detail: detail,
        instance: req.originalUrl,
        ...(errors ? {errors} : {})
    }
}

export function sendProblemDetail(req: Request, res: Response, status: number, detail: string, errors?: Array<Partial<Record<string, string|object>>>) : Response {
    return res.status(status).json(getProblemDetail(req, status, detail, errors));
}

export function errorLogger(err: mongoose.Error, req: Request, res: Response, next: NextFunction): void {
    console.error(`Error occurred at ${new Date().toISOString()}:`);
    console.error(`Path: ${req.method} ${req.path}`);
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack ?? 'unknown'}`);
    next(err);
}

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): Response {
    switch (true) {
        case err instanceof SyntaxError && 'body' in err: {
            return sendProblemDetail(req, res, 400, "Invalid JSON body", [{ body: err.message }]);
        }

        case err instanceof ValidationError: {
            return sendProblemDetail(req, res, 400, err.message, err.fieldErrors)
        }

        case err instanceof mongoose.Error.ValidationError: {
            const errors = Object.values(err.errors).map(e => ({ [e.path]: e.message }));
            return sendProblemDetail(req, res, 422, "Validation Error", errors);
        }

        case err instanceof mongoose.Error.CastError: {
            return sendProblemDetail(req, res, 400, err.message);
        }

        case err instanceof MongoServerError && err.code === 11000: {
            const field = Object.keys(err.keyValue as object)[0] ?? 'unknown';
            const errors = [{ [field]: "Duplicate value" }];
            return sendProblemDetail(req, res, 409, "Duplicate value", errors);
        }

        case err instanceof jwt.TokenExpiredError: {
            return sendProblemDetail(req, res, 401, "Token expired");
        }

        case err instanceof jwt.JsonWebTokenError: {
            return sendProblemDetail(req, res, 403, "Token is invalid");
        }

        default: {
            let detail = STATUS_CODES[500] as string;
            if (config.environment === "development")
            {
                detail = err.message;
            }
            return sendProblemDetail(req, res, 500, detail);
        }
    }
}