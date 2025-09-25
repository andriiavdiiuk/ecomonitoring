import {User} from "backend/dal/entities/User";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "backend/api/configuration/config";

export function getJwt(user: User): string {
    return jwt.sign(
        {
            username: user.username,
            roles: user.roles.toString(),
        },
        config.jwt.secret,
        {
            subject: user.id,
            expiresIn: config.jwt.expires
        }
    );
}

export function verifyJwt(token: string): string | JwtPayload {
    return jwt.verify(token, config.jwt.secret);
}