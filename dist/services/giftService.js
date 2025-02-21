"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createGiftList = async (data) => {
    // Criando a lista de presentes primeiro
    const giftList = await prisma.giftList.create({
        data: {
            name: data.name,
            slug: data.slug,
            type: data.type,
            eventDate: new Date(data.eventDate),
            description: data.description,
            shareableLink: data.shareableLink ?? '',
            userId: data.userId,
            status: data.status,
            gifts: {
                create: data.gifts,
            },
        },
        include: {
            gifts: true,
        },
    });
    let bannerId = undefined;
    // Criando a imagem do banner, associando corretamente à giftList
    if (data.banner) {
        const createdBanner = await prisma.image.create({
            data: {
                url: data.banner,
                giftListId: giftList.id, // Agora associando corretamente
            },
        });
        bannerId = createdBanner.id;
    }
    let momentsImages = undefined;
    // Criando imagens de momentos, associando corretamente à giftList
    if (data.moments_images && data.moments_images.length > 0) {
        const createdImages = await Promise.all(data.moments_images.map(async (url) => {
            return prisma.image.create({
                data: {
                    url,
                    giftListId: giftList.id, // Associando corretamente
                },
            });
        }));
        momentsImages = { connect: createdImages.map((img) => ({ id: img.id })) };
    }
    const updatedGiftList = await prisma.giftList.update({
        where: { id: giftList.id },
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
    return updatedGiftList;
};
const getAllGiftLists = async () => {
    return await prisma.giftList.findMany({
        include: { banner: true, momentsImages: true },
    });
};
const getGiftListById = async (id) => {
    return await prisma.giftList.findUnique({
        where: { id },
        include: { banner: true, momentsImages: true },
    });
};
const createGift = async (data) => {
    let photoId = undefined;
    if (data.photo) {
        const createdPhoto = await prisma.image.create({
            data: { url: data.photo },
        });
        photoId = createdPhoto.id;
    }
    const gift = await prisma.gift.create({
        data: {
            name: data.name,
            description: data.description,
            priority: data.priority,
            totalValue: data.totalValue,
            giftListId: data.giftListId,
            categoryId: data.categoryId,
            photoId,
        },
        include: { photo: true },
    });
    return gift;
};
const getAllGifts = async () => {
    return await prisma.gift.findMany({ include: { photo: true } });
};
const getGiftById = async (id) => {
    return await prisma.gift.findUnique({
        where: { id },
        include: { photo: true },
    });
};
const updateGiftList = async (id, data) => {
    let bannerId = undefined;
    if (data.banner) {
        const createdBanner = await prisma.image.create({
            data: { url: data.banner },
        });
        bannerId = createdBanner.id;
    }
    const giftList = await prisma.giftList.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            bannerId,
            userId: data.userId,
            status: data.status,
        },
        include: { banner: true, momentsImages: true },
    });
    return giftList;
};
const updateGift = async (id, data) => {
    let photoId = undefined;
    if (data.photo) {
        const createdPhoto = await prisma.image.create({
            data: { url: data.photo },
        });
        photoId = createdPhoto.id;
    }
    const gift = await prisma.gift.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            totalValue: data.totalValue,
            giftListId: data.giftListId,
            categoryId: data.categoryId,
            photoId,
        },
        include: { photo: true },
    });
    return gift;
};
const deleteGiftList = async (id) => {
    const giftList = await prisma.giftList.findUnique({ where: { id } });
    if (!giftList)
        return null;
    if (giftList.status === 'ACTIVE') {
        throw new Error('Não é possível deletar uma lista de presentes ativa.');
    }
    return await prisma.giftList.delete({ where: { id } });
};
const deleteGift = async (id) => {
    return await prisma.gift.delete({ where: { id } });
};
exports.default = {
    createGiftList,
    getAllGiftLists,
    getGiftListById,
    createGift,
    getAllGifts,
    getGiftById,
    updateGiftList,
    updateGift,
    deleteGiftList,
    deleteGift,
};
