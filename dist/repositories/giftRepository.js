"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGiftFromDatabase = exports.updateGiftInDatabase = exports.getGiftByGiftListSlugFromDatabase = exports.getAllGiftsByGiftListSlugFromDatabase = exports.getGiftByIdFromDatabase = exports.getAllGiftsFromDatabase = exports.createGiftInDatabase = void 0;
const client_1 = require("@prisma/client");
const giftListRepository_1 = require("./giftListRepository");
const prisma = new client_1.PrismaClient();
const createGiftInDatabase = async (data) => {
    return prisma.gift.create({
        data: {
            name: data.name,
            description: data.description,
            priority: data.priority,
            totalValue: data.totalValue,
            giftListId: data.giftListId,
            categoryId: data.categoryId,
        },
        include: { photo: true },
    });
};
exports.createGiftInDatabase = createGiftInDatabase;
const getAllGiftsFromDatabase = async () => {
    return prisma.gift.findMany({ include: { photo: true } });
};
exports.getAllGiftsFromDatabase = getAllGiftsFromDatabase;
const getGiftByIdFromDatabase = async (id) => {
    return prisma.gift.findUnique({
        where: { id },
        include: { photo: true },
    });
};
exports.getGiftByIdFromDatabase = getGiftByIdFromDatabase;
const getAllGiftsByGiftListSlugFromDatabase = async (slug) => {
    const giftList = await (0, giftListRepository_1.getGiftListBySlugWithoutImagesInDatabase)(slug);
    if (!giftList) {
        return null;
    }
    return {
        giftList,
        gifts: await prisma.gift.findMany({
            where: { giftListId: giftList.id },
            include: { photo: true, category: true },
        }),
    };
};
exports.getAllGiftsByGiftListSlugFromDatabase = getAllGiftsByGiftListSlugFromDatabase;
const getGiftByGiftListSlugFromDatabase = async (slug, giftId) => {
    const giftList = await (0, giftListRepository_1.getGiftListBySlugInDatabase)(slug);
    if (!giftList) {
        return null;
    }
    return prisma.gift.findUnique({
        where: { id: giftId },
        include: { photo: true, category: true, list: true },
    });
};
exports.getGiftByGiftListSlugFromDatabase = getGiftByGiftListSlugFromDatabase;
const updateGiftInDatabase = async (id, data, photoId) => {
    return prisma.gift.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            totalValue: data.totalValue,
            categoryId: data.categoryId,
            photoId,
        },
        include: { photo: true },
    });
};
exports.updateGiftInDatabase = updateGiftInDatabase;
const deleteGiftFromDatabase = async (id) => {
    return prisma.$transaction(async (prisma) => {
        await prisma.charge.updateMany({
            where: { giftId: id },
            data: { giftId: null },
        });
        return prisma.gift.delete({
            where: { id },
        });
    });
};
exports.deleteGiftFromDatabase = deleteGiftFromDatabase;
