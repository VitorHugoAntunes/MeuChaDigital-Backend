"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGift = exports.deleteGiftList = exports.updateGift = exports.updateGiftList = exports.getGiftById = exports.getAllGifts = exports.createGift = exports.getGiftListById = exports.getAllGiftLists = exports.createGiftList = void 0;
const giftService_1 = __importDefault(require("../services/giftService"));
const giftListValidator_1 = require("../validators/giftListValidator");
const giftValidator_1 = require("../validators/giftValidator");
const zod_1 = require("zod");
const createGiftList = async (req, res) => {
    try {
        const { userId, type, name, slug, eventDate, description, banner, moments_images, shareableLink, status, gifts } = giftListValidator_1.createGiftListSchema.parse(req.body);
        const giftList = await giftService_1.default.createGiftList({ userId, type, name, slug, eventDate, description, banner, moments_images, shareableLink, status, gifts: gifts || [] });
        res.status(201).json(giftList);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação', details: error.errors });
        }
        else {
            res.status(500).json({ error: 'Erro ao criar lista de presentes: ' + error.message });
        }
    }
};
exports.createGiftList = createGiftList;
const getAllGiftLists = async (req, res) => {
    const giftLists = await giftService_1.default.getAllGiftLists();
    res.json(giftLists);
};
exports.getAllGiftLists = getAllGiftLists;
const getGiftListById = async (req, res) => {
    const id = req.params.id;
    const giftList = await giftService_1.default.getGiftListById(id);
    if (giftList) {
        res.json(giftList);
    }
    else {
        res.status(404).json({ error: 'Lista de presentes não encontrada' });
    }
};
exports.getGiftListById = getGiftListById;
const createGift = async (req, res) => {
    try {
        const { name, priority, description, photo, totalValue, categoryId, giftListId } = giftValidator_1.createGiftSchema.parse(req.body);
        const gift = await giftService_1.default.createGift({ name, priority, description, photo, totalValue, categoryId, giftListId });
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
    const gifts = await giftService_1.default.getAllGifts();
    res.json(gifts);
};
exports.getAllGifts = getAllGifts;
const getGiftById = async (req, res) => {
    const id = req.params.giftId;
    const gift = await giftService_1.default.getGiftById(id);
    if (gift) {
        res.json(gift);
    }
    else {
        res.status(404).json({ error: 'Presente não encontrado' });
    }
};
exports.getGiftById = getGiftById;
const updateGiftList = async (req, res) => {
    const id = req.params.giftId;
    try {
        const { userId, type, name, slug, eventDate, description, banner, moments_images, shareableLink, status, gifts } = giftListValidator_1.createGiftListSchema.parse(req.body);
        const giftList = await giftService_1.default.updateGiftList(id, { userId, type, name, slug, eventDate, description, banner, moments_images, shareableLink, status, gifts: gifts || [] });
        res.json(giftList);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação', details: error.errors });
        }
        else {
            res.status(500).json({ error: 'Erro ao atualizar lista de presentes: ' + error.message });
        }
    }
};
exports.updateGiftList = updateGiftList;
const updateGift = async (req, res) => {
    const id = req.params.giftId;
    try {
        const { name, priority, description, photo, totalValue, categoryId, giftListId } = giftValidator_1.createGiftSchema.parse(req.body);
        const gift = await giftService_1.default.updateGift(id, { name, priority, description, photo, totalValue, categoryId, giftListId });
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
const deleteGiftList = async (req, res) => {
    const id = req.params.giftId;
    try {
        const giftList = await giftService_1.default.deleteGiftList(id);
        if (giftList) {
            res.json(giftList);
        }
        else {
            res.status(404).json({ error: 'Lista de presentes não encontrada' });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar lista de presentes: ' + error.message });
    }
};
exports.deleteGiftList = deleteGiftList;
const deleteGift = async (req, res) => {
    const id = req.params.giftId;
    try {
        const gift = await giftService_1.default.deleteGift(id);
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
