import {User} from "common/entities/User";
import UserRepository from "backend/dal/repositories/UserRepository";
import {MongoCrudRepository} from "backend/dal/repositories/MongoCrudRepository";
import UserModel, {UserDocument} from "backend/dal/schemas/UserSchema";

export default class UserRepositoryImpl extends MongoCrudRepository<UserDocument> implements UserRepository {
    constructor() {
        super(UserModel);
    }
    public async getUserByUsernameOrEmail(name: string): Promise<User|null> {
        return this.model.findOne({
            $or: [{email: name}, {username: name}]
        });
    }
}