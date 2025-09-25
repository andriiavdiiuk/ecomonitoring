import mongoose from 'mongoose'
import { User } from "backend/dal/entities/User";
import { Roles } from "backend/dal/entities/Roles";

export interface UserDocument extends User, Document {}

const UserSchema = new mongoose.Schema<UserDocument>({
    username: {
        type: String,
        unique:  true,
        required: true,
        index: true,
        trim: true
    },

    email: {
        type: String,
        unique:  true,
        required: true,
        index: true,
        trim: true
    },

    password: {
        type: String,
        required: true,
        trim: true
    },

    roles: {
        type: [String],
        enum: Object.values(Roles),
        default: [Roles.User]
    },
}, {
    timestamps: true
});

const UserModel =  mongoose.model<UserDocument>('UserModel',UserSchema);
export default UserModel;