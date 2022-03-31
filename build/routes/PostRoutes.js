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
const Post_1 = __importDefault(require("../models/Post"));
const index_1 = require("../middlewares/index");
class PostRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    getPosts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const posts = yield Post_1.default.find();
            res.json(posts);
        });
    }
    getPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield Post_1.default.findOne({ url: req.params.url });
            res.json(post);
        });
    }
    createPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title, url, content, image } = req.body;
            const newPost = new Post_1.default({ title, url, content, image });
            yield newPost.save();
            res.json({ data: newPost });
        });
    }
    updatePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = req.params;
            const post = yield Post_1.default.findOneAndUpdate({ url }, req.body, { new: true });
            res.json(post);
        });
    }
    deletePost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = req.params;
            yield Post_1.default.findOneAndDelete({ url });
            res.json({ response: 'Post Deleted successfully' });
        });
    }
    routes() {
        this.router.get('/', index_1.authJwt.verifyToken, this.getPosts);
        this.router.get('/:url', index_1.authJwt.verifyToken, this.getPost);
        this.router.post('/', [index_1.authJwt.verifyToken, index_1.authJwt.isModerator], this.createPost);
        this.router.put('/:url', [index_1.authJwt.verifyToken, index_1.authJwt.isModerator], this.updatePost);
        this.router.delete('/:url', [index_1.authJwt.verifyToken, index_1.authJwt.isAdmin], this.deletePost);
    }
}
const postRoutes = new PostRoutes();
exports.default = postRoutes.router;
