import {Request, Response, NextFunction} from 'express';
import {MongoServerError} from 'mongodb';
import mongoose from 'mongoose';
import config from "backend/configuration/config"

export function errorLogger(err: mongoose.Error, req: Request, res: Response, next: NextFunction):void {
    console.error(`Error occurred at ${new Date().toISOString()}:`);
    console.error(`Path: ${req.method} ${req.path}`);
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack ?? 'unknown'}`);
    next(err);
}

export function validationErrorHandler(err: mongoose.Error, req: Request, res: Response, next: NextFunction): void {

    if (err instanceof mongoose.Error.ValidationError)
    {
        const message = Object.values(err.errors)
            .map((val) => val.message)
            .join(', ');

        res.status(400).json({
            success: false,
            error: 'Validation Error',
            message: message,
        });
    }
    next(err);

}

export function castErrorHandler(err: mongoose.Error, req: Request, res: Response, next: NextFunction): void {
    if (err instanceof mongoose.Error.CastError) {
        res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: err.message,
        });
    }
    next(err);
}


export function duplicateKeyErrorHandler(err: mongoose.Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof MongoServerError && err.code == 110200) {
      const field = Object.keys(err.keyValue as object)[0] ?? 'unknown';
      const message = `Duplicate value for field: ${field}`;

      res.status(409).json({
          success: false,
          error: 'Duplicate Entry',
          message: message
      });
  }
    next(err);
}



export function defaultErrorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error',
        ...(config.environment === 'development' && {stack: err.stack})
    });
}