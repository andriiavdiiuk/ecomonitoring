import express, {Express} from "express";
import helmet from "helmet";
import cors from "cors";
import Config from "backend/api/configuration/config";
import createUserRoutes from "backend/api/routes/UserRoutes";
import createSaveEcoBotRoutes from "backend/api/routes/SaveEcoBotRoutes";
import createStationRoutes from "backend/api/routes/StationRoutes";
import createMeasurementRoutes from "backend/api/routes/MeasurementRoutes";
import { createErrorHandler, errorLogger } from "backend/api/middleware/errorHandler";
import { notFoundHandler } from "backend/api/middleware/notFoundHandler";
import connectDB from "backend/api/configuration/database";
import * as http from "node:http";

export async function createApp(config: Config): Promise<Express> {
    const app = express();
    await connectDB(config);

    app.use(helmet());
    app.use(cors());
    app.use(cors(config.cors));

    app.use(express.json({ limit: "10mb" }));
    app.use(express.urlencoded({ extended: true, limit: "10mb" }));

    if (config.enableLogging) {
        app.use((req, _res, next) => {
            console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
            next();
        });
    }

    app.use(createUserRoutes(config));
    app.use(createSaveEcoBotRoutes(config));
    app.use(createStationRoutes(config));
    app.use(createMeasurementRoutes(config));

    if (config.enableLogging)
    {
    app.use(errorLogger);
    }
    app.use(createErrorHandler(config));

    app.use(notFoundHandler);

    return app;
}

export async function createServer(config: Config): Promise<http.Server> {
    const app: Express = await createApp(config);
    const server: http.Server = app.listen(config.port);

    // Graceful shutdown
    const shutdown = () => {
        console.log("Shutting down gracefully...");
        server.close(() => {
            console.log("Server closed");
            process.exit(0);
        });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    return server;
}
