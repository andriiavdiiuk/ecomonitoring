import UserSchema from 'backend/dal/schemas/UserSchema';
import {User} from 'backend/dal/entities/User';
import {encryptPassword, verifyPassword} from "backend/security/passwordUtils";
import {getJwt} from "backend/security/jwtUtils";
import {LoginUserDto, RegisterUserDto} from "backend/validation/schemas/userSchemas";
import ValidationError from "backend/errors/validationError";

export default class UserService {
    async createUser(userDto: RegisterUserDto): Promise<string> {
        userDto.password = await encryptPassword(userDto.password);

        const user = await UserSchema.create(userDto) as User;

        return getJwt(user);
    }

    async loginUser(userDto: LoginUserDto): Promise<string> {
        const userDb = await UserSchema.findOne({
            $or: [{email: userDto.username}, {username: userDto.username}]
        });
        if (!userDb || !(await verifyPassword(userDb.password, userDto.password))) {
            throw new ValidationError('Invalid username or password', [
                { username: 'Invalid username' },
                { password: 'Invalid password' }
            ])
        }

        return getJwt(userDb);
    }
}
