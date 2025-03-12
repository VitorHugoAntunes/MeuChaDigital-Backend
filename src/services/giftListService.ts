import { GiftListCreate, GiftListUpdate } from '../models/giftListModel';
import { uploadLocalFilesToS3, deleteS3Files, uploadNewImages, deleteOldImagesFromS3 } from './imageUploadService';
import { updateBanner, updateMomentsImages } from './imageService';
import { cleanUploadDirectory } from '../utils/cleanUploadDirectory';
import { validateGiftListExists } from '../utils/entityExistenceChecks';
import { createGiftListInDatabase, deleteGiftListFromDatabase, getAllGiftListByUserIdInDatabase, getAllGiftListsInDatabase, getGiftListByIdInDatabase, getGiftListBySlugInDatabase, updateGiftListInDatabase, updateGiftListWithImages } from '../repositories/giftListRepository';
import { processBanner, processMomentsImages } from '../repositories/imageRepository';
import { hasActiveGiftLists } from '../repositories/giftListRepository';

import { performance } from "perf_hooks";

const createGiftListService = async (data: GiftListCreate, req: any, res: any) => {
  const startTime = performance.now();

  console.time("Criar lista no banco");
  const giftList = await createGiftListInDatabase(data);
  console.timeEnd("Criar lista no banco");

  const uploadedFilesUrls = await uploadLocalFilesToS3(req.body.userId, giftList.id);

  console.time("Processar Banner e Imagens");
  const bannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
  const momentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];

  const [bannerId, momentsImages] = await Promise.all([
    processBanner(bannerUrl, giftList.id),
    processMomentsImages(momentsImagesUrls, giftList.id),
  ]);
  console.timeEnd("Upload para S3, Processar Banner e Imagens");

  console.time("Limpar diretório de uploads");
  cleanUploadDirectory(req.body.userId);
  console.timeEnd("Limpar diretório de uploads");

  const endTime = performance.now();
  console.log(`createGiftListService demorou ${(endTime - startTime).toFixed(2)}ms`);

  return giftList;
};

const getAllGiftListsService = async () => {
  return await getAllGiftListsInDatabase();
};

const getGiftListByIdService = async (id: string) => {
  return await getGiftListByIdInDatabase(id);
};

const getAllGiftListsByUserIdService = async (userId: string) => {
  return await getAllGiftListByUserIdInDatabase(userId);
}

const getGiftListBySlugService = async (slug: string) => {
  return await getGiftListBySlugInDatabase(slug);
};

const updateGiftListService = async (id: string, data: GiftListUpdate, req: any, res: any) => {
  try {
    const existingGiftList = await validateGiftListExists(id);

    const hasNewImages = req.files['banner'] || req.files['moments_images'];
    await deleteOldImagesFromS3(existingGiftList.userId, id, hasNewImages);

    const { newBannerUrl, newMomentsImagesUrls } = await uploadNewImages(existingGiftList.userId, id, req.files);

    const bannerId = await updateBanner(id, newBannerUrl, existingGiftList.banner?.id);

    const momentsImages = await updateMomentsImages(id, newMomentsImagesUrls, existingGiftList.momentsImages);

    const updatedGiftList = await updateGiftListInDatabase(id, data, bannerId, momentsImages);

    cleanUploadDirectory(existingGiftList.userId);

    return updatedGiftList;
  } catch (error) {
    console.error("Erro ao atualizar a lista de presentes:", error);
    throw error;
  }
};

const checkUserHasActiveGiftLists = async (userId: string) => {
  return hasActiveGiftLists(userId);
};

const deleteGiftList = async (id: string) => {
  const giftList = await getGiftListByIdInDatabase(id);

  if (!giftList) return null;

  if (giftList.status === 'ACTIVE') {
    throw new Error('Não é possível deletar uma lista de presentes ativa.');
  }

  await deleteS3Files(giftList.userId, id, true);

  return await deleteGiftListFromDatabase(id);
};

export default {
  createGiftListService,
  getAllGiftListsService,
  getGiftListByIdService,
  getAllGiftListsByUserIdService,
  getGiftListBySlugService,
  updateGiftListService,
  checkUserHasActiveGiftLists,
  deleteGiftList
};