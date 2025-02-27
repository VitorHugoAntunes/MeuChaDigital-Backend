import { hasActiveGiftLists } from '../repositories/giftListRepository';
import { UserCreate, GuestUserCreate } from '../models/userModel';
import {
  findUserByEmail,
  findUserById,
  createUserInDatabase,
  createGuestUserInDatabase,
  getAllUsersFromDatabase,
  updateUserInDatabase,
  deleteUserFromDatabase,
  createUserPhotoInDatabase,
  updateUserPhotoInDatabase,
} from '../repositories/userRepository';

const createUserService = async (data: UserCreate) => {
  const existingUser = await findUserByEmail(data.email);

  if (existingUser) {
    return existingUser;
  }

  const user = await createUserInDatabase(data);

  if (data.photo) {
    const photo = await createUserPhotoInDatabase(data.photo, user.id);
    await updateUserPhotoInDatabase(user.id, photo.id);
  }

  return user;
};

const createGuestUserService = async (data: GuestUserCreate) => {
  return createGuestUserInDatabase(data);
};

const getAllUsersService = async () => {
  return getAllUsersFromDatabase();
};

const getUserByEmailService = async (email: string) => {
  return findUserByEmail(email);
};

const getUserByIdService = async (id: string) => {
  return findUserById(id);
};

const updateUserService = async (id: string, data: UserCreate) => {
  let photoId = undefined;

  if (data.photo) {
    const photo = await createUserPhotoInDatabase(data.photo, id);
    photoId = photo.id;
  }

  return updateUserInDatabase(id, data, photoId);
};

const deleteUserService = async (id: string) => {
  const hasActiveLists = await hasActiveGiftLists(id);

  if (hasActiveLists) {
    throw new Error('Usuário possui lista(s) de presentes ativa(s). Não é possível deletar.');
  }

  return deleteUserFromDatabase(id);
};

export default {
  createUserService,
  createGuestUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
};