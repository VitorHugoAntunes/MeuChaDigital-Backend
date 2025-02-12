"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserWrapper = void 0;
const userController_1 = require("../controllers/userController");
const createUserWrapper = async (req, res) => {
    const { name, email, googleId, photo } = req.body;
    await (0, userController_1.createUser)({ name, email, googleId, photo });
};
exports.createUserWrapper = createUserWrapper;
