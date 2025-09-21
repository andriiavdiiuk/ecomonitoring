import UserSchema from 'backend/dal/schemas/UserSchema';
import {User} from 'backend/dal/entities/User';
import argon2id from "argon2";
import crypto from "crypto";
import config from "backend/configuration/config";
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

export default class UserService
{
    async createUser(user: User): Promise<string>
    {
        const salt = crypto.randomBytes(16);
        user.password = await argon2id.hash(
            user.password,
            {
                salt: salt,
                ...config.argon2
            }
        );
        user = await UserSchema.create(user);

        return jwt.sign(
            {
                username: user.username,
                roles: user.roles.toString(),
            },
            config.jwt.secret,
            {
                subject: (user.id as ObjectId).toString(),
                expiresIn: config.jwt.expires
            }
        );
    }
}
