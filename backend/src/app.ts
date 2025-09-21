import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import config from 'backend/configuration/config'
import connectDB from 'backend/configuration/database'
import {
    castErrorHandler,
    defaultErrorHandler,
    duplicateKeyErrorHandler,
    errorLogger,
    validationErrorHandler
} from "backend/middleware/errorHandler";
import {notFoundHandler} from "backend/middleware/notFoundHandler";
import userRoutes from "backend/routes/UserRoutes";

const app = express();

connectDB();

app.use(helmet())

app.use(cors())
app.use(cors(config.cors));

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});


app.use(errorLogger);
app.use(validationErrorHandler);
app.use(castErrorHandler);
app.use(duplicateKeyErrorHandler);
app.use(defaultErrorHandler);
app.use(notFoundHandler);

app.use(userRoutes);

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
