import express from "express";
import UserController from "backend/controllers/UserController";
import UserService from "backend/services/UserService";

const userRoutes = express.Router();

const userService = new UserService();
const userController = new UserController(userService);

userRoutes.post("/api/user/register",  userController.register.bind(userController))
export default userRoutes;