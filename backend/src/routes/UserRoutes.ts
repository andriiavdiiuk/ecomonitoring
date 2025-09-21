import express from "express";
import UserController from "backend/controllers/UserController";
import UserService from "backend/services/UserService";

const userRoutes = express.Router();

const useService = new UserService();
const userController = new UserController(useService);

userRoutes.post("/api/register", userController.register)
export default userRoutes;