import { getGiftListBySlugInDatabase } from '../repositories/giftListRepository';
import { getAllGiftsByGiftListSlugFromDatabase, getGiftByGiftListSlugFromDatabase } from '../repositories/giftRepository';

export const getGiftListBySubdomain = async (subdomain: string) => {
  return await getGiftListBySlugInDatabase(subdomain);
};

export const getAllGiftsBySubdomain = async (subdomain: string) => {
  const gifts = await getAllGiftsByGiftListSlugFromDatabase(subdomain);

  return gifts;
};

export const getGiftByIdFromSubdomain = async (subdomain: string, giftId: string) => {
  const gift = await getGiftByGiftListSlugFromDatabase(subdomain, giftId);

  return gift;
};