import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import mongoose from 'mongoose';
import config from "backend/configuration/config"

export function errorLogger(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error(`Error occurred at ${new Date().toISOString()}:`);
    console.error(`Path: ${req.method} ${req.path}`);
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${(err as any).stack}`);
    next(err);
}

export function validationErrorHandler(err: mongoose.Error.ValidationError, req: Request, res: Response, next: NextFunction): void {
    const message = Object.values(err.errors)
        .map((val) => val.message)
        .join(', ');

    res.status(400).json({
        success: false,
        error: 'Validation Error',
        message
    });
}

export function castErrorHandler(err: mongoose.Error.CastError, req: Request, res: Response, next: NextFunction): void {
    res.status(400).json({
        success: false,
        error: 'Invalid ID',
        message: 'Invalid ID format'
    });
}


export function duplicateKeyErrorHandler(err: MongoError, req: Request, res: Response, next: NextFunction) {
    const field = (err as any).keyValue ? Object.keys((err as any).keyValue)[0] : 'unknown';
    const message = `Duplicate value for field: ${field}`;

    return (req: Request, res: Response, next: NextFunction) => {
        res.status(409).json({
            success: false,
            error: 'Duplicate Entry',
            message
        });
    }
}


export function defaultErrorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error',
        ...(config.environment === 'development' && { stack: err.stack })
    });
}