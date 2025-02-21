import { PrismaClient } from '@prisma/client';
import { GiftListCreate, GiftCreate } from '../models/giftModel';

const prisma = new PrismaClient();

const createGiftList = async (data: GiftListCreate) => {

  const giftList = await prisma.giftList.create({
    data: {
      name: data.name,
      slug: data.slug,
      type: data.type,
      eventDate: new Date(data.eventDate),
      description: data.description,
      shareableLink: data.shareableLink ?? '',
      userId: data.userId,
      status: data.status,
      gifts: {
        create: data.gifts,
      },
    },
    include: {
      gifts: true,
    },
  });

  let bannerId = undefined;

  if (data.banner) {
    const createdBanner = await prisma.image.create({
      data: {
        url: data.banner,
        giftListId: giftList.id,
      },
    });
    bannerId = createdBanner.id;
  }

  let momentsImages = undefined;

  if (data.moments_images && data.moments_images.length > 0) {
    const createdImages = await Promise.all(
      data.moments_images.map(async (url) => {
        return prisma.image.create({
          data: {
            url,
            giftListId: giftList.id,
          },
        });
      })
    );
    momentsImages = { connect: createdImages.map((img) => ({ id: img.id })) };
  }

  const updatedGiftList = await prisma.giftList.update({
    where: { id: giftList.id },
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

  return updatedGiftList;
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

const createGift = async (data: GiftCreate) => {
  let photo = null;

  const gift = await prisma.gift.create({
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

  if (data.photo) {
    photo = await prisma.image.create({
      data: { url: data.photo },
    });
  }

  if (photo) {
    await prisma.gift.update({
      where: { id: gift.id },
      data: {
        photoId: photo.id,
      },
    });

    await prisma.image.update({
      where: { id: photo.id },
      data: {
        giftId: gift.id,
      },
    });
  }

  return gift;
}

const getAllGifts = async () => {
  return await prisma.gift.findMany({ include: { photo: true } });
};

const getGiftById = async (id: string) => {
  return await prisma.gift.findUnique({
    where: { id },
    include: { photo: true },
  });
};

const updateGiftList = async (id: string, data: GiftListCreate) => {
  let bannerId = undefined;

  if (data.banner) {
    const createdBanner = await prisma.image.create({
      data: { url: data.banner },
    });
    bannerId = createdBanner.id;
  }

  const giftList = await prisma.giftList.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      bannerId,
      userId: data.userId,
      status: data.status,
    },
    include: { banner: true, momentsImages: true },
  });

  return giftList;
};

const updateGift = async (id: string, data: GiftCreate) => {
  let photoId = undefined;

  if (data.photo) {
    const createdPhoto = await prisma.image.create({
      data: { url: data.photo },
    });
    photoId = createdPhoto.id;
  }

  const gift = await prisma.gift.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      totalValue: data.totalValue,
      giftListId: data.giftListId,
      categoryId: data.categoryId,
      photoId,
    },
    include: { photo: true },
  });

  return gift;
};

const deleteGiftList = async (id: string) => {
  const giftList = await prisma.giftList.findUnique({ where: { id } });

  if (!giftList) return null;

  if (giftList.status === 'ACTIVE') {
    throw new Error('Não é possível deletar uma lista de presentes ativa.');
  }

  return await prisma.giftList.delete({ where: { id } });
};

const deleteGift = async (id: string) => {
  return await prisma.gift.delete({ where: { id } });
};

export default {
  createGiftList,
  getAllGiftLists,
  getGiftListById,
  createGift,
  getAllGifts,
  getGiftById,
  updateGiftList,
  updateGift,
  deleteGiftList,
  deleteGift,
};
