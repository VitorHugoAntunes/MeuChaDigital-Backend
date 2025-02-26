"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGift = exports.updateGift = exports.getGiftById = exports.getAllGifts = exports.createGift = void 0;
const giftService_1 = __importDefault(require("../services/giftService"));
const giftValidator_1 = require("../validators/giftValidator");
const zod_1 = require("zod");
const createGift = async (req, res) => {
    try {
        const parsedTotalValue = parseFloat(req.body.totalValue);
        const { name, priority, description, totalValue, categoryId, userId, giftListId } = giftValidator_1.createGiftSchema.parse({ ...req.body, totalValue: parsedTotalValue });
        const gift = await giftService_1.default.createGiftService({ name, priority, description, totalValue: parsedTotalValue, categoryId, giftListId }, req, res);
        res.status(201).json(gift);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação', details: error.errors });
        }
        else {
            res.status(500).json({ error: 'Erro ao criar presente: ' + error.message });
        }
    }
};
exports.createGift = createGift;
const getAllGifts = async (req, res) => {
    const gifts = await giftService_1.default.getAllGiftsService();
    res.json(gifts);
};
exports.getAllGifts = getAllGifts;
const getGiftById = async (req, res) => {
    const id = req.params.giftId;
    const gift = await giftService_1.default.getGiftByIdService(id);
    if (gift) {
        res.json(gift);
    }
    else {
        res.status(404).json({ error: 'Presente não encontrado' });
    }
};
exports.getGiftById = getGiftById;
const updateGift = async (req, res) => {
    const userId = req.body.userId;
    const giftListId = req.params.id;
    const giftId = req.params.giftId;
    try {
        const { name, priority, description, totalValue, categoryId } = giftValidator_1.updateGiftSchema.parse(req.body);
        const gift = await giftService_1.default.updateGiftService(userId, giftListId, giftId, { name, priority, description, totalValue, categoryId }, req);
        res.json(gift);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação', details: error.errors });
        }
        else {
            res.status(500).json({ error: 'Erro ao atualizar presente: ' + error.message });
        }
    }
};
exports.updateGift = updateGift;
const deleteGift = async (req, res) => {
    const id = req.params.giftId;
    try {
        const gift = await giftService_1.default.deleteGiftService(id);
        if (gift) {
            res.json(gift);
        }
        else {
            res.status(404).json({ error: 'Presente não encontrado' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar presente: ' + error.message });
    }
};
exports.deleteGift = deleteGift;
