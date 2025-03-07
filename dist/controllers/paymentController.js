"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCharge = exports.createPayment = exports.createCharge = void 0;
const paymentService_1 = __importDefault(require("../services/paymentService"));
const createCharge = async (req, res) => {
    const { expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest } = req.body;
    const charge = await paymentService_1.default.generateChargeService(expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest);
    res.json(charge);
};
exports.createCharge = createCharge;
const createPayment = async (req, res) => {
    const { status, paymentMethod, pixKey, paymentDate, contributionId } = req.body;
    const payment = await paymentService_1.default.createPaymentService({ status, paymentMethod, pixKey, paymentDate, contributionId });
    res.json(payment);
};
exports.createPayment = createPayment;
const getCharge = async (req, res) => {
    const { id } = req.params;
    const { giftId } = req.query;
    try {
        const charge = await paymentService_1.default.getChargeService(id, giftId);
        if (!charge) {
            res.status(404).json({ error: 'Cobrança não encontrada ou expirada' });
            return;
        }
        res.json(charge);
    }
    catch (error) {
        console.error('Erro ao buscar cobrança:', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};
exports.getCharge = getCharge;
