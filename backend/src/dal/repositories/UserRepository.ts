import {User} from "backend/dal/entities/User";
import Repository from "backend/dal/repositories/Repository";

export default interface UserRepository extends Repository<User>{
    getUserByUsernameOrEmail(name: string): Promise<User | null>
}