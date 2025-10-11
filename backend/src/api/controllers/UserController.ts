import {Request, Response} from "express";
import {LoginUserDto, RegisterUserDto} from "common/validation/schemas/userSchemas";
import UserService from "backend/bll/services/UserService";

class UserController {
    private readonly userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }

    async register(req: Request, res: Response, registerUserDto: RegisterUserDto): Promise<Response> {
        const token = await this.userService.createUser(registerUserDto);

        return res.status(201).json({
            token,
        });
    }

    async login(req: Request, res: Response, loginUserDto: LoginUserDto) : Promise<Response>
    {
        const token = await this.userService.loginUser(loginUserDto);

        return res.status(200).json({
            token: token
        });
    }
}

export default UserController;