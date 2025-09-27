import {User} from 'backend/dal/entities/User';
import {encryptPassword, verifyPassword} from "backend/api/security/passwordUtils";
import {getJwt} from "backend/api/security/jwtUtils";
import {LoginUserDto, RegisterUserDto} from "backend/bll/validation/schemas/userSchemas";
import ValidationError from "backend/bll/errors/validationError";
import UserRepository from "backend/dal/repositories/UserRepository";
import UserService from "backend/bll/services/UserService";

export default class UserServiceImpl implements UserService
{
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    async createUser(userDto: RegisterUserDto): Promise<string> {
        userDto.password = await encryptPassword(userDto.password);

        const user = await this.userRepository.create(userDto as User);

        return getJwt(user);
    }

    async loginUser(userDto: LoginUserDto): Promise<string> {

        const userDb = await this.userRepository.getUserByUsernameOrEmail(userDto.username);
        if (!userDb || !(await verifyPassword(userDb.password, userDto.password))) {
            throw new ValidationError('Invalid username or password', [
                { username: 'Invalid username' },
                { password: 'Invalid password' }
            ])
        }

        return getJwt(userDb);
    }
}
