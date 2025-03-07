"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentInDatabase = exports.getChargeInDatabase = exports.createChargeInDatabase = void 0;
// src/repositories/paymentRepository.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createChargeInDatabase = async (data) => {
    return prisma.charge.create({
        data: {
            localId: data.localId,
            txId: data.txId,
            giftId: data.giftId,
            payerId: data.payerId,
            value: data.value,
            paymentMethod: data.paymentMethod,
            pixKey: data.pixKey,
            pixCopyAndPaste: data.pixCopyAndPaste,
            qrCode: data.qrCode,
            generatedAt: data.generatedAt,
            expirationDate: data.expirationDate,
        },
    });
};
exports.createChargeInDatabase = createChargeInDatabase;
const getChargeInDatabase = async (id, giftId) => {
    return prisma.charge.findFirst({
        where: {
            localId: id,
            giftId,
            expirationDate: {
                gte: new Date(),
            },
        },
        orderBy: { createdAt: 'desc' },
    });
};
exports.getChargeInDatabase = getChargeInDatabase;
const createPaymentInDatabase = async (data) => {
    return prisma.payment.create({
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
};
exports.createPaymentInDatabase = createPaymentInDatabase;
exports.default = {
    createChargeInDatabase: exports.createChargeInDatabase,
    createPaymentInDatabase: exports.createPaymentInDatabase,
    getChargeInDatabase: exports.getChargeInDatabase,
};
