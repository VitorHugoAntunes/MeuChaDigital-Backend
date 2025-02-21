"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPayment = exports.createCharge = void 0;
const paymentService_1 = __importDefault(require("../services/paymentService"));
const createCharge = async (req, res) => {
    const { expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest } = req.body;
    const charge = await paymentService_1.default.generateCharge(expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest);
    res.json(charge);
};
exports.createCharge = createCharge;
const createPayment = async (req, res) => {
    const { status, paymentMethod, pixKey, paymentDate, contributionId } = req.body;
    const payment = await paymentService_1.default.createPayment({ status, paymentMethod, pixKey, paymentDate, contributionId });
    res.json(payment);
};
exports.createPayment = createPayment;
