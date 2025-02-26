import { getGiftListById } from "../repositories/giftListRepository";
import { deleteS3Files } from "../services/imageUploadService";

const validateGiftListExists = async (id: string) => {
  const existingGiftList = await getGiftListById(id);
  if (!existingGiftList) {
    throw new Error("Lista de presentes não encontrada.");
  }
  return existingGiftList;
};

const deleteOldImagesFromS3 = async (userId: string, giftListId: string, hasNewImages: boolean) => {
  if (hasNewImages) {
    await deleteS3Files(userId, giftListId, false);
  }
};

export { validateGiftListExists, deleteOldImagesFromS3 };