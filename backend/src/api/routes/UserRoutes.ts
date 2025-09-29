import express, {Request, Response} from "express";
import UserController from "backend/api/controllers/UserController";
import UserServiceImpl from "backend/bll/services/impl/UserServiceImpl";
import {validationMiddleware} from "backend/api/middleware/validationMiddleware";
import {
    LoginUserDto,
    loginUserSchemas,
    RegisterUserDto,
    registerUserSchema
} from "backend/bll/validation/schemas/userSchemas";
import UserRepositoryImpl from "backend/dal/repositories/impl/UserRepositoryImpl";

const userRoutes = express.Router();

const userRepository = new UserRepositoryImpl();
const userService = new UserServiceImpl(userRepository);
const userController = new UserController(userService);

userRoutes.post(
    "/api/user/register",
    validationMiddleware(registerUserSchema),
    async (req: Request, res: Response): Promise<Response> => {
        const dto: RegisterUserDto = registerUserSchema.parse(req.body);
        return await userController.register(req, res, dto);
    }
);

userRoutes.post(
    "/api/user/login",
    validationMiddleware(loginUserSchemas),
    async (req: Request, res: Response): Promise<Response> => {
        const dto: LoginUserDto = loginUserSchemas.parse(req.body) as LoginUserDto;
        return await userController.login(req, res, dto);
    }
);

export default userRoutes;