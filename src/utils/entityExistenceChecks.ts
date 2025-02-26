import { getGiftByIdFromDatabase } from "../repositories/giftRepository";
import { getGiftListByIdInDatabase } from "../repositories/giftListRepository";

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

export { validateGiftListExists, validateGiftExists };