import { GiftListCreate, GiftListUpdate } from '../models/giftListModel';
import { uploadLocalFilesToS3, deleteS3Files, uploadNewImages, deleteOldImagesFromS3, deleteSpecificMomentsImages } from './imageUploadService';
import { updateBanner, updateMomentsImages } from './imageService';
import { cleanUploadDirectory } from '../utils/cleanUploadDirectory';
import { validateGiftListExists } from '../utils/entityExistenceChecks';
import { createGiftListInDatabase, deleteGiftListFromDatabase, getAllGiftListByUserIdInDatabase, getAllGiftListsInDatabase, getGiftListByIdInDatabase, getGiftListBySlugInDatabase, updateGiftListInDatabase, updateGiftListWithImages } from '../repositories/giftListRepository';
import { deleteBannerFromGiftList, processBanner, processMomentsImages } from '../repositories/imageRepository';
import { hasActiveGiftLists } from '../repositories/giftListRepository';

import { performance } from "perf_hooks";

const createGiftListService = async (data: GiftListCreate, req: any, res: any) => {
  const startTime = performance.now();

  console.time("Criar lista no banco");
  const giftList = await createGiftListInDatabase(data);
  console.timeEnd("Criar lista no banco");

  console.time("Upload para S3");
  const [bannerUrls, momentsUrls] = await Promise.all([
    req.files['banner']
      ? uploadLocalFilesToS3(req.body.userId, giftList.id, 'banner')
      : Promise.resolve([]),
    req.files['moments_images']
      ? uploadLocalFilesToS3(req.body.userId, giftList.id, 'moments')
      : Promise.resolve([]),
  ]);
  console.timeEnd("Upload para S3");

  console.time("Processar Banner e Imagens");

  const bannerUrl = bannerUrls.length > 0 ? bannerUrls[0] : undefined;
  const bannerId = await processBanner(bannerUrl, giftList.id);

  const momentsImages = await processMomentsImages(momentsUrls, giftList.id);
  console.timeEnd("Processar Banner e Imagens");

  console.time("Limpar diretório de uploads");
  cleanUploadDirectory(req.body.userId);
  console.timeEnd("Limpar diretório de uploads");

  const endTime = performance.now();
  console.log(`createGiftListService demorou ${(endTime - startTime).toFixed(2)}ms`);

  return giftList;
};

const getAllGiftListsService = async () => {
  return await getAllGiftListsInDatabase();
};

// const getGiftListByIdService = async (id: string) => {
//   const giftlist = await getGiftListByIdInDatabase(id, "getGiftListByIdService");

//   if (!giftlist) {
//     throw new Error('Lista de presentes não encontrada.');
//   }

//   return giftlist;
// };

const getAllGiftListsByUserIdService = async (userId: string) => {
  return await getAllGiftListByUserIdInDatabase(userId);
}

const getGiftListBySlugService = async (slug: string) => {
  return await getGiftListBySlugInDatabase(slug);
};

const updateGiftListService = async (id: string, data: GiftListUpdate, req: any, res: any) => {
  try {
    const startTotal = performance.now();

    const existingGiftList = await validateGiftListExists(id);
    if (!existingGiftList) throw new Error("Lista de presentes não encontrada.");

    const { momentsImagesToDelete } = data;
    const hasNewBanner = !!req.files?.['banner'];
    const hasNewMomentsImages = !!req.files?.['moments_images'];

    let newBannerId: string | undefined = existingGiftList.bannerId || undefined;
    let newMomentsImages = existingGiftList.momentsImages || [];

    const asyncOperations: Promise<any>[] = [];

    if (hasNewBanner) {
      asyncOperations.push(
        (async () => {
          const start = performance.now();

          await Promise.all([
            deleteS3Files(existingGiftList.userId, existingGiftList.id, false, undefined, 'banner'),
            existingGiftList.bannerId ? deleteBannerFromGiftList(existingGiftList.id) : Promise.resolve()
          ]);

          console.log(`⏳ Tempo para deletar banner: ${(performance.now() - start).toFixed(2)}ms`);

          const uploadStart = performance.now();
          const [bannerUrl] = await uploadLocalFilesToS3(existingGiftList.userId, existingGiftList.id, 'banner');
          console.log(`⏳ Tempo para upload do banner: ${(performance.now() - uploadStart).toFixed(2)}ms`);

          if (bannerUrl) {
            const processStart = performance.now();
            newBannerId = await processBanner(bannerUrl, existingGiftList.id);
            console.log(`⏳ Tempo para processar banner: ${(performance.now() - processStart).toFixed(2)}ms`);
          }
        })()
      );
    }

    if (hasNewMomentsImages) {
      asyncOperations.push(
        (async () => {
          const start = performance.now();

          await deleteS3Files(existingGiftList.userId, existingGiftList.id, false, undefined, 'moments');
          console.log(`⏳ Tempo para deletar imagens de momentos: ${(performance.now() - start).toFixed(2)}ms`);

          const uploadStart = performance.now();
          const momentsUrls = await uploadLocalFilesToS3(existingGiftList.userId, existingGiftList.id, 'moments');
          console.log(`⏳ Tempo para upload das imagens de momentos: ${(performance.now() - uploadStart).toFixed(2)}ms`);

          if (momentsUrls.length > 0) {
            const processStart = performance.now();
            newMomentsImages = await processMomentsImages(momentsUrls, existingGiftList.id);
            console.log(`⏳ Tempo para processar imagens de momentos: ${(performance.now() - processStart).toFixed(2)}ms`);
          }
        })()
      );
    }

    if (momentsImagesToDelete?.length) {
      asyncOperations.push(
        (async () => {
          const start = performance.now();
          await deleteSpecificMomentsImages(existingGiftList.userId, existingGiftList.id, momentsImagesToDelete);
          newMomentsImages = newMomentsImages.filter((image) => !momentsImagesToDelete.includes(image.id));
          console.log(`⏳ Tempo para deletar imagens específicas: ${(performance.now() - start).toFixed(2)}ms`);
        })()
      );
    }

    await Promise.all(asyncOperations);

    const dbStart = performance.now();
    const updatedGiftList = await updateGiftListInDatabase(
      id,
      {
        name: data.name,
        slug: data.slug,
        type: data.type,
        eventDate: data.eventDate,
        description: data.description,
        shareableLink: data.shareableLink,
        status: data.status,
      },
      newBannerId,
      newMomentsImages
    );
    console.log(`⏳ Tempo para atualizar no banco de dados: ${(performance.now() - dbStart).toFixed(2)}ms`);

    console.log(`✅ Tempo total da operação: ${(performance.now() - startTotal).toFixed(2)}ms`);

    return updatedGiftList;
  } catch (error) {
    console.error("Erro ao atualizar a lista de presentes:", error);
    throw error;
  }
};

const checkUserHasActiveGiftLists = async (userId: string) => {
  return hasActiveGiftLists(userId);
};

const deleteGiftList = async (id: string) => {
  const giftList = await getGiftListByIdInDatabase(id);

  if (!giftList) {
    throw new Error('Lista de presentes não encontrada.');
  }

  console.log('lista achada para deletar', giftList);

  if (!giftList) return null;

  if (giftList.status === 'ACTIVE') {
    throw new Error('Não é possível deletar uma lista de presentes ativa.');
  }

  await deleteS3Files(giftList.userId, id, true);

  return await deleteGiftListFromDatabase(id);
};

export default {
  createGiftListService,
  getAllGiftListsService,
  // getGiftListByIdService,
  getAllGiftListsByUserIdService,
  getGiftListBySlugService,
  updateGiftListService,
  checkUserHasActiveGiftLists,
  deleteGiftList
};