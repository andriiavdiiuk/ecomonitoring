import crypto from "crypto";
import argon2id from "argon2";
import config from "backend/api/configuration/config";

export async function encryptPassword(password: string): Promise<string>
{
    const salt = crypto.randomBytes(16);
    return await argon2id.hash(
        password,
        {
            salt: salt,
            ...config.argon2
        }
    );
}

export async function verifyPassword(encryptedPassword: string,password: string): Promise<boolean>
{
    return await argon2id.verify(encryptedPassword,password);
}