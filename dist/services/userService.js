"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = async (data) => {
    const existingUser = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
        return existingUser;
    }
    const user = await prisma.user.create({
        data: {
            name: data.name,
            email: data.email,
            googleId: data.googleId,
            photo: data.photo,
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
    const user = await prisma.user.update({
        where: { id },
        data: {
            name: data.name,
            email: data.email,
            googleId: data.googleId,
            photo: data.photo,
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
exports.default = { createUser, getAllUsers, getUserByEmail, getUserById, updateUser, deleteUser };
