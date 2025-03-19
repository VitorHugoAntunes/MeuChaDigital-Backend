"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInvitee = exports.updateInvitee = exports.getAllInviteesByGiftListSlug = exports.getAllInviteesWithPaginationByGiftListSlug = exports.createInvitee = void 0;
const inviteeService_1 = __importDefault(require("../services/inviteeService"));
const inviteeValidator_1 = require("../validators/inviteeValidator");
const zod_1 = require("zod");
const createInvitee = async (req, res) => {
    try {
        const { name, phone, email, additionalInvitees, observation, giftListId, status } = inviteeValidator_1.createInviteeSchema.parse(req.body);
        const invitee = await inviteeService_1.default.createInviteeService({ name, phone, email, additionalInvitees, observation, giftListId, status });
        res.status(201).json(invitee);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação', details: error.errors });
        }
        else {
            res.status(500).json({ error: 'Erro ao criar convidado: ' + error.message });
        }
    }
};
exports.createInvitee = createInvitee;
const getAllInviteesWithPaginationByGiftListSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const { page, limit, search, status } = req.query;
        const pageNumber = parseInt(page) || 1;
        const limitNumber = parseInt(limit) || 10;
        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            return res.status(400).json({ error: 'Parâmetros de paginação inválidos.' });
        }
        const invitees = await inviteeService_1.default.getAllInviteesWithPaginationByGiftListSlugService(slug, pageNumber, limitNumber, search, status);
        return res.status(200).json(invitees);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar convidados: ' + error.message });
    }
};
exports.getAllInviteesWithPaginationByGiftListSlug = getAllInviteesWithPaginationByGiftListSlug;
const getAllInviteesByGiftListSlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const invitees = await inviteeService_1.default.getAllInviteesByGiftListSlugService(slug);
        return res.status(200).json(invitees);
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao buscar convidados: ' + error.message });
    }
};
exports.getAllInviteesByGiftListSlug = getAllInviteesByGiftListSlug;
const updateInvitee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email, additionalInvitees, observation, status } = inviteeValidator_1.updateInviteeSchema.parse(req.body);
        const invitee = await inviteeService_1.default.updateInviteeService(id, { name, phone, email, additionalInvitees, observation, status });
        res.status(200).json(invitee);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            res.status(400).json({ error: 'Erro de validação', details: error.errors });
        }
        else {
            res.status(500).json({ error: 'Erro ao atualizar convidado: ' + error.message });
        }
    }
};
exports.updateInvitee = updateInvitee;
const deleteInvitee = async (req, res) => {
    try {
        const { id } = req.params;
        await inviteeService_1.default.deleteInviteeService(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ error: 'Erro ao deletar convidado: ' + error.message });
    }
};
exports.deleteInvitee = deleteInvitee;
