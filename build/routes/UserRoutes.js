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
const index_1 = require("../middlewares/index");
class UserRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    getUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.default.find().populate(`posts`, '-_id -__v');
            res.status(200).send(users);
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne({ username: req.params.username }).populate('posts', '-_id -__v');
            //const user: User | null = await UserModel.findOne({ username: req.params.username}).populate('posts', '-_id -__v');
            res.json(user);
        });
    }
    createUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const newUser = new User_1.default(req.body);
            yield newUser.save();
            res.json({ data: newUser });
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            const user = yield User_1.default.findOneAndUpdate({ username }, req.body, { new: true });
            res.json(user);
        });
    }
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username } = req.params;
            yield User_1.default.findOneAndDelete({ username });
            res.json({ response: 'User Deletedd successfully' });
        });
    }
    routes() {
        this.router.get('/', this.getUsers);
        this.router.get('/:username', index_1.authJwt.verifyToken, this.getUser);
        this.router.post('/', [index_1.authJwt.verifyToken, index_1.authJwt.isModerator], this.createUser);
        this.router.put('/:username', [index_1.authJwt.verifyToken, index_1.authJwt.isModerator], this.updateUser);
        this.router.delete('/:username', [index_1.authJwt.verifyToken, index_1.authJwt.isAdmin], this.deleteUser);
    }
}
const userRoutes = new UserRoutes();
exports.default = userRoutes.router;
