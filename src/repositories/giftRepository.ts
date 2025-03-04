import { PrismaClient } from '@prisma/client';
import { GiftCreate, GiftUpdate } from '../models/giftModel';
import { getGiftListBySlugInDatabase, getGiftListBySlugWithoutImagesInDatabase } from './giftListRepository';

const prisma = new PrismaClient();

export const createGiftInDatabase = async (data: GiftCreate) => {
  return prisma.gift.create({
    data: {
      name: data.name,
      description: data.description,
      priority: data.priority,
      totalValue: data.totalValue,
      giftListId: data.giftListId,
      categoryId: data.categoryId,
    },
    include: { photo: true },
  });
};

export const getAllGiftsFromDatabase = async () => {
  return prisma.gift.findMany({ include: { photo: true } });
};

export const getGiftByIdFromDatabase = async (id: string) => {
  return prisma.gift.findUnique({
    where: { id },
    include: { photo: true },
  });
};

export const getAllGiftsByGiftListSlugFromDatabase = async (slug: string) => {
  const giftList = await getGiftListBySlugWithoutImagesInDatabase(slug);

  if (!giftList) {
    return null;
  }

  return {
    giftList,
    gifts: await prisma.gift.findMany({
      where: { giftListId: giftList.id },
      include: { photo: true, category: true },
    }),
  }
}

export const getGiftByGiftListSlugFromDatabase = async (slug: string, giftId: string) => {
  const giftList = await getGiftListBySlugInDatabase(slug);

  if (!giftList) {
    return null;
  }

  return prisma.gift.findUnique({
    where: { id: giftId },
    include: { photo: true, category: true, list: true },
  });
};

export const updateGiftInDatabase = async (id: string, data: GiftUpdate, photoId?: string) => {
  return prisma.gift.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      totalValue: data.totalValue,
      categoryId: data.categoryId,
      photoId,
    },
    include: { photo: true },
  });
};

export const deleteGiftFromDatabase = async (id: string) => {
  return prisma.gift.delete({ where: { id } });
};