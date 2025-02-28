"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGift = exports.getGifts = exports.getInvitation = void 0;
const invitationService_1 = require("../services/invitationService");
const getInvitation = async (req, res) => {
    const subdomain = req.subdomain;
    try {
        const giftList = await (0, invitationService_1.getGiftListBySubdomain)(subdomain);
        if (!giftList) {
            return res.status(404).send('Lista de presentes não encontrada');
        }
        res.json(giftList);
    }
    catch (error) {
        console.error('Erro ao buscar lista de presentes:', error);
        res.status(500).send('Erro interno do servidor');
    }
};
exports.getInvitation = getInvitation;
const getGifts = async (req, res) => {
    const subdomain = req.subdomain;
    try {
        const gifts = await (0, invitationService_1.getAllGiftsBySubdomain)(subdomain);
        res.json(gifts);
    }
    catch (error) {
        console.error('Erro ao buscar presentes:', error);
        res.status(500).send('Erro interno do servidor');
    }
};
exports.getGifts = getGifts;
const getGift = async (req, res) => {
    const subdomain = req.subdomain;
    const giftId = req.params.id;
    try {
        const gift = await (0, invitationService_1.getGiftByIdFromSubdomain)(subdomain, giftId);
        if (!gift) {
            return res.status(404).send('Presente não encontrado');
        }
        res.json(gift);
    }
    catch (error) {
        console.error('Erro ao buscar presente:', error);
        res.status(500).send('Erro interno do servidor');
    }
};
exports.getGift = getGift;
