"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGiftListFromDatabase = exports.hasActiveGiftLists = exports.updateGiftListInDatabase = exports.getGiftListByIdInDatabase = exports.getAllGiftListsInDatabase = exports.updateGiftListWithImages = exports.createGiftListInDatabase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createGiftListInDatabase = async (data) => {
    return prisma.giftList.create({
        data: {
            name: data.name,
            slug: data.slug,
            type: data.type,
            eventDate: new Date(data.eventDate),
            description: data.description,
            shareableLink: data.shareableLink ?? '',
            userId: data.userId,
            status: data.status,
        },
        include: {
            gifts: true,
        },
    });
};
exports.createGiftListInDatabase = createGiftListInDatabase;
const updateGiftListWithImages = async (giftListId, bannerId, momentsImages) => {
    return prisma.giftList.update({
        where: { id: giftListId },
        data: {
            bannerId,
            momentsImages,
        },
        include: {
            banner: true,
            momentsImages: true,
            gifts: true,
        },
    });
};
exports.updateGiftListWithImages = updateGiftListWithImages;
const getAllGiftListsInDatabase = async () => {
    return await prisma.giftList.findMany({
        include: { banner: true, momentsImages: true },
    });
};
exports.getAllGiftListsInDatabase = getAllGiftListsInDatabase;
const getGiftListByIdInDatabase = async (id) => {
    return await prisma.giftList.findUnique({
        where: { id },
        include: { banner: true, momentsImages: true },
    });
};
exports.getGiftListByIdInDatabase = getGiftListByIdInDatabase;
const updateGiftListInDatabase = async (id, data, bannerId, momentsImages) => {
    return await prisma.giftList.update({
        where: { id },
        data: {
            name: data.name,
            slug: data.slug,
            type: data.type,
            eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
            description: data.description,
            shareableLink: data.shareableLink,
            status: data.status,
            bannerId,
            momentsImages,
        },
        include: {
            banner: true,
            momentsImages: true,
            gifts: true,
        },
    });
};
exports.updateGiftListInDatabase = updateGiftListInDatabase;
const hasActiveGiftLists = async (userId) => {
    return await prisma.giftList.findFirst({
        where: { userId, status: 'ACTIVE' },
    });
};
exports.hasActiveGiftLists = hasActiveGiftLists;
const deleteGiftListFromDatabase = async (id) => {
    return await prisma.giftList.delete({ where: { id } });
};
exports.deleteGiftListFromDatabase = deleteGiftListFromDatabase;
