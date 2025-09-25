import {LoginUserDto, RegisterUserDto} from "backend/validation/schemas/userSchemas";

export default interface UserService {
    createUser(userDto: RegisterUserDto): Promise<string>
    loginUser(userDto: LoginUserDto): Promise<string>
}