import {LoginUserDto, RegisterUserDto} from "backend/bll/validation/schemas/userSchemas";

export default interface UserService {
    createUser(userDto: RegisterUserDto): Promise<string>
    loginUser(userDto: LoginUserDto): Promise<string>
}