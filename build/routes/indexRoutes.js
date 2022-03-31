"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class IndexRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.routes();
    }
    routes() {
        this.router.get('/', (req, res) => res.send('Api: /api/posts'));
    }
}
const indexRoutes = new IndexRoutes();
indexRoutes.routes();
exports.default = indexRoutes.router;
