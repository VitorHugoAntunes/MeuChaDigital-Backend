import { PrismaClient } from '@prisma/client';
import { GiftListCreate, GiftCreate } from '../models/giftModel';

const prisma = new PrismaClient();

const createGiftList = async (data: GiftListCreate, req: any, res: any) => {

  let bannerUrl = undefined;
  let momentsImagesUrls = undefined;

  console.log('ARQUIVOS', req.files);
  console.log('BANNER', req.files[0]);

  if (req.files && req.files['banner']) {
    try {
      bannerUrl = req.files['banner'][0].location; // URL do banner
      console.log('BANNER URL', bannerUrl);
    } catch (error) {
      console.error('Erro ao acessar URL do banner:', error);
      throw new Error('Erro ao acessar URL do banner');
    }
  }

  if (req.files && req.files['moments_images']) {
    try {
      momentsImagesUrls = req.files['moments_images'].map((file: any) => file.location);
      console.log('MOMENTS IMAGES URLS', momentsImagesUrls);
    } catch (error) {
      console.error('Erro ao acessar URLs das imagens de momentos:', error);
      throw new Error('Erro ao acessar URLs das imagens de momentos');
    }
  }

  console.log('BANNER URL', bannerUrl);
  console.log('MOMENTS IMAGES URLS', momentsImagesUrls);

  // Criação da lista de presentes
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

  // Criação do banner no banco de dados
  if (bannerUrl) {
    const createdBanner = await prisma.image.create({
      data: {
        url: bannerUrl.toString(),
        type: 'BANNER',
        bannerForGiftListId: giftList.id,
      },
    });
    bannerId = createdBanner.id;
  }

  let momentsImages = undefined;

  // Criação das imagens de momentos no banco de dados
  if (momentsImagesUrls) {
    const createdImages = await Promise.all(
      momentsImagesUrls.map(async (url: string) => {
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

  // Atualização da lista de presentes com o banner e as imagens de momentos
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
      data: { url: data.photo, type: 'GIFT' },
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
