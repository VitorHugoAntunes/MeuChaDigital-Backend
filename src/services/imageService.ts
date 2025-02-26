import { deleteImagesFromGiftList, processBanner, processMomentsImages } from "../repositories/imageRepository";

const updateBanner = async (giftListId: string, newBannerUrl: string | undefined, existingBannerId?: string) => {
  if (newBannerUrl) {
    if (existingBannerId) {
      await deleteImagesFromGiftList([existingBannerId]);
    }
    const createdBanner = await processBanner(newBannerUrl, giftListId);
    return createdBanner;
  }
  return existingBannerId;
}

const updateMomentsImages = async (giftListId: string, newMomentsImagesUrls: string[], existingMomentsImages?: any) => {
  if (newMomentsImagesUrls.length > 0) {
    if (existingMomentsImages) {
      await deleteImagesFromGiftList(existingMomentsImages.map((img: any) => img.id));
    }
    const createdImages = await processMomentsImages(newMomentsImagesUrls, giftListId);

    if (!createdImages || !Array.isArray(createdImages)) {
      return undefined;
    }

    return {
      connect: createdImages.map((img: { id: string }) => ({ id: img.id })),
    };
  }
  return undefined;
}

export { updateBanner, updateMomentsImages };