"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInviteeInDatabase = void 0;
// src/repositories/inviteeRepository.ts
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createInviteeInDatabase = async (data) => {
    return prisma.invitee.create({
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            additionalInvitees: data.additionalInvitees,
            observation: data.observation,
            giftList: { connect: { id: data.giftListId } },
            status: data.status,
        },
    });
};
exports.createInviteeInDatabase = createInviteeInDatabase;
exports.default = {
    createInviteeInDatabase: exports.createInviteeInDatabase,
};
