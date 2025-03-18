"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePixKey = exports.updatePixKey = exports.getAllPixKeysByUser = exports.createPixKey = void 0;
const pixKeyService_1 = __importDefault(require("../services/pixKeyService"));
const pixKeyValidator_1 = require("../validators/pixKeyValidator");
const zod_1 = require("zod");
const createPixKey = async (req, res) => {
    try {
        const { key, type, userId } = pixKeyValidator_1.createPixKeySchema.parse(req.body);
        const pixKey = await pixKeyService_1.default.createPixKeyService({ key, type, userId });
        res.status(201).json(pixKey);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação: ' + error.errors[0].message });
        }
        else if (error instanceof Error) {
            res.status(500).json({ error: 'Erro ao criar chave PIX: ' + error.message });
        }
        else {
            res.status(500).json({ error: 'Erro desconhecido ao criar chave PIX' });
        }
    }
};
exports.createPixKey = createPixKey;
const getAllPixKeysByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const pixKeys = await pixKeyService_1.default.getAllPixKeysByUserService(userId);
        res.status(200).json(pixKeys);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar chaves PIX: ' + error.message });
    }
};
exports.getAllPixKeysByUser = getAllPixKeysByUser;
const updatePixKey = async (req, res) => {
    try {
        const { id } = req.params;
        const { key, type } = pixKeyValidator_1.createPixKeySchema.parse(req.body);
        const pixKey = await pixKeyService_1.default.updatePixKeyService(id, { key, type });
        res.status(200).json(pixKey);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar chave PIX: ' + error.message });
    }
};
exports.updatePixKey = updatePixKey;
const deletePixKey = async (req, res) => {
    try {
        const { id } = req.params;
        await pixKeyService_1.default.deletePixKeyService(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar chave PIX: ' + error.message });
    }
};
exports.deletePixKey = deletePixKey;
