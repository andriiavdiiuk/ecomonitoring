import {LoginUserDto, RegisterUserDto} from "common/validation/schemas/userSchemas";

export default interface UserService {
    createUser(userDto: RegisterUserDto): Promise<string>
    loginUser(userDto: LoginUserDto): Promise<string>
}