"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = __importDefault(require("../services/userService"));
const paymentRepository_1 = require("../repositories/paymentRepository");
const efiService_1 = __importDefault(require("../services/efiService"));
const generateChargeService = async (expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest) => {
    try {
        // Cria um usuário convidado, se necessário
        if (isGuest && !payerId) {
            const user = await userService_1.default.createGuestUser({ isGuest: true });
            payerId = user.id;
        }
        else if (!payerId) {
            throw new Error('PayerId não informado');
        }
        const chargeData = {
            calendario: { expiracao },
            valor: { original },
            chave,
            solicitacaoPagador,
        };
        const cobResponse = await efiService_1.default.generatePixCharge(chargeData);
        const qrCodeResponse = await efiService_1.default.getPixQrCode(cobResponse.loc.id);
        const charge = {
            localId: String(cobResponse.loc.id),
            txId: cobResponse.txid,
            giftId,
            payerId,
            value: Number(cobResponse.valor.original),
            paymentMethod: 'PIX',
            pixKey: cobResponse.chave,
            pixCopyAndPaste: cobResponse.pixCopiaECola,
            qrCode: qrCodeResponse.imagemQrcode,
            generatedAt: new Date(cobResponse.calendario.criacao),
            expirationDate: new Date(new Date().getTime() + cobResponse.calendario.expiracao * 1000),
        };
        await (0, paymentRepository_1.createChargeInDatabase)(charge);
        return cobResponse;
    }
    catch (error) {
        console.error(error);
        throw new Error('Erro ao gerar cobrança');
    }
};
const createPaymentService = async (data) => {
    return (0, paymentRepository_1.createPaymentInDatabase)(data);
};
exports.default = { generateChargeService, createPaymentService };
