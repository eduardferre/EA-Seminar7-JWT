"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
exports.default = {
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/JWTapi",
    PORT: process.env.PORT || 3000,
    SECRET: 'secret'
};
