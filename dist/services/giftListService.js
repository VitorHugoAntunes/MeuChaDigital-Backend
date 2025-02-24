"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs_1 = __importDefault(require("fs"));
const imageUploadService_1 = __importDefault(require("./imageUploadService"));
const prisma = new client_1.PrismaClient();
const createGiftList = async (data, req, res) => {
    // Criar a lista no banco de dados
    const giftList = await prisma.giftList.create({
        data: {
            name: data.name,
            slug: data.slug,
            type: data.type,
            eventDate: new Date(data.eventDate),
            description: data.description,
            shareableLink: data.shareableLink ?? '',
            userId: data.userId,
            status: data.status,
        },
        include: {
            gifts: true,
        },
    });
    const uploadedFilesUrls = await (0, imageUploadService_1.default)(req.body.userId, giftList.id, false);
    // Assumindo que o primeiro arquivo seja o banner e o restante sejam momentos
    const bannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
    const momentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];
    console.log('BANNER URL', bannerUrl);
    console.log('MOMENTS IMAGES URLS', momentsImagesUrls);
    let bannerId = undefined;
    if (bannerUrl) {
        const createdBanner = await prisma.image.create({
            data: {
                url: bannerUrl,
                type: 'BANNER',
                bannerForGiftListId: giftList.id,
            },
        });
        bannerId = createdBanner.id;
    }
    let momentsImages = undefined;
    if (momentsImagesUrls.length > 0) {
        const createdImages = await Promise.all(momentsImagesUrls.map(async (url) => {
            return prisma.image.create({
                data: {
                    url,
                    type: 'MOMENT',
                    momentsForGiftListId: giftList.id,
                },
            });
        }));
        momentsImages = {
            connect: createdImages.map((img) => ({ id: img.id })),
        };
    }
    const updatedGiftList = await prisma.giftList.update({
        where: { id: giftList.id },
        data: {
            bannerId,
            momentsImages,
        },
        include: {
            banner: true,
            momentsImages: true,
            gifts: true,
        },
    });
    if (fs_1.default.existsSync(`uploads/${req.body.userId}`)) {
        fs_1.default.rmdirSync(`uploads/${req.body.userId}`, { recursive: true });
    }
    return updatedGiftList;
};
const getAllGiftLists = async () => {
    return await prisma.giftList.findMany({
        include: { banner: true, momentsImages: true },
    });
};
const getGiftListById = async (id) => {
    return await prisma.giftList.findUnique({
        where: { id },
        include: { banner: true, momentsImages: true },
    });
};
const updateGiftList = async (id, data) => {
    let bannerId = undefined;
    if (data.banner) {
        const existingGiftList = await prisma.giftList.findUnique({
            where: { id },
            include: { banner: true },
        });
        if (existingGiftList?.banner) {
            await prisma.image.delete({
                where: { id: existingGiftList.banner.id },
            });
        }
        const createdBanner = await prisma.image.create({
            data: {
                url: data.banner,
                type: 'BANNER',
                bannerForGiftListId: id,
            },
        });
        bannerId = createdBanner.id;
    }
    const giftList = await prisma.giftList.update({
        where: { id },
        data: {
            name: data.name,
            description: data.description,
            bannerId, // Atualiza o bannerId, se um novo banner foi criado
            userId: data.userId,
            status: data.status,
        },
        include: {
            banner: true,
            momentsImages: true,
        },
    });
    return giftList;
};
const deleteGiftList = async (id) => {
    const giftList = await prisma.giftList.findUnique({ where: { id } });
    if (!giftList)
        return null;
    if (giftList.status === 'ACTIVE') {
        throw new Error('Não é possível deletar uma lista de presentes ativa.');
    }
    return await prisma.giftList.delete({ where: { id } });
};
exports.default = { createGiftList, getAllGiftLists, getGiftListById, updateGiftList, deleteGiftList };
