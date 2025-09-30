import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {createApp} from "backend/server";
import Config, {createDefaultConfig} from "backend/api/configuration/config";
import {Express} from "express";

export let mongoServer: MongoMemoryServer;

export async function setupTestApp(config?: Config): Promise<Express> {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);

    if (!config) {
        config = createDefaultConfig();
    }
    config.dbConnectionString = uri;
    config.enableLogging = false;
    return await createApp(config);
}

export async function teardownTestApp(): Promise<void> {

    if (mongoose.connection.readyState) {
        await mongoose.disconnect();
    }
    await mongoServer.stop();
}