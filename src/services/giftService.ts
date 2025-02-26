import { GiftCreate, GiftUpdate } from '../models/giftModel';
import { deleteOldImagesFromS3, deleteS3Files, uploadLocalFilesToS3, uploadNewImages } from './imageUploadService';
import { cleanUploadDirectory } from '../utils/cleanUploadDirectory';
import {
  createGiftInDatabase,
  getAllGiftsFromDatabase,
  getGiftByIdFromDatabase,
  updateGiftInDatabase,
  deleteGiftFromDatabase,
} from '../repositories/giftRepository';
import { processGiftImage } from '../repositories/imageRepository';
import { updateGiftImage } from './imageService';
import { getGiftListByIdInDatabase } from '../repositories/giftListRepository';

const createGiftService = async (data: GiftCreate, req: any, res: any) => {
  const gift = await createGiftInDatabase(data);

  const uploadedFilesUrls = await uploadLocalFilesToS3(req.body.userId, data.giftListId, gift.id);
  const giftPhotoUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;

  if (giftPhotoUrl) {
    const photoId = await processGiftImage(giftPhotoUrl, gift.id);
    await updateGiftInDatabase(gift.id, data, photoId);
  }

  cleanUploadDirectory(req.body.userId);

  return gift;
};

const getAllGiftsService = async () => {
  return await getAllGiftsFromDatabase();
};

const getGiftByIdService = async (id: string) => {
  return await getGiftByIdFromDatabase(id);
};

const updateGiftService = async (userId: string, giftListId: string, giftId: string, data: GiftUpdate, req: any) => {
  try {
    const existingGift = await getGiftByIdFromDatabase(giftId);

    const hasNewImage = req.files['giftPhoto'];
    await deleteOldImagesFromS3(userId, giftListId, hasNewImage, giftId);

    if (!existingGift) {
      throw new Error('Gift not found');
    }

    const { newGiftPhotoUrl } = await uploadNewImages(userId, giftListId, req.files, giftId);

    const photoId = await updateGiftImage(giftId, newGiftPhotoUrl, existingGift.photo?.id);

    cleanUploadDirectory(giftListId);

    console.log('giftId', giftId);
    return await updateGiftInDatabase(giftId, data, photoId);
  } catch (error) {
    console.error('Error updating gift:', error);
    throw error;
  }
};

const deleteGiftService = async (id: string) => {
  const gift = await getGiftByIdFromDatabase(id);

  if (!gift) {
    throw new Error('Gift not found');
  }

  const giftList = await getGiftListByIdInDatabase(gift.giftListId);

  const userId = giftList?.userId;

  if (!userId) {
    throw new Error('User not found');
  }

  await deleteS3Files(userId, gift.giftListId, true, id);

  return await deleteGiftFromDatabase(id);
};

export default {
  createGiftService,
  getAllGiftsService,
  getGiftByIdService,
  updateGiftService,
  deleteGiftService,
};