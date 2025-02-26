import { GiftListCreate, GiftListUpdate } from '../models/giftListModel';
import { uploadLocalFilesToS3, deleteS3Files, uploadNewImages } from './imageUploadService';
import { updateBanner, updateMomentsImages } from './imageService';
import { cleanUploadDirectory } from '../utils/cleanUploadDirectory';
import { deleteOldImagesFromS3, validateGiftListExists } from '../utils/giftListValidation';
import { createGiftListInDatabase, deleteGiftListFromDatabase, getAllGiftLists, getGiftListById, updateGiftListInDatabase, updateGiftListWithImages } from '../repositories/giftListRepository';
import { processBanner, processMomentsImages } from '../repositories/imageRepository';

const createGiftListService = async (data: GiftListCreate, req: any, res: any) => {
  const giftList = await createGiftListInDatabase(data);

  const uploadedFilesUrls = await uploadLocalFilesToS3(req.body.userId, giftList.id, false);

  const bannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
  const momentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];

  const bannerId = await processBanner(bannerUrl, giftList.id);

  const momentsImages = await processMomentsImages(momentsImagesUrls, giftList.id);

  const updatedGiftList = await updateGiftListWithImages(giftList.id, bannerId, momentsImages);

  cleanUploadDirectory(req.body.userId);

  return updatedGiftList;
};

const getAllGiftListsService = async () => {
  return await getAllGiftLists();
};

const getGiftListByIdService = async (id: string) => {
  return await getGiftListById(id);
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

const deleteGiftList = async (id: string) => {
  const giftList = await getGiftListById(id);

  if (!giftList) return null;

  if (giftList.status === 'ACTIVE') {
    throw new Error('Não é possível deletar uma lista de presentes ativa.');
  }

  await deleteS3Files(giftList.userId, id, false, true);

  return await deleteGiftListFromDatabase(id);
};

export default { createGiftListService, getAllGiftListsService, getGiftListByIdService, updateGiftListService, deleteGiftList };