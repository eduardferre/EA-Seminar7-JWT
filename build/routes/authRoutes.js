"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const User_1 = __importDefault(require("../models/User"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Role_1 = __importDefault(require("../models/Role"));
const Role_2 = require("../models/Role");
const config_1 = __importDefault(require("../config"));
class AuthRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { name, email, password, username, roles } = req.body;
            //encrypt password
            const salt = yield bcryptjs_1.default.genSalt(10);
            const hashed = yield bcryptjs_1.default.hash(password, salt);
            const newUser = new User_1.default({ name, email, password: hashed, username, roles });
            if (roles) {
                for (let i = 0; i < roles.length; i++) {
                    if (!Role_2.ROLES.includes(roles[i])) {
                        return res.status(400).json({ message: 'Roles do not exist' });
                    }
                }
                const foundRoles = yield Role_1.default.find({ name: { $in: roles } });
                newUser.roles = foundRoles.map(role => role._id);
            }
            else {
                const userrole = yield Role_1.default.findOne({ name: 'user' });
                newUser.roles = [userrole._id];
            }
            //if the user specifies his roles, we search these roles on the database
            const savedUser = yield newUser.save();
            const token = jsonwebtoken_1.default.sign({ id: savedUser._id, username: savedUser.username }, config_1.default.SECRET, {
                expiresIn: 3600 //seconds
            });
            res.status(200).json({ token });
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userFound = yield User_1.default.findOne({ email: req.body.email }).populate('roles');
            if (!userFound)
                return res.status(400).json({ message: "User not found" });
            const matchPassword = yield bcryptjs_1.default.compare(req.body.password, userFound.password);
            if (!matchPassword)
                return res.status(401).json({ token: null, message: "Ivalid password" });
            const token = jsonwebtoken_1.default.sign({ id: userFound._id, username: userFound.username }, config_1.default.SECRET, {
                expiresIn: 3600
            });
            res.json({ token: token });
        });
    }
    comparePassword(password, recievedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcryptjs_1.default.compare(password, recievedPassword); //returns true if passwords coincide
        });
    }
    routes() {
        this.router.post('/register', this.register);
        this.router.post('/login', this.login);
    }
}
const authRoutes = new AuthRoutes();
exports.default = authRoutes.router;
