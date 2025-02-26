import { getGiftByIdFromDatabase } from "../repositories/giftRepository";
import { getGiftListByIdInDatabase } from "../repositories/giftListRepository";
import { deleteS3Files } from "../services/imageUploadService";

const validateGiftListExists = async (id: string) => {
  const existingGiftList = await getGiftListByIdInDatabase(id);
  if (!existingGiftList) {
    throw new Error("Lista de presentes não encontrada.");
  }
  return existingGiftList;
};

const validateGiftExists = async (id: string) => {
  const existingGift = await getGiftByIdFromDatabase(id);
  if (!existingGift) {
    throw new Error("Presente não encontrado.");
  }
  return existingGift;
}

const deleteOldImagesFromS3 = async (userId: string, giftListId: string, hasNewImages: boolean, giftId?: string,) => {
  if (hasNewImages) {
    await deleteS3Files(userId, giftListId, true, giftId);
  }
};

export { validateGiftListExists, validateGiftExists, deleteOldImagesFromS3 };