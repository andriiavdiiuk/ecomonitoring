import UserService from "backend/services/UserService";
import {User} from "backend/dal/entities/User";
import {Request, Response} from "express";
import {AuthenticatedRequest} from "backend/middleware/authMiddleware";

class UserController {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(req: Request, res: Response) {

        const data: User = req.body as User;
        const token = await this.userService.createUser(data);

        return res.status(201).json({
            success: true,
            token,
        });

    }

    testJwt(req: AuthenticatedRequest, res: Response) {
        return res.status(200).json(req.user);
    }
}

export default UserController;