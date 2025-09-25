import { Roles } from "backend/dal/entities/Roles";
import { Document } from "mongoose";
export interface User {
    username: string;
    email: string;
    password: string;
    roles: Roles[];
}