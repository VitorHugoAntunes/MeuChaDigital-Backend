import { createPixKeyInDatabase, getAllPixKeysByUserFromDatabase, updatePixKeyInDatabase, deletePixKeyInDatabase } from '../repositories/pixKeyRepository';
import { PixKeyCreate, PixKeyUpdate } from '../models/pixKeyModel';
import { decryptPixKey, encryptPixKey } from '../utils/crypto';

const createPixKeyService = async (data: PixKeyCreate) => {
  const existingPixKeys = await getAllPixKeysByUserFromDatabase(data.userId);

  if (existingPixKeys.length >= 5) {
    throw new Error('Limite de 5 chaves Pix por usuário atingido.');
  }

  if (existingPixKeys.some((pixKey) => pixKey.type === 'CPF' && data.type === 'CPF')) {
    throw new Error('Já existe uma chave Pix do tipo CPF cadastrada para este usuário.');
  }

  for (const existingKey of existingPixKeys) {
    const decryptedKey = decryptPixKey(existingKey.key, existingKey.iv);

    if (decryptedKey === data.key) {
      throw new Error('Chave Pix já cadastrada para este usuário.');
    }
  }

  const encryptedKey = encryptPixKey(data.key);

  return createPixKeyInDatabase({
    ...data,
    key: encryptedKey.encryptedKey,
    iv: encryptedKey.iv,
  });
};

const getAllPixKeysByUserService = async (userId: string) => {
  const userPixKeys = await getAllPixKeysByUserFromDatabase(userId);

  const decryptedPixKeys = userPixKeys.map((pixKey) => {
    const decryptedKey = decryptPixKey(pixKey.key, pixKey.iv);
    return {
      ...pixKey,
      key: decryptedKey,
    };
  });

  return decryptedPixKeys;
};

const updatePixKeyService = async (id: string, data: PixKeyUpdate) => {
  return updatePixKeyInDatabase(id, data);
};

const deletePixKeyService = async (id: string) => {
  return deletePixKeyInDatabase(id);
};

export default {
  createPixKeyService,
  getAllPixKeysByUserService,
  updatePixKeyService,
  deletePixKeyService,
};