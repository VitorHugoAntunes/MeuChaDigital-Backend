"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const paymentService_1 = __importDefault(require("../services/paymentService"));
const axios_1 = __importDefault(require("axios"));
const efi_1 = require("../config/efi");
const prisma = new client_1.PrismaClient();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const EFI_URL = process.env.EFI_URL || 'https://pix.api.efipay.com.br';
const efiRequest = async (txtId) => {
    const credentials = await (0, efi_1.getEfiToken)();
    const URL = `${EFI_URL}/v2/cob/${txtId}`;
    const config = {
        httpsAgent: credentials.agent,
        headers: {
            Authorization: `Bearer ${credentials.token}`,
            'Content-Type': 'application/json',
        },
    };
    const response = await axios_1.default.get(URL, config);
    return response.data;
};
const createContribution = async (data) => {
    console.log('DADOS RECEBIDOS NO SERVICE DE CONTRIBUIÇÃO');
    console.log(data);
    const charge = await prisma.charge.findFirst({
        where: {
            txId: data.txId,
        },
    });
    if (!charge) {
        throw new Error('Charge not found');
    }
    const user = await prisma.user.findFirst({
        where: {
            id: charge?.payerId,
        },
    });
    if (!user) {
        throw new Error('User not found');
    }
    const paymentDate = await efiRequest(data.txId);
    const updatedCharge = await prisma.charge.update({
        where: {
            id: charge.id,
        },
        data: {
            paymentDate: paymentDate.pix[0].horario,
        },
    });
    const contribution = await prisma.contribution.create({
        data: {
            value: data.value,
            message: data.message,
            gift: {
                connect: {
                    id: charge.giftId,
                },
            },
            user: {
                connect: {
                    id: user.id,
                },
            },
        },
    });
    await paymentService_1.default.createPayment({
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
    createContribution,
};
