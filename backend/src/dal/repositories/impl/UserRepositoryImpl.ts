import {User} from "backend/dal/entities/User";
import UserSchema from "backend/dal/schemas/UserSchema";
import UserRepository from "backend/dal/repositories/UserRepository";

export default class UserRepositoryImpl implements UserRepository {
    public async create(user: User): Promise<User> {
        return await UserSchema.create(user) as User;
    }

    public async getUserByUsernameOrEmail(name: string): Promise<User|null> {
        return UserSchema.findOne({
            $or: [{email: name}, {username: name}]
        });
    }
}