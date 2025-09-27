import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from 'backend/api/configuration/config'
import connectDB from 'backend/api/configuration/database'
import {
    errorHandler,
    errorLogger,
} from "backend/api/middleware/errorHandler";
import {notFoundHandler} from "backend/api/middleware/notFoundHandler";
import userRoutes from "backend/api/routes/UserRoutes";
import saveEcoBotRoutes from "backend/api/routes/SaveEcoBotRoutes";
import stationsRoutes from "backend/api/routes/StationRoutes";


const app = express();

await connectDB();

app.use(helmet())

app.use(cors())
app.use(cors(config.cors));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.use(userRoutes);
app.use(saveEcoBotRoutes);
app.use(stationsRoutes);
app.use(errorLogger);
app.use(errorHandler);


app.use(notFoundHandler);

const server = app.listen(config.port);

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});
