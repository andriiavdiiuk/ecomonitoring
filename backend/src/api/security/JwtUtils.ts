import {User} from "backend/dal/entities/User";
import jwt, {JwtPayload} from "jsonwebtoken";
import config from "backend/api/configuration/config";
import Config from "backend/api/configuration/config";


export default class JwtUtils {
    private readonly config: Config;

    constructor(config: Config) {
        this.config = config;
    }

    getToken(user: User): string {
        return jwt.sign(
            {
                username: user.username,
                roles: user.roles.toString(),
            },
            this.config.jwt.secret,
            {
                subject: user.id,
                expiresIn: this.config.jwt.expires
            }
        );
    }

    verify(token: string): string | JwtPayload {
        return jwt.verify(token, this.config.jwt.secret);
    }
}