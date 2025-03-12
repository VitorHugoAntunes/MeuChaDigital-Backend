"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const paymentService_1 = __importDefault(require("./paymentService"));
const contributionRepository_1 = require("../repositories/contributionRepository");
const efiService_1 = __importDefault(require("../services/efiService"));
const createContributionService = async (data) => {
    console.log('DADOS RECEBIDOS NO SERVICE DE CONTRIBUIÇÃO');
    console.log(data);
    const charge = await (0, contributionRepository_1.findChargeByTxId)(data.txId);
    if (!charge) {
        throw new Error('Charge not found');
    }
    // Buscar o usuário pelo ID do pagador
    const user = await (0, contributionRepository_1.findUserById)(charge.payerId);
    if (!user) {
        throw new Error('User not found');
    }
    const paymentDate = await efiService_1.default.getChargeByTxId(data.txId);
    await (0, contributionRepository_1.updateChargePaymentDate)(charge.id, paymentDate.pix[0].horario);
    if (charge.giftId === null) {
        return;
    }
    const contribution = await (0, contributionRepository_1.createContributionInDatabase)(data, charge.giftId, user.id);
    await paymentService_1.default.createPaymentService({
        status: 'PAID',
        paymentMethod: charge.paymentMethod,
        pixKey: charge.pixKey,
        paymentDate: paymentDate.pix[0].horario,
        contributionId: contribution.id,
    });
    console.log('Passou pelo service de contribuição');
    console.log(contribution);
    return contribution;
};
exports.default = {
    createContributionService,
};
