import { PixKeyInsertData, PixKeyUpdate } from '../models/pixKeyModel';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createPixKeyInDatabase = async (data: PixKeyInsertData) => {
  return prisma.pixKey.create({
    data: {
      key: data.key,
      type: data.type,
      iv: data.iv,
      user: {
        connect: {
          id: data.userId,
        },
      },
    },
  });
};

const getAllPixKeysByUserFromDatabase = async (userId: string) => {
  return prisma.pixKey.findMany({
    where: {
      userId,
    },
  });
};

const updatePixKeyInDatabase = async (id: string, data: PixKeyUpdate) => {
  return prisma.pixKey.update({
    where: {
      id,
    },
    data: {
      key: data.key,
      type: data.type,
    },
  });
};

const deletePixKeyInDatabase = async (id: string) => {
  return prisma.pixKey.delete({
    where: {
      id,
    },
  });
};

export {
  createPixKeyInDatabase,
  getAllPixKeysByUserFromDatabase,
  updatePixKeyInDatabase,
  deletePixKeyInDatabase,
};