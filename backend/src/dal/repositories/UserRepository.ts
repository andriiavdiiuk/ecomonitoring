import {User} from "backend/dal/entities/User";

export default interface UserRepository {
    create(user: User): Promise<User>
    getUserByUsernameOrEmail(name: string): Promise<User | null>
}