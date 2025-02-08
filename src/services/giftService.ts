import { PrismaClient } from '@prisma/client';
import { GiftListCreate, GiftCreate } from '../models/giftModel';

const prisma = new PrismaClient();

const createGiftList = async (data: GiftListCreate) => {
  const giftList = await prisma.giftList.create({
    data: {
      name: data.name,
      description: data.description,
      banner: data.banner,
      userId: data.userId,
      status: data.status,
      gifts: {
        create: data.gifts,
      },
    },
  });

  return giftList;
};

const getAllGiftLists = async () => {
  const giftLists = await prisma.giftList.findMany();
  return giftLists;
};

const getGiftListById = async (id: string) => {
  const giftList = await prisma.giftList.findUnique({ where: { id } });
  return giftList;
};

const createGift = async (data: GiftCreate) => {
  const gift = await prisma.gift.create({
    data: {
      name: data.name,
      description: data.description,
      photo: data.photo,
      totalValue: data.totalValue,
      giftShares: data.giftShares,
      valuePerShare: data.valuePerShare,
      giftListId: data.giftListId,
      categoryId: data.categoryId,
    },
  });

  return gift;
};

const getAllGifts = async () => {
  const gifts = await prisma.gift.findMany();
  return gifts;
};

const getGiftById = async (id: string) => {
  const gift = await prisma.gift.findUnique({ where: { id } });
  return gift;
};

const updateGiftList = async (id: string, data: GiftListCreate) => {
  const giftList = await prisma.giftList.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      banner: data.banner,
      userId: data.userId,
      status: data.status,
    },
  });

  return giftList;
};

const updateGift = async (id: string, data: GiftCreate) => {
  const gift = await prisma.gift.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      photo: data.photo,
      totalValue: data.totalValue,
      giftShares: data.giftShares,
      valuePerShare: data.valuePerShare,
      giftListId: data.giftListId,
      categoryId: data.categoryId,
    },
  });

  return gift;
};

const deleteGiftList = async (id: string) => {

  const giftList = await prisma.giftList.findUnique({ where: { id } });

  if (!giftList) {
    return null;
  }

  if (giftList.status === 'ACTIVE') {
    throw new Error('Não é possível deletar uma lista de presentes ativa.');
  } else {
    const giftList = await prisma.giftList.delete({ where: { id } });
    return giftList;
  }
};

const deleteGift = async (id: string) => {
  const gift = await prisma.gift.delete({ where: { id } });
  return gift;
};

export default { createGiftList, getAllGiftLists, getGiftListById, createGift, getAllGifts, getGiftById, updateGiftList, updateGift, deleteGiftList, deleteGift };