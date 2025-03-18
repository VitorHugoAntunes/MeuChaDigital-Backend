"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const imageUploadService_1 = require("./imageUploadService");
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
    console.time("Upload para S3");
    const [bannerUrls, momentsUrls] = await Promise.all([
        req.files['banner']
            ? (0, imageUploadService_1.uploadLocalFilesToS3)(req.body.userId, giftList.id, 'banner')
            : Promise.resolve([]),
        req.files['moments_images']
            ? (0, imageUploadService_1.uploadLocalFilesToS3)(req.body.userId, giftList.id, 'moments')
            : Promise.resolve([]),
    ]);
    console.timeEnd("Upload para S3");
    console.time("Processar Banner e Imagens");
    const bannerUrl = bannerUrls.length > 0 ? bannerUrls[0] : undefined;
    const bannerId = await (0, imageRepository_1.processBanner)(bannerUrl, giftList.id);
    const momentsImages = await (0, imageRepository_1.processMomentsImages)(momentsUrls, giftList.id);
    console.timeEnd("Processar Banner e Imagens");
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
// const getGiftListByIdService = async (id: string) => {
//   const giftlist = await getGiftListByIdInDatabase(id, "getGiftListByIdService");
//   if (!giftlist) {
//     throw new Error('Lista de presentes não encontrada.');
//   }
//   return giftlist;
// };
const getAllGiftListsByUserIdService = async (userId) => {
    return await (0, giftListRepository_1.getAllGiftListByUserIdInDatabase)(userId);
};
const getGiftListBySlugService = async (slug) => {
    return await (0, giftListRepository_1.getGiftListBySlugInDatabase)(slug);
};
const updateGiftListService = async (id, data, req, res) => {
    try {
        const startTotal = perf_hooks_1.performance.now();
        const existingGiftList = await (0, entityExistenceChecks_1.validateGiftListExists)(id);
        if (!existingGiftList)
            throw new Error("Lista de presentes não encontrada.");
        const { momentsImagesToDelete } = data;
        const hasNewBanner = !!req.files?.['banner'];
        const hasNewMomentsImages = !!req.files?.['moments_images'];
        let newBannerId = existingGiftList.bannerId || undefined;
        let newMomentsImages = existingGiftList.momentsImages || [];
        const asyncOperations = [];
        if (hasNewBanner) {
            asyncOperations.push((async () => {
                const start = perf_hooks_1.performance.now();
                await Promise.all([
                    (0, imageUploadService_1.deleteS3Files)(existingGiftList.userId, existingGiftList.id, false, undefined, 'banner'),
                    existingGiftList.bannerId ? (0, imageRepository_1.deleteBannerFromGiftList)(existingGiftList.id) : Promise.resolve()
                ]);
                console.log(`⏳ Tempo para deletar banner: ${(perf_hooks_1.performance.now() - start).toFixed(2)}ms`);
                const uploadStart = perf_hooks_1.performance.now();
                const [bannerUrl] = await (0, imageUploadService_1.uploadLocalFilesToS3)(existingGiftList.userId, existingGiftList.id, 'banner');
                console.log(`⏳ Tempo para upload do banner: ${(perf_hooks_1.performance.now() - uploadStart).toFixed(2)}ms`);
                if (bannerUrl) {
                    const processStart = perf_hooks_1.performance.now();
                    newBannerId = await (0, imageRepository_1.processBanner)(bannerUrl, existingGiftList.id);
                    console.log(`⏳ Tempo para processar banner: ${(perf_hooks_1.performance.now() - processStart).toFixed(2)}ms`);
                }
            })());
        }
        if (hasNewMomentsImages) {
            asyncOperations.push((async () => {
                const start = perf_hooks_1.performance.now();
                await (0, imageUploadService_1.deleteS3Files)(existingGiftList.userId, existingGiftList.id, false, undefined, 'moments');
                console.log(`⏳ Tempo para deletar imagens de momentos: ${(perf_hooks_1.performance.now() - start).toFixed(2)}ms`);
                const uploadStart = perf_hooks_1.performance.now();
                const momentsUrls = await (0, imageUploadService_1.uploadLocalFilesToS3)(existingGiftList.userId, existingGiftList.id, 'moments');
                console.log(`⏳ Tempo para upload das imagens de momentos: ${(perf_hooks_1.performance.now() - uploadStart).toFixed(2)}ms`);
                if (momentsUrls.length > 0) {
                    const processStart = perf_hooks_1.performance.now();
                    newMomentsImages = await (0, imageRepository_1.processMomentsImages)(momentsUrls, existingGiftList.id);
                    console.log(`⏳ Tempo para processar imagens de momentos: ${(perf_hooks_1.performance.now() - processStart).toFixed(2)}ms`);
                }
            })());
        }
        if (momentsImagesToDelete?.length) {
            asyncOperations.push((async () => {
                const start = perf_hooks_1.performance.now();
                await (0, imageUploadService_1.deleteSpecificMomentsImages)(existingGiftList.userId, existingGiftList.id, momentsImagesToDelete);
                newMomentsImages = newMomentsImages.filter((image) => !momentsImagesToDelete.includes(image.id));
                console.log(`⏳ Tempo para deletar imagens específicas: ${(perf_hooks_1.performance.now() - start).toFixed(2)}ms`);
            })());
        }
        await Promise.all(asyncOperations);
        const dbStart = perf_hooks_1.performance.now();
        const updatedGiftList = await (0, giftListRepository_1.updateGiftListInDatabase)(id, {
            name: data.name,
            slug: data.slug,
            type: data.type,
            eventDate: data.eventDate,
            description: data.description,
            shareableLink: data.shareableLink,
            status: data.status,
        }, newBannerId, newMomentsImages);
        console.log(`⏳ Tempo para atualizar no banco de dados: ${(perf_hooks_1.performance.now() - dbStart).toFixed(2)}ms`);
        console.log(`✅ Tempo total da operação: ${(perf_hooks_1.performance.now() - startTotal).toFixed(2)}ms`);
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
    if (!giftList) {
        throw new Error('Lista de presentes não encontrada.');
    }
    console.log('lista achada para deletar', giftList);
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
    // getGiftListByIdService,
    getAllGiftListsByUserIdService,
    getGiftListBySlugService,
    updateGiftListService,
    checkUserHasActiveGiftLists,
    deleteGiftList
};
