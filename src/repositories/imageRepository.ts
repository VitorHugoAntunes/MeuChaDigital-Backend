import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const processBanner = async (bannerUrl: string | undefined, giftListId: string) => {
  if (!bannerUrl) return undefined;

  const existingBanner = await prisma.image.findFirst({
    where: {
      bannerForGiftListId: giftListId,
    },
  });

  if (existingBanner) {
    await prisma.image.delete({
      where: {
        id: existingBanner.id,
      },
    });
  }

  const createdBanner = await prisma.image.create({
    data: {
      url: bannerUrl,
      type: 'BANNER',
      bannerForGiftListId: giftListId,
    },
  });

  return createdBanner.id;
};

const processMomentsImages = async (momentsUrls: string[], giftListId: string) => {
  return await prisma.$transaction(async (prisma) => {

    await prisma.image.deleteMany({
      where: { momentsForGiftListId: giftListId },
    });

    await prisma.image.createMany({
      data: momentsUrls.map((url) => ({
        url,
        type: 'MOMENT',
        momentsForGiftListId: giftListId,
      })),
    });

    const momentsImages = await prisma.image.findMany({
      where: { momentsForGiftListId: giftListId },
    });

    return momentsImages;
  });
};


export const processGiftImage = async (url: string, giftId: string) => {
  const createdImage = await prisma.image.create({
    data: { url, type: 'GIFT', giftId },
  });

  return createdImage.id;
};

const deleteImagesFromGiftList = async (imageIds: string[]) => {
  return await prisma.image.deleteMany({
    where: {
      id: {
        in: imageIds,
      },
    },
  });
};

const deleteImageFromGift = async (imageId: string) => {
  return await prisma.image.delete({
    where: {
      id: imageId,
    },
  });
};

const deleteBannerFromGiftList = async (giftListId: string) => {
  return await prisma.image.deleteMany({
    where: {
      bannerForGiftListId: giftListId,
    },
  });
};

export { processBanner, processMomentsImages, deleteImagesFromGiftList, deleteImageFromGift, deleteBannerFromGiftList };