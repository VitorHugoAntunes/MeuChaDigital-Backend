import { PrismaClient } from "@prisma/client";
import { GiftListCreate, GiftListUpdate } from "models/giftListModel";

const prisma = new PrismaClient();

const createGiftListInDatabase = async (data: GiftListCreate) => {
  return prisma.giftList.create({
    data: {
      name: data.name,
      slug: data.slug,
      type: data.type,
      eventDate: new Date(data.eventDate),
      description: data.description,
      shareableLink: data.shareableLink ?? '',
      userId: data.userId,
      status: data.status,
    },
    include: {
      gifts: true,
    },
  });
};

const updateGiftListWithImages = async (giftListId: string, bannerId: string | undefined, momentsImages: any) => {
  return prisma.giftList.update({
    where: { id: giftListId },
    data: {
      bannerId,
      momentsImages,
    },
    include: {
      banner: true,
      momentsImages: true,
      gifts: true,
    },
  });
};

const getAllGiftLists = async () => {
  return await prisma.giftList.findMany({
    include: { banner: true, momentsImages: true },
  });
};

const getGiftListById = async (id: string) => {
  return await prisma.giftList.findUnique({
    where: { id },
    include: { banner: true, momentsImages: true },
  });
};

const updateGiftListInDatabase = async (
  id: string,
  data: GiftListUpdate,
  bannerId?: string,
  momentsImages?: any
) => {
  return await prisma.giftList.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      type: data.type,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      description: data.description,
      shareableLink: data.shareableLink,
      status: data.status,
      bannerId,
      momentsImages,
    },
    include: {
      banner: true,
      momentsImages: true,
      gifts: true,
    },
  });
};

const deleteGiftListFromDatabase = async (id: string) => {
  return await prisma.giftList.delete({ where: { id } });
};

export { createGiftListInDatabase, updateGiftListWithImages, getAllGiftLists, getGiftListById, updateGiftListInDatabase, deleteGiftListFromDatabase };