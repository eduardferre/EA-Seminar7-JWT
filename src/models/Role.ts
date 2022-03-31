import { Schema, model } from "mongoose";

export const ROLES = ['user', 'moderator', 'admin'];

const RoleSchema = new Schema({
    name: {type: String, required: true}
});

export default model('Role', RoleSchema);