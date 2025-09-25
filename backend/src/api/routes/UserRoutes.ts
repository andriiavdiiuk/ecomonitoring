import express from "express";
import UserController from "backend/api/controllers/UserController";
import UserServiceImpl from "backend/bll/services/impl/UserServiceImpl";
import {validationMiddleware} from "backend/api/middleware/validationMiddleware";
import {loginUserSchemas, registerUserSchema} from "backend/api/validation/schemas/userSchemas";
import UserRepositoryImpl from "backend/dal/repositories/impl/UserRepositoryImpl";

const userRoutes = express.Router();

const userRepository = new UserRepositoryImpl();
const userService = new UserServiceImpl(userRepository);
const userController = new UserController(userService);

userRoutes.post("/api/user/register", validationMiddleware(registerUserSchema), userController.register.bind(userController))
userRoutes.post("/api/user/login", validationMiddleware(loginUserSchemas),  userController.login.bind(userController))
export default userRoutes;