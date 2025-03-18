"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGiftListFromDatabase = exports.hasActiveGiftLists = exports.getGiftListBySlugWithoutImagesInDatabase = exports.getGiftListBySlugInDatabase = exports.updateGiftListInDatabase = exports.getAllGiftListByUserIdInDatabase = exports.getGiftListByIdInDatabase = exports.getAllGiftListsInDatabase = exports.updateGiftListWithImages = exports.createGiftListInDatabase = void 0;
const client_1 = require("@prisma/client");
const formatSlug_1 = require("../utils/formatSlug");
const prisma = new client_1.PrismaClient();
const createGiftListInDatabase = async (data) => {
    return prisma.giftList.create({
        data: {
            name: data.name,
            slug: (0, formatSlug_1.formatSlug)(data.slug),
            type: data.type,
            eventDate: new Date(data.eventDate),
            description: data.description,
            shareableLink: `https://${(0, formatSlug_1.formatSlug)(data.slug)}.meuchadigital.com/invitation`,
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
    const giftList = await prisma.giftList.findUnique({
        where: { id },
        include: { banner: true, momentsImages: true },
    });
    if (!giftList) {
        throw new Error('Lista de presentes não encontrada.');
    }
    return giftList;
};
exports.getGiftListByIdInDatabase = getGiftListByIdInDatabase;
const getAllGiftListByUserIdInDatabase = async (userId) => {
    const giftLists = await prisma.giftList.findMany({
        where: { userId },
        include: {
            banner: true,
            _count: {
                select: { gifts: true },
            },
        },
    });
    return giftLists;
};
exports.getAllGiftListByUserIdInDatabase = getAllGiftListByUserIdInDatabase;
const getGiftListBySlugInDatabase = async (slug) => {
    return await prisma.giftList.findUnique({
        where: { slug },
        include: { banner: true, momentsImages: true },
    });
};
exports.getGiftListBySlugInDatabase = getGiftListBySlugInDatabase;
const getGiftListBySlugWithoutImagesInDatabase = async (slug) => {
    return await prisma.giftList.findUnique({
        where: { slug },
    });
};
exports.getGiftListBySlugWithoutImagesInDatabase = getGiftListBySlugWithoutImagesInDatabase;
const updateGiftListInDatabase = async (id, data, bannerId, momentsImages) => {
    // Isso filtra apenas os campos que realmente serão atualizados
    const updateData = {
        ...(data.name && { name: data.name }),
        ...(data.slug && { slug: (0, formatSlug_1.formatSlug)(data.slug) }),
        ...(data.type && { type: data.type }),
        ...(data.eventDate && { eventDate: new Date(data.eventDate) }),
        ...(data.description && { description: data.description }),
        ...(data.shareableLink && { shareableLink: data.shareableLink }),
        ...(data.status && { status: data.status }),
        ...(bannerId && { bannerId }),
    };
    if (momentsImages) {
        updateData.momentsImages = {
            connect: momentsImages.map((image) => ({ id: image.id })),
        };
    }
    return await prisma.giftList.update({
        where: { id },
        data: updateData,
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
    console.log('id da lista para que vai ser deletada', id);
    return await prisma.giftList.delete({ where: { id } });
};
exports.deleteGiftListFromDatabase = deleteGiftListFromDatabase;
