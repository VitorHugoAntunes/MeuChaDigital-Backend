"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createInvitee = async (data) => {
    const invitee = await prisma.invitee.create({
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            giftList: { connect: { id: data.giftListId } },
            status: data.status,
        },
    });
    return invitee;
};
exports.default = { createInvitee };
