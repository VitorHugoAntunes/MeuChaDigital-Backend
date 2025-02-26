import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const processBanner = async (bannerUrl: string | undefined, giftListId: string) => {
  if (!bannerUrl) return undefined;

  const createdBanner = await prisma.image.create({
    data: {
      url: bannerUrl,
      type: 'BANNER',
      bannerForGiftListId: giftListId,
    },
  });

  return createdBanner.id;
};

const processMomentsImages = async (momentsImagesUrls: string[], giftListId: string) => {
  if (momentsImagesUrls.length === 0) return undefined;

  const createdImages = await Promise.all(
    momentsImagesUrls.map(async (url) => {
      return prisma.image.create({
        data: {
          url,
          type: 'MOMENT',
          momentsForGiftListId: giftListId,
        },
      });
    })
  );

  return {
    connect: createdImages.map((img) => ({ id: img.id })),
  };
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

export { processBanner, processMomentsImages, deleteImagesFromGiftList, deleteImageFromGift };