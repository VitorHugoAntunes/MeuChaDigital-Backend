"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCharge = void 0;
const paymentService_1 = require("../services/paymentService");
const createCharge = async (req, res) => {
    const { expiracao, original, chave, solicitacaoPagador } = req.body;
    const charge = await (0, paymentService_1.generateCharge)(expiracao, original, chave, solicitacaoPagador);
    res.json(charge);
};
exports.createCharge = createCharge;
