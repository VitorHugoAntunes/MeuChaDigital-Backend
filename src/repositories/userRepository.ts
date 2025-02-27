import { PrismaClient } from '@prisma/client';
import { UserCreate, GuestUserCreate } from '../models/userModel';

const prisma = new PrismaClient();

const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id } });
};

const createUserInDatabase = async (data: UserCreate) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      googleId: data.googleId,
    },
    include: { photo: true },
  });
};

const createGuestUserInDatabase = async (data: GuestUserCreate) => {
  return prisma.user.create({
    data: {
      isGuest: true,
    },
  });
};
const getAllUsersFromDatabase = async () => {
  return prisma.user.findMany();
};

const updateUserInDatabase = async (id: string, data: UserCreate, photoId?: string) => {
  return prisma.user.update({
    where: { id },
    data: {
      name: data.name,
      email: data.email,
      googleId: data.googleId,
      photoId,
    },
    include: { photo: true },
  });
};

const deleteUserFromDatabase = async (id: string) => {
  return prisma.user.delete({ where: { id } });
};

const createUserPhotoInDatabase = async (url: string, userId: string) => {
  return prisma.image.create({
    data: { url, type: 'AVATAR', userId },
  });
};

const updateUserPhotoInDatabase = async (userId: string, photoId: string) => {
  return prisma.user.update({
    where: { id: userId },
    data: { photoId },
  });
};

export {
  findUserByEmail,
  findUserById,
  createUserInDatabase,
  createGuestUserInDatabase,
  getAllUsersFromDatabase,
  updateUserInDatabase,
  deleteUserFromDatabase,
  createUserPhotoInDatabase,
  updateUserPhotoInDatabase,
};