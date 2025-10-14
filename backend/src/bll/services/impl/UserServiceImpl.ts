import {User} from 'common/entities/User';
import PasswordUtils from "backend/api/security/PasswordUtils";
import JwtUtils from "backend/api/security/JwtUtils";
import {LoginUserDto, RegisterUserDto} from "common/validation/schemas/userSchemas";
import {UnathorizedError} from "backend/bll/errors/errors";
import UserRepository from "backend/dal/repositories/UserRepository";
import UserService from "backend/bll/services/UserService";

export default class UserServiceImpl implements UserService
{
    private readonly userRepository: UserRepository;
    private readonly passwordUtils: PasswordUtils;
    private readonly jwtUtils: JwtUtils;

    constructor(userRepository: UserRepository, passwordUtils: PasswordUtils, jwtUtils: JwtUtils) {
        this.userRepository = userRepository;
        this.passwordUtils = passwordUtils;
        this.jwtUtils = jwtUtils;
    }
    async createUser(userDto: RegisterUserDto): Promise<string> {
        userDto.password = await this.passwordUtils.encrypt(userDto.password);

        const user = await this.userRepository.create(userDto as User);

        return this.jwtUtils.getToken(user);
    }

    async loginUser(userDto: LoginUserDto): Promise<string> {

        const userDb = await this.userRepository.getUserByUsernameOrEmail(userDto.username);
        if (!userDb || !(await this.passwordUtils.verify(userDb.password, userDto.password))) {
            throw new UnathorizedError('Invalid username or password', [
                { username: 'Invalid username' },
                { password: 'Invalid password' }
            ])
        }

        return this.jwtUtils.getToken(userDb);
    }
}
