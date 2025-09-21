import UserService from "backend/services/UserService";
import {User} from "backend/dal/entities/User";
import express, {Request, Response} from "express";

class UserController {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(req: Request, res: Response) {

        const data: any = req.body;
        const token = await this.userService.createUser(data);

        return res.status(201).json({
            success: true,
            token,
        });

    }
}

export default UserController;