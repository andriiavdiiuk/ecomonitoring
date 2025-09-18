import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
        return res.status(404).json({
            success: false,
            error: 'Not Found',
        });
}
