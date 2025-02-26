"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageUploadService_1 = require("./imageUploadService");
const imageService_1 = require("./imageService");
const cleanUploadDirectory_1 = require("../utils/cleanUploadDirectory");
const giftListValidation_1 = require("../utils/giftListValidation");
const giftListRepository_1 = require("../repositories/giftListRepository");
const imageRepository_1 = require("../repositories/imageRepository");
const createGiftListService = async (data, req, res) => {
    const giftList = await (0, giftListRepository_1.createGiftListInDatabase)(data);
    const uploadedFilesUrls = await (0, imageUploadService_1.uploadLocalFilesToS3)(req.body.userId, giftList.id);
    const bannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
    const momentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];
    const bannerId = await (0, imageRepository_1.processBanner)(bannerUrl, giftList.id);
    const momentsImages = await (0, imageRepository_1.processMomentsImages)(momentsImagesUrls, giftList.id);
    const updatedGiftList = await (0, giftListRepository_1.updateGiftListWithImages)(giftList.id, bannerId, momentsImages);
    (0, cleanUploadDirectory_1.cleanUploadDirectory)(req.body.userId);
    return updatedGiftList;
};
const getAllGiftListsService = async () => {
    return await (0, giftListRepository_1.getAllGiftListsInDatabase)();
};
const getGiftListByIdService = async (id) => {
    return await (0, giftListRepository_1.getGiftListByIdInDatabase)(id);
};
const updateGiftListService = async (id, data, req, res) => {
    try {
        const existingGiftList = await (0, giftListValidation_1.validateGiftListExists)(id);
        const hasNewImages = req.files['banner'] || req.files['moments_images'];
        await (0, giftListValidation_1.deleteOldImagesFromS3)(existingGiftList.userId, id, hasNewImages);
        const { newBannerUrl, newMomentsImagesUrls } = await (0, imageUploadService_1.uploadNewImages)(existingGiftList.userId, id, req.files);
        const bannerId = await (0, imageService_1.updateBanner)(id, newBannerUrl, existingGiftList.banner?.id);
        const momentsImages = await (0, imageService_1.updateMomentsImages)(id, newMomentsImagesUrls, existingGiftList.momentsImages);
        const updatedGiftList = await (0, giftListRepository_1.updateGiftListInDatabase)(id, data, bannerId, momentsImages);
        (0, cleanUploadDirectory_1.cleanUploadDirectory)(existingGiftList.userId);
        return updatedGiftList;
    }
    catch (error) {
        console.error("Erro ao atualizar a lista de presentes:", error);
        throw error;
    }
};
const deleteGiftList = async (id) => {
    const giftList = await (0, giftListRepository_1.getGiftListByIdInDatabase)(id);
    if (!giftList)
        return null;
    if (giftList.status === 'ACTIVE') {
        throw new Error('Não é possível deletar uma lista de presentes ativa.');
    }
    await (0, imageUploadService_1.deleteS3Files)(giftList.userId, id, true);
    return await (0, giftListRepository_1.deleteGiftListFromDatabase)(id);
};
exports.default = { createGiftListService, getAllGiftListsService, getGiftListByIdService, updateGiftListService, deleteGiftList };
