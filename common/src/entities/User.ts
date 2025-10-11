import Roles from "common/entities/Roles";
export interface User {
    id: string,
    username: string;
    email: string;
    password: string;
    roles: Roles[];
}