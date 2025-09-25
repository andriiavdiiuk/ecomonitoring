import { Roles } from "backend/dal/entities/Roles";
import { Document } from "mongoose";
export interface User {
    id: string,
    username: string;
    email: string;
    password: string;
    roles: Roles[];
}