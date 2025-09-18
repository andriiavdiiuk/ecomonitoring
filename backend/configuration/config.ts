import dotenv from "dotenv";

dotenv.config();

interface Config {
    port: number,
    environment: string,
    db_connection_string: string,
    jwt_secret: string,
    allowedOrigins: string[]
}

const config: Config = {
    port: parseInt(requireEnv("PORT")) || 3000,
    environment: requireEnv("ENVIRONMENT"),
    db_connection_string: requireEnv("DB_CONNECTION_STRING"),
    jwt_secret: requireEnv("JWT_SECRET"),
    allowedOrigins:  requireEnv("ALLOWED_ORIGINS").split(",").map(origin => origin.trim())
}
function requireEnv(key: any): string {
    const value = process.env[key];
    if (value === undefined || value.trim() === "") {
        throw new Error(`Environment variable is invalid: ${key}`);
    }
    return value;
}

export default config;