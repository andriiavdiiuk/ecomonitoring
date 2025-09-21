import mongoose from 'mongoose'
import { User } from "backend/dal/entities/User";
import { Roles } from "backend/dal/entities/Roles";

const UserSchema = new mongoose.Schema<User>({
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


export default mongoose.model('UserModel',UserSchema);