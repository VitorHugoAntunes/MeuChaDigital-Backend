"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageUploadService_1 = require("./imageUploadService");
const cleanUploadDirectory_1 = require("../utils/cleanUploadDirectory");
const giftRepository_1 = require("../repositories/giftRepository");
const imageRepository_1 = require("../repositories/imageRepository");
const imageService_1 = require("./imageService");
const giftListRepository_1 = require("../repositories/giftListRepository");
const createGiftService = async (data, req, res) => {
    const gift = await (0, giftRepository_1.createGiftInDatabase)(data);
    const uploadedFilesUrls = await (0, imageUploadService_1.uploadLocalFilesToS3)(req.body.userId, data.giftListId, "giftPhoto", gift.id);
    const giftPhotoUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
    if (giftPhotoUrl) {
        const photoId = await (0, imageRepository_1.processGiftImage)(giftPhotoUrl, gift.id);
        await (0, giftRepository_1.updateGiftInDatabase)(gift.id, data, photoId);
    }
    (0, cleanUploadDirectory_1.cleanUploadDirectory)(req.body.userId);
    return gift;
};
const getAllGiftsService = async () => {
    return await (0, giftRepository_1.getAllGiftsFromDatabase)();
};
const getAllGiftsByGiftListSlugService = async (slug) => {
    return await (0, giftRepository_1.getAllGiftsByGiftListSlugFromDatabase)(slug);
};
const getGiftByIdService = async (id) => {
    return await (0, giftRepository_1.getGiftByIdFromDatabase)(id);
};
const getGiftByGiftListSlugService = async (slug, giftId) => {
    return await (0, giftRepository_1.getGiftByGiftListSlugFromDatabase)(slug, giftId);
};
const updateGiftService = async (userId, giftListId, giftId, data, req) => {
    try {
        const existingGift = await (0, giftRepository_1.getGiftByIdFromDatabase)(giftId);
        const hasNewImage = !!req.files?.giftPhoto;
        console.log({
            userId,
            giftListId,
            giftId,
            hasNewImage,
        });
        await (0, imageUploadService_1.deleteOldImagesFromS3)(userId, giftListId, hasNewImage, req, giftId);
        if (!existingGift) {
            throw new Error('Gift not found');
        }
        const { newGiftPhotoUrl } = await (0, imageUploadService_1.uploadNewImages)(userId, giftListId, req.files, giftId);
        const photoId = await (0, imageService_1.updateGiftImage)(giftId, newGiftPhotoUrl, existingGift.photo?.id);
        (0, cleanUploadDirectory_1.cleanUploadDirectory)(giftListId);
        console.log('giftId', giftId);
        return await (0, giftRepository_1.updateGiftInDatabase)(giftId, data, photoId);
    }
    catch (error) {
        console.error('Error updating gift:', error);
        throw error;
    }
};
const deleteGiftService = async (id) => {
    const gift = await (0, giftRepository_1.getGiftByIdFromDatabase)(id);
    if (!gift) {
        throw new Error('Gift not found');
    }
    const giftList = await (0, giftListRepository_1.getGiftListByIdInDatabase)(gift.giftListId);
    const userId = giftList?.userId;
    if (!userId) {
        throw new Error('User not found');
    }
    await (0, imageUploadService_1.deleteS3Files)(userId, gift.giftListId, true, id);
    return await (0, giftRepository_1.deleteGiftFromDatabase)(id);
};
exports.default = {
    createGiftService,
    getAllGiftsService,
    getAllGiftsByGiftListSlugService,
    getGiftByIdService,
    getGiftByGiftListSlugService,
    updateGiftService,
    deleteGiftService,
};
