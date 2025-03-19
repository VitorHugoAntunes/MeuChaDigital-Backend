"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInviteeInDatabase = exports.updateInviteeInDatabase = exports.getAllInviteesByGiftListSlugFromDatabase = exports.getAllInviteesWithPaginationByGiftListSlugFromDatabase = exports.createInviteeInDatabase = void 0;
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
const getAllInviteesWithPaginationByGiftListSlugFromDatabase = async (slug, page = 1, limit = 10, search = "", status = "") => {
    const skip = (page - 1) * limit;
    const baseWhereClause = {
        giftList: { slug },
        AND: [
            {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { phone: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            },
        ],
    };
    if (status !== "") {
        baseWhereClause.AND.push({
            status: status.toUpperCase(),
        });
    }
    const [invitees, total, counts] = await Promise.all([
        prisma.invitee.findMany({
            where: baseWhereClause,
            skip,
            take: limit,
        }),
        prisma.invitee.count({
            where: baseWhereClause,
        }),
        prisma.invitee.groupBy({
            by: ["status"],
            where: { giftList: { slug } },
            _count: { status: true },
        }),
    ]);
    let totalWithoutPagination = 0;
    let totalAccepted = 0;
    let totalRejected = 0;
    for (const count of counts) {
        totalWithoutPagination += count._count.status;
        if (count.status === "ACCEPTED")
            totalAccepted = count._count.status;
        if (count.status === "REJECTED")
            totalRejected = count._count.status;
    }
    return {
        invitees,
        total,
        totalPages: Math.ceil(total / limit),
        totalWithoutPagination,
        totalAccepted,
        totalRejected,
    };
};
exports.getAllInviteesWithPaginationByGiftListSlugFromDatabase = getAllInviteesWithPaginationByGiftListSlugFromDatabase;
const getAllInviteesByGiftListSlugFromDatabase = async (slug) => {
    return prisma.invitee.findMany({
        where: {
            giftList: { slug },
        },
    });
};
exports.getAllInviteesByGiftListSlugFromDatabase = getAllInviteesByGiftListSlugFromDatabase;
const updateInviteeInDatabase = async (id, data) => {
    return prisma.invitee.update({
        where: {
            id,
        },
        data: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            additionalInvitees: data.additionalInvitees,
            observation: data.observation,
            status: data.status,
        },
    });
};
exports.updateInviteeInDatabase = updateInviteeInDatabase;
const deleteInviteeInDatabase = async (id) => {
    return prisma.invitee.delete({
        where: {
            id,
        },
    });
};
exports.deleteInviteeInDatabase = deleteInviteeInDatabase;
exports.default = {
    createInviteeInDatabase: exports.createInviteeInDatabase,
    getAllInviteesWithPaginationByGiftListSlugFromDatabase: exports.getAllInviteesWithPaginationByGiftListSlugFromDatabase,
    getAllInviteesByGiftListSlugFromDatabase: exports.getAllInviteesByGiftListSlugFromDatabase,
    updateInviteeInDatabase: exports.updateInviteeInDatabase,
    deleteInviteeInDatabase: exports.deleteInviteeInDatabase,
};
