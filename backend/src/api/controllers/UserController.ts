import {Request, Response} from "express";
import {LoginUserDto, RegisterUserDto} from "backend/bll/validation/schemas/userSchemas";
import UserService from "backend/bll/services/UserService";

class UserController {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(req: Request, res: Response): Promise<Response> {
        const data: RegisterUserDto = req.body as RegisterUserDto;
        const token = await this.userService.createUser(data);

        return res.status(201).json({
            token,
        });
    }

    async login(req: Request, res: Response) : Promise<Response>
    {
        const data: LoginUserDto = req.body as LoginUserDto;
        const token = await this.userService.loginUser(data);

        return res.status(201).json({
            token: token
        });
    }
}

export default UserController;