import { PrismaClient } from '@prisma/client';
import { GiftCreate } from '../models/giftModel';
import fs from 'fs';
import uploadLocalFilesToS3 from './imageUploadService';

const prisma = new PrismaClient();

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

const deleteGift = async (id: string) => {
  return await prisma.gift.delete({ where: { id } });
};

export default {
  createGift,
  getAllGifts,
  getGiftById,
  updateGift,
  deleteGift,
};
