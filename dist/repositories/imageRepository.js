"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImageFromGift = exports.deleteImagesFromGiftList = exports.processMomentsImages = exports.processBanner = exports.processGiftImage = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const processBanner = async (bannerUrl, giftListId) => {
    if (!bannerUrl)
        return undefined;
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
const processMomentsImages = async (momentsImagesUrls, giftListId) => {
    if (momentsImagesUrls.length === 0)
        return undefined;
    const createdImages = await Promise.all(momentsImagesUrls.map(async (url) => {
        return prisma.image.create({
            data: {
                url,
                type: 'MOMENT',
                momentsForGiftListId: giftListId,
            },
        });
    }));
    return {
        connect: createdImages.map((img) => ({ id: img.id })),
    };
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
