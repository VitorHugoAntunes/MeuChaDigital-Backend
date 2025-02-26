"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOldImagesFromS3 = exports.validateGiftListExists = void 0;
const giftListRepository_1 = require("../repositories/giftListRepository");
const imageUploadService_1 = require("../services/imageUploadService");
const validateGiftListExists = async (id) => {
    const existingGiftList = await (0, giftListRepository_1.getGiftListById)(id);
    if (!existingGiftList) {
        throw new Error("Lista de presentes não encontrada.");
    }
    return existingGiftList;
};
exports.validateGiftListExists = validateGiftListExists;
const deleteOldImagesFromS3 = async (userId, giftListId, hasNewImages) => {
    if (hasNewImages) {
        await (0, imageUploadService_1.deleteS3Files)(userId, giftListId, false);
    }
};
exports.deleteOldImagesFromS3 = deleteOldImagesFromS3;
