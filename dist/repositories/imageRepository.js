"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBannerFromGiftList = exports.deleteImageFromGift = exports.deleteImagesFromGiftList = exports.processMomentsImages = exports.processBanner = exports.processGiftImage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const processBanner = async (bannerUrl, giftListId) => {
    if (!bannerUrl)
        return undefined;
    const existingBanner = await prisma.image.findFirst({
        where: {
            bannerForGiftListId: giftListId,
        },
    });
    if (existingBanner) {
        await prisma.image.delete({
            where: {
                id: existingBanner.id,
            },
        });
    }
    const createdBanner = await prisma.image.create({
        data: {
            url: bannerUrl,
            type: 'BANNER',
            bannerForGiftListId: giftListId,
        },
    });
    return createdBanner.id;
};
exports.processBanner = processBanner;
const processMomentsImages = async (momentsUrls, giftListId) => {
    return await prisma.$transaction(async (prisma) => {
        await prisma.image.deleteMany({
            where: { momentsForGiftListId: giftListId },
        });
        await prisma.image.createMany({
            data: momentsUrls.map((url) => ({
                url,
                type: 'MOMENT',
                momentsForGiftListId: giftListId,
            })),
        });
        const momentsImages = await prisma.image.findMany({
            where: { momentsForGiftListId: giftListId },
        });
        return momentsImages;
    });
};
exports.processMomentsImages = processMomentsImages;
const processGiftImage = async (url, giftId) => {
    const createdImage = await prisma.image.create({
        data: { url, type: 'GIFT', giftId },
    });
    return createdImage.id;
};
exports.processGiftImage = processGiftImage;
const deleteImagesFromGiftList = async (imageIds) => {
    return await prisma.image.deleteMany({
        where: {
            id: {
                in: imageIds,
            },
        },
    });
};
exports.deleteImagesFromGiftList = deleteImagesFromGiftList;
const deleteImageFromGift = async (imageId) => {
    return await prisma.image.delete({
        where: {
            id: imageId,
        },
    });
};
exports.deleteImageFromGift = deleteImageFromGift;
const deleteBannerFromGiftList = async (giftListId) => {
    return await prisma.image.deleteMany({
        where: {
            bannerForGiftListId: giftListId,
        },
    });
};
exports.deleteBannerFromGiftList = deleteBannerFromGiftList;
