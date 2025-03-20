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
  const giftList = await prisma.giftList.findUnique({
    where: { id },
    include: { banner: true, momentsImages: true },
  });

  if (!giftList) {
    throw new Error('Lista de presentes não encontrada.');
  }

  return giftList;
};

const getAllGiftListByUserIdInDatabase = async (userId: string) => {
  const giftLists = await prisma.giftList.findMany({
    where: { userId },
    include: {
      banner: true,
      _count: {
        select: { gifts: true },
      },
    },
  });

  return giftLists;
};

const getGiftListBySlugWithoutImagesInDatabase = async (slug: string) => {
  return await prisma.giftList.findUnique({
    where: { slug },
  });
}

const updateGiftListInDatabase = async (
  id: string,
  data: GiftListUpdate,
  bannerId?: string,
  momentsImages?: any
) => {
  const existingGiftList = await prisma.giftList.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!existingGiftList) throw new Error("Lista não encontrada");

  // Isso filtra apenas os campos que realmente serão atualizados
  const updateData: any = {
    ...(data.name && { name: data.name }),
    ...(data.slug && { slug: formatSlug(data.slug) }),
    ...(data.type && { type: data.type }),
    ...(data.eventDate && { eventDate: new Date(data.eventDate) }),
    ...(data.description && { description: data.description }),
    ...(data.shareableLink && { shareableLink: data.shareableLink }),
    ...(data.status && { status: data.status }),
    ...(bannerId && { bannerId }),
  };

  if (momentsImages) {
    updateData.momentsImages = {
      connect: momentsImages.map((image: any) => ({ id: image.id })),
    };
  }

  if (data.slug && formatSlug(data.slug) !== existingGiftList.slug) {
    await updateGiftListSlug(id, formatSlug(data.slug));
  }

  return await prisma.giftList.update({
    where: { id },
    data: updateData,
  });
};

async function getGiftListBySlugInDatabase(slug: string) {
  // Tenta encontrar a lista pelo slug atual
  let giftList = await prisma.giftList.findUnique({
    where: { slug },
    include: { banner: true, momentsImages: true },
  });

  // Se não encontrar, verifica se o slug está no histórico
  if (!giftList) {
    const oldSlugEntry = await prisma.giftListSlugHistory.findUnique({
      where: { oldSlug: slug },
      select: { giftListId: true },
    });

    if (oldSlugEntry) {
      // Busca a lista pelo ID e retorna todos os campos esperados
      giftList = await prisma.giftList.findUnique({
        where: { id: oldSlugEntry.giftListId },
        include: { banner: true, momentsImages: true },
      });

      if (giftList) {
        return { redirect: `${giftList.slug}`, data: giftList };
      }
    }
  }

  return giftList ? { data: giftList } : { error: "Lista não encontrada" };
}

async function updateGiftListSlug(listId: string, newSlug: string) {
  // Busca a lista pelo ID
  const giftList = await prisma.giftList.findUnique({
    where: { id: listId },
    select: { slug: true },
  });

  if (!giftList) throw new Error("Lista não encontrada");

  // Armazena o slug antigo antes de atualizar
  await prisma.giftListSlugHistory.create({
    data: {
      oldSlug: giftList.slug,
      giftListId: listId,
    },
  });

  // Atualiza o slug na tabela principal
  await prisma.giftList.update({
    where: { id: listId },
    data: { slug: newSlug },
  });

  console.log(`Slug atualizado para: ${newSlug}`);
}

const hasActiveGiftLists = async (userId: string) => {
  return await prisma.giftList.findFirst({
    where: { userId, status: 'ACTIVE' },
  });
};

const deleteGiftListFromDatabase = async (id: string) => {
  console.log('id da lista para que vai ser deletada', id);
  return await prisma.giftList.delete({ where: { id } });
};

export {
  createGiftListInDatabase,
  updateGiftListWithImages,
  getAllGiftListsInDatabase,
  getGiftListByIdInDatabase,
  getAllGiftListByUserIdInDatabase,
  updateGiftListInDatabase,
  getGiftListBySlugInDatabase,
  getGiftListBySlugWithoutImagesInDatabase,
  hasActiveGiftLists,
  deleteGiftListFromDatabase
};