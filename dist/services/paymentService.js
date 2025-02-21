"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const efi_1 = require("../config/efi");
const process_1 = require("process");
const client_1 = require("@prisma/client");
const userService_1 = __importDefault(require("../services/userService"));
const prisma = new client_1.PrismaClient();
const EFI_URL = process_1.env.EFI_URL || 'https://pix.api.efipay.com.br';
const generateCharge = async (expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest) => {
    const credentials = await (0, efi_1.getEfiToken)();
    console.log(credentials);
    const chargeData = {
        calendario: {
            expiracao: expiracao,
        },
        valor: {
            original: original,
        },
        chave: chave,
        solicitacaoPagador: solicitacaoPagador,
    };
    const config = {
        httpsAgent: credentials.agent,
        headers: {
            Authorization: `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
    };
    try {
        if (isGuest && !payerId) {
            const user = await userService_1.default.createGuestUser({ isGuest: true });
            payerId = user.id;
        }
        else if (!payerId) {
            return { error: 'PayerId não informado' };
        }
        const response = await axios_1.default.post(`${EFI_URL}/v2/cob`, chargeData, config);
        console.log(response.data);
        const qrCode = await axios_1.default.get(`${EFI_URL}/v2/loc/${response.data.loc.id}/qrcode`, config);
        const charge = {
            localId: String(response.data.loc.id), // Pois vem da EFI como number
            txId: response.data.txid,
            giftId: giftId,
            payerId: payerId,
            value: Number(response.data.valor.original), // Pois vem da EFI como string
            paymentMethod: 'PIX',
            pixKey: response.data.chave,
            pixCopyAndPaste: response.data.pixCopiaECola,
            qrCode: qrCode.data.imagemQrcode,
            generatedAt: new Date(response.data.calendario.criacao),
            // a expiracao vem em formato de segundos, exemplo: 3600 que da 1 hora
            expirationDate: new Date(new Date().getTime() + (response.data.calendario.expiracao * 1000)),
        };
        try {
            await prisma.charge.create({
                data: {
                    ...charge,
                    giftId: giftId,
                    payerId: payerId,
                },
            });
        }
        catch (error) {
            console.error(error);
            return { error: 'Erro ao salvar cobrança no banco de dados' };
        }
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error(error.response?.data || error.message);
            return { error: error.response?.data || 'Erro na requisição' };
        }
        else {
            console.error(error);
            return { error: 'Erro desconhecido' };
        }
    }
};
const createPayment = async (data) => {
    const payment = await prisma.payment.create({
        data: {
            status: data.status,
            paymentMethod: data.paymentMethod,
            pixKey: data.pixKey,
            paymentDate: data.paymentDate,
            contribution: {
                connect: {
                    id: data.contributionId,
                },
            },
        },
    });
    return payment;
};
exports.default = { generateCharge, createPayment };
