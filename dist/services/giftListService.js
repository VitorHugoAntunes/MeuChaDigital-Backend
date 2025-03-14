"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageUploadService_1 = require("./imageUploadService");
const imageService_1 = require("./imageService");
const cleanUploadDirectory_1 = require("../utils/cleanUploadDirectory");
const entityExistenceChecks_1 = require("../utils/entityExistenceChecks");
const giftListRepository_1 = require("../repositories/giftListRepository");
const imageRepository_1 = require("../repositories/imageRepository");
const giftListRepository_2 = require("../repositories/giftListRepository");
const perf_hooks_1 = require("perf_hooks");
const createGiftListService = async (data, req, res) => {
    const startTime = perf_hooks_1.performance.now();
    console.time("Criar lista no banco");
    const giftList = await (0, giftListRepository_1.createGiftListInDatabase)(data);
    console.timeEnd("Criar lista no banco");
    const uploadedFilesUrls = await (0, imageUploadService_1.uploadLocalFilesToS3)(req.body.userId, giftList.id);
    console.time("Processar Banner e Imagens");
    const bannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
    const momentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];
    const [bannerId, momentsImages] = await Promise.all([
        (0, imageRepository_1.processBanner)(bannerUrl, giftList.id),
        (0, imageRepository_1.processMomentsImages)(momentsImagesUrls, giftList.id),
    ]);
    console.timeEnd("Upload para S3, Processar Banner e Imagens");
    console.time("Limpar diretório de uploads");
    (0, cleanUploadDirectory_1.cleanUploadDirectory)(req.body.userId);
    console.timeEnd("Limpar diretório de uploads");
    const endTime = perf_hooks_1.performance.now();
    console.log(`createGiftListService demorou ${(endTime - startTime).toFixed(2)}ms`);
    return giftList;
};
const getAllGiftListsService = async () => {
    return await (0, giftListRepository_1.getAllGiftListsInDatabase)();
};
const getGiftListByIdService = async (id) => {
    return await (0, giftListRepository_1.getGiftListByIdInDatabase)(id);
};
const getAllGiftListsByUserIdService = async (userId) => {
    return await (0, giftListRepository_1.getAllGiftListByUserIdInDatabase)(userId);
};
const getGiftListBySlugService = async (slug) => {
    return await (0, giftListRepository_1.getGiftListBySlugInDatabase)(slug);
};
const updateGiftListService = async (id, data, req, res) => {
    try {
        const existingGiftList = await (0, entityExistenceChecks_1.validateGiftListExists)(id);
        const hasNewImages = req.files['banner'] || req.files['moments_images'];
        await (0, imageUploadService_1.deleteOldImagesFromS3)(existingGiftList.userId, id, hasNewImages);
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
const checkUserHasActiveGiftLists = async (userId) => {
    return (0, giftListRepository_2.hasActiveGiftLists)(userId);
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
exports.default = {
    createGiftListService,
    getAllGiftListsService,
    getGiftListByIdService,
    getAllGiftListsByUserIdService,
    getGiftListBySlugService,
    updateGiftListService,
    checkUserHasActiveGiftLists,
    deleteGiftList
};
