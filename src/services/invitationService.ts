import { getGiftListBySlugInDatabase } from '../repositories/giftListRepository';
import { getAllGiftsBySlugFromDatabase, getGiftBySlugFromDatabase } from '../repositories/giftRepository';

export const getGiftListBySubdomain = async (subdomain: string) => {
  return await getGiftListBySlugInDatabase(subdomain);
};

export const getAllGiftsBySubdomain = async (subdomain: string) => {
  const gifts = await getAllGiftsBySlugFromDatabase(subdomain);

  return gifts;
};

export const getGiftByIdFromSubdomain = async (subdomain: string, giftId: string) => {
  const gift = await getGiftBySlugFromDatabase(subdomain, giftId);

  return gift;
};