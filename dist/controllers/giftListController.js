"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGiftList = exports.updateGiftList = exports.getGiftListBySlug = exports.getAllGiftListsByUserId = exports.getAllGiftLists = exports.createGiftList = void 0;
const giftListService_1 = __importDefault(require("../services/giftListService"));
const giftListValidator_1 = require("../validators/giftListValidator");
const zod_1 = require("zod");
const createGiftList = async (req, res) => {
    try {
        const parsedGifts = req.body.gifts ? JSON.parse(req.body.gifts) : [];
        const { userId, type, name, slug, eventDate, description, status } = giftListValidator_1.createGiftListSchema.parse({ ...req.body, gifts: parsedGifts });
        const giftList = await giftListService_1.default.createGiftListService({ userId, type, name, slug, eventDate, description, status, gifts: parsedGifts }, req, res);
        res.status(201).json({ message: 'Lista de presentes criada com sucesso', giftList });
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao criar lista de presentes', details: error.message });
    }
};
exports.createGiftList = createGiftList;
const getAllGiftLists = async (req, res) => {
    const giftLists = await giftListService_1.default.getAllGiftListsService();
    res.json(giftLists);
};
exports.getAllGiftLists = getAllGiftLists;
// export const getGiftListById = async (req: Request, res: Response) => {
//   const id = req.params.id;
//   const giftList = await GiftListService.getGiftListByIdService(id);
//   if (giftList) {
//     res.json(giftList);
//   } else {
//     res.status(404).json({ error: 'Lista de presentes não encontrada' });
//   }
// }
const getAllGiftListsByUserId = async (req, res) => {
    const userId = req.params.userId;
    const giftLists = await giftListService_1.default.getAllGiftListsByUserIdService(userId);
    res.json(giftLists);
};
exports.getAllGiftListsByUserId = getAllGiftListsByUserId;
const getGiftListBySlug = async (req, res) => {
    const slug = req.params.slug;
    const giftList = await giftListService_1.default.getGiftListBySlugService(slug);
    if (giftList) {
        res.json(giftList);
    }
    else {
        res.status(404).json({ error: 'Lista de presentes não encontrada' });
    }
};
exports.getGiftListBySlug = getGiftListBySlug;
const updateGiftList = async (req, res) => {
    const id = req.params.id;
    try {
        const { userId, giftListId, type, name, slug, eventDate, description, status } = giftListValidator_1.updateGiftListSchema.parse(req.body);
        console.log('req.body', req.body);
        const giftList = await giftListService_1.default.updateGiftListService(id, { userId, giftListId, type, name, slug, eventDate, description, status }, req, res);
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
const deleteGiftList = async (req, res) => {
    const id = req.params.id;
    try {
        const deleted = await giftListService_1.default.deleteGiftList(id);
        if (deleted) {
            res.status(204).send();
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
