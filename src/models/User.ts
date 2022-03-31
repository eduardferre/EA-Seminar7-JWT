import { Schema, model } from "mongoose";
import Role from "./Role";

const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    username: {type: String, required: true, unique: true},
    createdAt: {type: Date, default: Date.now()},
    posts: [{
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }],
    roles: [{
        type: Schema.Types.ObjectId,
        ref: 'Role'
    }]
});


export default model('User', UserSchema);