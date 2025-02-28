import { PrismaClient } from "@prisma/client";
import { GiftListCreate, GiftListUpdate } from "models/giftListModel";
import { formatSlug } from "../utils/formatSlug";

const prisma = new PrismaClient();

const createGiftListInDatabase = async (data: GiftListCreate) => {
  return prisma.giftList.create({
    data: {
      name: data.name,
      slug: formatSlug(data.slug),
      type: data.type,
      eventDate: new Date(data.eventDate),
      description: data.description,
      shareableLink: `https://${formatSlug(data.slug)}.meuchadigital.com/invitation`,
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

const getAllGiftListsInDatabase = async () => {
  return await prisma.giftList.findMany({
    include: { banner: true, momentsImages: true },
  });
};

const getGiftListByIdInDatabase = async (id: string) => {
  return await prisma.giftList.findUnique({
    where: { id },
    include: { banner: true, momentsImages: true },
  });
};

const getGiftListBySlugInDatabase = async (slug: string) => {
  return await prisma.giftList.findUnique({
    where: { slug },
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

const hasActiveGiftLists = async (userId: string) => {
  return await prisma.giftList.findFirst({
    where: { userId, status: 'ACTIVE' },
  });
};

const deleteGiftListFromDatabase = async (id: string) => {
  return await prisma.giftList.delete({ where: { id } });
};

export {
  createGiftListInDatabase,
  updateGiftListWithImages,
  getAllGiftListsInDatabase,
  getGiftListByIdInDatabase,
  updateGiftListInDatabase,
  getGiftListBySlugInDatabase,
  hasActiveGiftLists,
  deleteGiftListFromDatabase
};