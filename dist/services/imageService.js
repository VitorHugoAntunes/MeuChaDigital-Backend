"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGiftImage = exports.updateMomentsImages = exports.updateBanner = void 0;
const imageRepository_1 = require("../repositories/imageRepository");
const updateBanner = async (giftListId, newBannerUrl, existingBannerId) => {
    if (newBannerUrl) {
        if (existingBannerId) {
            await (0, imageRepository_1.deleteImagesFromGiftList)([existingBannerId]);
        }
        const createdBanner = await (0, imageRepository_1.processBanner)(newBannerUrl, giftListId);
        return createdBanner;
    }
    return existingBannerId;
};
exports.updateBanner = updateBanner;
const updateMomentsImages = async (giftListId, newMomentsImagesUrls, existingMomentsImages) => {
    if (newMomentsImagesUrls.length > 0) {
        if (existingMomentsImages) {
            await (0, imageRepository_1.deleteImagesFromGiftList)(existingMomentsImages.map((img) => img.id));
        }
        const createdImages = await (0, imageRepository_1.processMomentsImages)(newMomentsImagesUrls, giftListId);
        if (!createdImages || !Array.isArray(createdImages)) {
            return undefined;
        }
        return {
            connect: createdImages.map((img) => ({ id: img.id })),
        };
    }
    return undefined;
};
exports.updateMomentsImages = updateMomentsImages;
const updateGiftImage = async (giftId, newImageUrl, existingImageId) => {
    if (newImageUrl) {
        if (existingImageId) {
            await (0, imageRepository_1.deleteImageFromGift)(existingImageId);
        }
        const createdImage = await (0, imageRepository_1.processGiftImage)(newImageUrl, giftId);
        return createdImage;
    }
    return existingImageId;
};
exports.updateGiftImage = updateGiftImage;
