"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const giftListRepository_1 = require("../repositories/giftListRepository");
const userRepository_1 = require("../repositories/userRepository");
const createUserService = async (data) => {
    const existingUser = await (0, userRepository_1.findUserByEmail)(data.email);
    if (existingUser) {
        return existingUser;
    }
    const user = await (0, userRepository_1.createUserInDatabase)(data);
    if (data.photo) {
        const photo = await (0, userRepository_1.createUserPhotoInDatabase)(data.photo, user.id);
        await (0, userRepository_1.updateUserPhotoInDatabase)(user.id, photo.id);
    }
    return user;
};
const createGuestUserService = async (data) => {
    return (0, userRepository_1.createGuestUserInDatabase)(data);
};
const getAllUsersService = async () => {
    return (0, userRepository_1.getAllUsersFromDatabase)();
};
const getUserByEmailService = async (email) => {
    return (0, userRepository_1.findUserByEmail)(email);
};
const getUserByIdService = async (id) => {
    return (0, userRepository_1.findUserById)(id);
};
const updateUserService = async (id, data) => {
    let photoId = undefined;
    if (data.photo) {
        const photo = await (0, userRepository_1.createUserPhotoInDatabase)(data.photo, id);
        photoId = photo.id;
    }
    return (0, userRepository_1.updateUserInDatabase)(id, data, photoId);
};
const deleteUserService = async (id) => {
    const hasActiveLists = await (0, giftListRepository_1.hasActiveGiftLists)(id);
    if (hasActiveLists) {
        throw new Error('Usuário possui lista(s) de presentes ativa(s). Não é possível deletar.');
    }
    return (0, userRepository_1.deleteUserFromDatabase)(id);
};
exports.default = {
    createUserService,
    createGuestUserService,
    getAllUsersService,
    getUserByEmailService,
    getUserByIdService,
    updateUserService,
    deleteUserService,
};
