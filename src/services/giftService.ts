import { PrismaClient } from '@prisma/client';
import { GiftListCreate, GiftCreate } from '../models/giftModel';
import fs from 'fs';
import uploadLocalFilesToS3 from './imageUploadService';

const prisma = new PrismaClient();

const createGiftList = async (data: GiftListCreate, req: any, res: any) => {
  // Criar a lista no banco de dados
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
    },
    include: {
      gifts: true,
    },
  });

  const uploadedFilesUrls = await uploadLocalFilesToS3(req.body.userId, giftList.id, false);

  // Assumindo que o primeiro arquivo seja o banner e o restante sejam momentos
  const bannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
  const momentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];

  console.log('BANNER URL', bannerUrl);
  console.log('MOMENTS IMAGES URLS', momentsImagesUrls);

  let bannerId = undefined;
  if (bannerUrl) {
    const createdBanner = await prisma.image.create({
      data: {
        url: bannerUrl,
        type: 'BANNER',
        bannerForGiftListId: giftList.id,
      },
    });
    bannerId = createdBanner.id;
  }

  let momentsImages = undefined;
  if (momentsImagesUrls.length > 0) {
    const createdImages = await Promise.all(
      momentsImagesUrls.map(async (url) => {
        return prisma.image.create({
          data: {
            url,
            type: 'MOMENT',
            momentsForGiftListId: giftList.id,
          },
        });
      })
    );

    momentsImages = {
      connect: createdImages.map((img) => ({ id: img.id })),
    };
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

  if (fs.existsSync(`uploads/${req.body.userId}`)) {
    fs.rmdirSync(`uploads/${req.body.userId}`, { recursive: true });
  }

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

const createGift = async (data: GiftCreate, req: any, res: any) => {
  // Criar o presente no banco de dados
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

  // Faz o upload do arquivo para o S3 e obtém a URL
  const uploadedFilesUrls = await uploadLocalFilesToS3(req.body.userId, data.giftListId, true);
  const giftPhotoUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;

  console.log('GIFT PHOTO URL', giftPhotoUrl);

  let photo = undefined;

  // Se houver uma foto, criar a entrada no banco e vincular ao presente
  if (giftPhotoUrl) {
    const createdPhoto = await prisma.image.create({
      data: { url: giftPhotoUrl, type: 'GIFT', giftId: gift.id },
    });
    photo = createdPhoto;
  }

  // Atualizar o presente com a foto vinculada
  if (photo) {
    await prisma.gift.update({
      where: { id: gift.id },
      data: { photoId: photo.id },
      include: { photo: true },
    });
  }

  if (fs.existsSync(`uploads/${req.body.userId}`)) {
    fs.rmdirSync(`uploads/${req.body.userId}`, { recursive: true });
  }

  return gift;
};

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
    const existingGiftList = await prisma.giftList.findUnique({
      where: { id },
      include: { banner: true },
    });

    if (existingGiftList?.banner) {
      await prisma.image.delete({
        where: { id: existingGiftList.banner.id },
      });
    }

    const createdBanner = await prisma.image.create({
      data: {
        url: data.banner,
        type: 'BANNER',
        bannerForGiftListId: id,
      },
    });
    bannerId = createdBanner.id;
  }

  const giftList = await prisma.giftList.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      bannerId, // Atualiza o bannerId, se um novo banner foi criado
      userId: data.userId,
      status: data.status,
    },
    include: {
      banner: true,
      momentsImages: true,
    },
  });

  return giftList;
};

const updateGift = async (id: string, data: GiftCreate) => {
  let photoId = undefined;

  if (data.photo) {
    const createdPhoto = await prisma.image.create({
      data: { url: data.photo, type: 'GIFT' },
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
