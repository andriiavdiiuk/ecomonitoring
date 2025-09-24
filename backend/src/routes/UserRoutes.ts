import express from "express";
import UserController from "backend/controllers/UserController";
import UserService from "backend/services/UserService";
import {validationMiddleware} from "backend/middleware/validationMiddleware";
import {loginUserSchemas, registerUserSchema} from "backend/validation/schemas/userSchemas";

const userRoutes = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

userRoutes.post("/api/user/register", validationMiddleware(registerUserSchema), userController.register.bind(userController))
userRoutes.post("/api/user/login", validationMiddleware(loginUserSchemas),  userController.login.bind(userController))
export default userRoutes;