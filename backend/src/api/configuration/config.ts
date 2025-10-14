import dotenv from "dotenv";
import {Config} from "@jest/types";

dotenv.config();

export default interface Config {
    port: number,
    environment: string,
    dbConnectionString: string,
    jwt: {
        secret: string,
        expires: number,
    }
    cors: {
        origins: string[],
        methods: string[],
        credentials: boolean,
    },
    argon2: {
        memoryCost: number,
        timeCost: number,
        parallelism: number,
    }
    enableLogging: boolean,
}

export function createDefaultConfig(): Config {
    return {
        port: parseInt(requireEnv("PORT")) || 3000,
        environment: requireEnv("ENVIRONMENT"),
        dbConnectionString: requireEnv("DB_CONNECTION_STRING"),
        jwt: {
            secret: requireEnv("JWT_SECRET"),
            expires: 7 * 24 * 60 * 60,
        },
        cors: {
            origins: requireEnv("ALLOWED_ORIGINS").split(",").map(origin => origin.trim()),
            methods: ["GET", "PATCH", "POST", "DELETE","OPTIONS"],
            credentials: true,
        },
        argon2: {
            memoryCost: 16,
            timeCost: 3,
            parallelism: 1,
        },
        enableLogging: true,
    };
}

function requireEnv(key: string): string {
    const value = process.env[key];
    if (value === undefined || value.trim() === "") {
        throw new Error(`Environment variable is invalid: ${key}`);
    }
    return value;
}