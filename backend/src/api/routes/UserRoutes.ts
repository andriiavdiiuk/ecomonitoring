import express, {Request, Response, Router} from "express";
import UserController from "backend/api/controllers/UserController";
import UserServiceImpl from "backend/bll/services/impl/UserServiceImpl";
import {validationMiddleware} from "backend/api/middleware/validationMiddleware";
import {
    LoginUserDto,
    loginUserSchemas,
    RegisterUserDto,
    registerUserSchema
} from "common/validation/schemas/userSchemas";
import UserRepositoryImpl from "backend/dal/repositories/impl/UserRepositoryImpl";
import PasswordUtils from "backend/api/security/PasswordUtils";
import Config from "backend/api/configuration/config"
import JwtUtils from "backend/api/security/JwtUtils";

export default function createUserRoutes(config: Config): Router {
    const userRepository = new UserRepositoryImpl();
    const passwordUtils = new PasswordUtils(config);
    const jwtUtils = new JwtUtils(config);
    const userService = new UserServiceImpl(userRepository, passwordUtils,jwtUtils);
    const userController = new UserController(userService);

    const router = express.Router();

    router.post(
        "/api/user/register",
        validationMiddleware(registerUserSchema),
        async (req: Request, res: Response) => {
            const dto: RegisterUserDto = registerUserSchema.parse(req.body);
            return userController.register(req, res, dto);
        }
    );

    router.post(
        "/api/user/login",
        validationMiddleware(loginUserSchemas),
        async (req: Request, res: Response) => {
            const dto: LoginUserDto = loginUserSchemas.parse(req.body) as LoginUserDto;
            return userController.login(req, res, dto);
        }
    );

    return router;
}