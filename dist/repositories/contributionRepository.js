"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContributionInDatabase = exports.updateChargePaymentDate = exports.findUserById = exports.findChargeByTxId = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findChargeByTxId = async (txId) => {
    return prisma.charge.findFirst({
        where: { txId },
    });
};
exports.findChargeByTxId = findChargeByTxId;
const findUserById = async (userId) => {
    return prisma.user.findFirst({
        where: { id: userId },
    });
};
exports.findUserById = findUserById;
const updateChargePaymentDate = async (chargeId, paymentDate) => {
    return prisma.charge.update({
        where: { id: chargeId },
        data: { paymentDate },
    });
};
exports.updateChargePaymentDate = updateChargePaymentDate;
const createContributionInDatabase = async (data, giftId, userId) => {
    return prisma.contribution.create({
        data: {
            value: data.value,
            message: data.message,
            gift: { connect: { id: giftId } },
            user: { connect: { id: userId } },
        },
    });
};
exports.createContributionInDatabase = createContributionInDatabase;
