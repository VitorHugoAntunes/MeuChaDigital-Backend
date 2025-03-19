"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUserByEmail = exports.getAllUsers = exports.createGuestUser = exports.createUser = void 0;
const userService_1 = __importDefault(require("../services/userService"));
const userValidator_1 = require("../validators/userValidator");
const zod_1 = require("zod");
const createUser = async (params) => {
    try {
        const { name, email, googleId, photo } = userValidator_1.createUserSchema.parse(params);
        const user = await userService_1.default.createUserService({ name, email, googleId, photo });
        return user;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new Error('Erro de validação: ' + error.errors.map(e => e.message).join(', '));
        }
        else {
            throw new Error('Erro ao criar usuário: ' + error.message);
        }
    }
};
exports.createUser = createUser;
const createGuestUser = async (params) => {
    try {
        const { isGuest } = userValidator_1.createGuestUserSchema.parse(params);
        const user = await userService_1.default.createGuestUserService({ isGuest });
        return user;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            throw new Error('Erro de validação: ' + error.errors.map(e => e.message).join(', '));
        }
        else {
            throw new Error('Erro ao criar usuário: ' + error.message);
        }
    }
};
exports.createGuestUser = createGuestUser;
const getAllUsers = async (req, res) => {
    const users = await userService_1.default.getAllUsersService();
    res.json(users);
};
exports.getAllUsers = getAllUsers;
const getUserByEmail = async (req, res) => {
    const email = req.params.email;
    const user = await userService_1.default.getUserByEmailService(email);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
};
exports.getUserByEmail = getUserByEmail;
const getUserById = async (req, res) => {
    const id = req.params.id;
    const user = await userService_1.default.getUserByIdService(id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const { name, email, googleId, photo } = userValidator_1.createUserSchema.parse(req.body);
        const user = await userService_1.default.updateUserService(id, { name, email, googleId, photo });
        res.json(user);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação', details: error.errors });
        }
        else {
            res.status(500).json({ error: 'Erro ao atualizar usuário: ' + error.message });
        }
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await userService_1.default.deleteUserService(id);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar usuário: ' + error.message });
    }
};
exports.deleteUser = deleteUser;
