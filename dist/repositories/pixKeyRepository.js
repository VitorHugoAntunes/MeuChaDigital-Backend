"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePixKeyInDatabase = exports.updatePixKeyInDatabase = exports.getAllPixKeysByUserFromDatabase = exports.createPixKeyInDatabase = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPixKeyInDatabase = async (data) => {
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
exports.createPixKeyInDatabase = createPixKeyInDatabase;
const getAllPixKeysByUserFromDatabase = async (userId) => {
    return prisma.pixKey.findMany({
        where: {
            userId,
        },
    });
};
exports.getAllPixKeysByUserFromDatabase = getAllPixKeysByUserFromDatabase;
const updatePixKeyInDatabase = async (id, data) => {
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
exports.updatePixKeyInDatabase = updatePixKeyInDatabase;
const deletePixKeyInDatabase = async (id) => {
    return prisma.pixKey.delete({
        where: {
            id,
        },
    });
};
exports.deletePixKeyInDatabase = deletePixKeyInDatabase;
