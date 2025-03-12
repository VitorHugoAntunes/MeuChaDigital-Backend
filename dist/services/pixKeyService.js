"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pixKeyRepository_1 = require("../repositories/pixKeyRepository");
const crypto_1 = require("../utils/crypto");
const createPixKeyService = async (data) => {
    const existingPixKeys = await (0, pixKeyRepository_1.getAllPixKeysByUserFromDatabase)(data.userId);
    if (existingPixKeys.length >= 5) {
        throw new Error('Limite de 5 chaves Pix por usuário atingido.');
    }
    if (existingPixKeys.some((pixKey) => pixKey.type === 'CPF' && data.type === 'CPF')) {
        throw new Error('Já existe uma chave Pix do tipo CPF cadastrada para este usuário.');
    }
    for (const existingKey of existingPixKeys) {
        const decryptedKey = (0, crypto_1.decryptPixKey)(existingKey.key, existingKey.iv);
        if (decryptedKey === data.key) {
            throw new Error('Chave Pix já cadastrada para este usuário.');
        }
    }
    const encryptedKey = (0, crypto_1.encryptPixKey)(data.key);
    return (0, pixKeyRepository_1.createPixKeyInDatabase)({
        ...data,
        key: encryptedKey.encryptedKey,
        iv: encryptedKey.iv,
    });
};
const getAllPixKeysByUserService = async (userId) => {
    const userPixKeys = await (0, pixKeyRepository_1.getAllPixKeysByUserFromDatabase)(userId);
    const decryptedPixKeys = userPixKeys.map((pixKey) => {
        const decryptedKey = (0, crypto_1.decryptPixKey)(pixKey.key, pixKey.iv);
        return {
            ...pixKey,
            key: decryptedKey,
        };
    });
    return decryptedPixKeys;
};
const updatePixKeyService = async (id, data) => {
    return (0, pixKeyRepository_1.updatePixKeyInDatabase)(id, data);
};
const deletePixKeyService = async (id) => {
    return (0, pixKeyRepository_1.deletePixKeyInDatabase)(id);
};
exports.default = {
    createPixKeyService,
    getAllPixKeysByUserService,
    updatePixKeyService,
    deletePixKeyService,
};
