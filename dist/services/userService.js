"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = async (data) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        return existingUser;
    }
    let photoId = undefined;
    if (data.photo) {
        const createdPhoto = await prisma.image.create({
            data: { url: data.photo },
        });
        photoId = createdPhoto.id;
    }
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            googleId: data.googleId,
            photoId,
        },
        include: {
            photo: true,
        },
    });
    return user;
};
const createGuestUser = async (data) => {
    const user = await prisma.user.create({
        data: {
            isGuest: true,
        },
    });
    return user;
};
const getAllUsers = async () => {
    const users = await prisma.user.findMany();
    return users;
};
const getUserByEmail = async (email) => {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
};
const getUserById = async (id) => {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
};
const updateUser = async (id, data) => {
    let photoId = undefined;
    if (data.photo) {
        const existingPhoto = await prisma.image.findFirst({
            where: { url: data.photo },
        });
        if (existingPhoto) {
            photoId = existingPhoto.id;
        }
        else {
            const createdPhoto = await prisma.image.create({
                data: { url: data.photo },
            });
            photoId = createdPhoto.id;
        }
    }
    const user = await prisma.user.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            googleId: data.googleId,
            photoId,
        },
        include: {
            photo: true,
        },
    });
    return user;
};
const deleteUser = async (id) => {
    const giftLists = await prisma.giftList.findMany({ where: { userId: id } });
    const activeGiftList = giftLists.find(giftList => giftList.status === 'ACTIVE');
    if (activeGiftList) {
        throw new Error('Usuário possui lista(s) de presentes ativa(s). Não é possível deletar.');
    }
    const user = await prisma.user.delete({ where: { id } });
    return user;
};
exports.default = { createUser, createGuestUser, getAllUsers, getUserByEmail, getUserById, updateUser, deleteUser };
