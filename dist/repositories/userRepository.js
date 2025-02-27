"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserPhotoInDatabase = exports.createUserPhotoInDatabase = exports.deleteUserFromDatabase = exports.updateUserInDatabase = exports.getAllUsersFromDatabase = exports.createGuestUserInDatabase = exports.createUserInDatabase = exports.findUserById = exports.findUserByEmail = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const findUserByEmail = async (email) => {
    return prisma.user.findUnique({ where: { email } });
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    return prisma.user.findUnique({ where: { id } });
};
exports.findUserById = findUserById;
const createUserInDatabase = async (data) => {
    return prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            googleId: data.googleId,
        },
        include: { photo: true },
    });
};
exports.createUserInDatabase = createUserInDatabase;
const createGuestUserInDatabase = async (data) => {
    return prisma.user.create({
        data: {
            isGuest: true,
        },
    });
};
exports.createGuestUserInDatabase = createGuestUserInDatabase;
const getAllUsersFromDatabase = async () => {
    return prisma.user.findMany();
};
exports.getAllUsersFromDatabase = getAllUsersFromDatabase;
const updateUserInDatabase = async (id, data, photoId) => {
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
exports.updateUserInDatabase = updateUserInDatabase;
const deleteUserFromDatabase = async (id) => {
    return prisma.user.delete({ where: { id } });
};
exports.deleteUserFromDatabase = deleteUserFromDatabase;
const createUserPhotoInDatabase = async (url, userId) => {
    return prisma.image.create({
        data: { url, type: 'AVATAR', userId },
    });
};
exports.createUserPhotoInDatabase = createUserPhotoInDatabase;
const updateUserPhotoInDatabase = async (userId, photoId) => {
    return prisma.user.update({
        where: { id: userId },
        data: { photoId },
    });
};
exports.updateUserPhotoInDatabase = updateUserPhotoInDatabase;
