import crypto from "crypto";
import argon2id from "argon2";
import Config from "backend/api/configuration/config";


export default class PasswordUtils {
    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    async encrypt(password: string): Promise<string> {
        const salt = crypto.randomBytes(16);
        return await argon2id.hash(
            password,
            {
                salt: salt,
                ...this.config.argon2
            }
        );
    }

    async verify(encryptedPassword: string, password: string): Promise<boolean> {
        return await argon2id.verify(encryptedPassword, password);
    }
}