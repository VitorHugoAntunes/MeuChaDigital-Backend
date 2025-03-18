"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpecificMomentsImages = exports.deleteOldImagesFromS3 = exports.deleteS3Files = exports.uploadNewImages = exports.uploadLocalFilesToS3 = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const aws_1 = __importDefault(require("../config/aws"));
const client_s3_1 = require("@aws-sdk/client-s3");
const uploadLocalFilesToS3 = async (userId, giftListId, imageType, giftId) => {
    const subfolder = imageType === 'banner' ? 'banner' : imageType === 'moments' ? 'moments_images' : 'giftPhoto';
    const uploadsDir = path_1.default.join(__dirname, "..", "..", "uploads", userId, subfolder);
    if (!fs_1.default.existsSync(uploadsDir)) {
        console.log(`A pasta de uploads para o usuário ${userId} e tipo ${imageType} não existe.`);
        return [];
    }
    const files = fs_1.default.readdirSync(uploadsDir);
    if (files.length === 0) {
        console.log(`Nenhum arquivo encontrado na pasta de uploads para o usuário ${userId} e tipo ${imageType}.`);
        return [];
    }
    const uploadPromises = files.map(async (file) => {
        const filePath = path_1.default.join(uploadsDir, file);
        const fileExtension = path_1.default.extname(file).toLowerCase();
        const baseName = path_1.default.basename(file, fileExtension);
        const finalFileName = fileExtension === ".jpeg" || fileExtension === ".jpg" ? file : `${baseName}.jpeg`;
        const s3Subfolder = imageType === 'banner' ? 'banner' : imageType === 'moments' ? 'momentsImages' : 'giftsImages';
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: giftId
                ? `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/${finalFileName}`
                : `uploads/${userId}/giftLists/${giftListId}/listsImages/${s3Subfolder}/${finalFileName}`,
            Body: fs_1.default.createReadStream(filePath),
            ContentType: "image/jpeg",
        };
        try {
            await aws_1.default.send(new client_s3_1.PutObjectCommand(uploadParams));
            const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
            console.log(`✅ Upload concluído: ${fileUrl}`);
            fs_1.default.unlinkSync(filePath); // Isso remove o arquivo local após o upload
            return fileUrl;
        }
        catch (error) {
            console.error(`Erro ao fazer upload de ${file}:`, error);
            return null;
        }
    });
    const uploadedFilesUrls = (await Promise.all(uploadPromises)).filter((url) => url !== null);
    return uploadedFilesUrls;
};
exports.uploadLocalFilesToS3 = uploadLocalFilesToS3;
const deleteS3Files = async (userId, giftListId, deleteAll, giftId, imageType) => {
    let prefix;
    if (deleteAll) {
        prefix = giftId
            ? `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/`
            : `uploads/${userId}/giftLists/${giftListId}`;
    }
    else if (giftId) {
        prefix = `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/`;
    }
    else {
        const subfolder = imageType === 'banner' ? 'banner' : imageType === 'moments' ? 'momentsImages' : 'giftsImages';
        prefix = `uploads/${userId}/giftLists/${giftListId}/listsImages/${subfolder}/`;
    }
    const listParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
    };
    try {
        const data = await aws_1.default.send(new client_s3_1.ListObjectsCommand(listParams));
        console.log('Arquivos encontrados para deletar:', data.Contents?.length);
        if (data.Contents && data.Contents.length > 0) {
            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: {
                    Objects: data.Contents.map((content) => ({ Key: content.Key })),
                    Quiet: false,
                },
            };
            const deleteResponse = await aws_1.default.send(new client_s3_1.DeleteObjectsCommand(deleteParams));
            console.log('Arquivos deletados com sucesso:', deleteResponse.Deleted);
        }
        else {
            console.log('Nenhum arquivo encontrado para deletar.');
        }
    }
    catch (error) {
        console.error('Erro ao deletar arquivos do S3:', error);
        throw error;
    }
};
exports.deleteS3Files = deleteS3Files;
const uploadNewImages = async (userId, giftListId, files, giftId) => {
    let newBannerUrl = undefined;
    let newMomentsImagesUrls = [];
    let newGiftPhotoUrl = undefined;
    if (files['banner']) {
        const bannerUrls = await uploadLocalFilesToS3(userId, giftListId, 'banner', giftId);
        newBannerUrl = bannerUrls.length > 0 ? bannerUrls[0] : undefined;
    }
    if (files['moments_images']) {
        const momentsUrls = await uploadLocalFilesToS3(userId, giftListId, 'moments', giftId);
        newMomentsImagesUrls = momentsUrls;
    }
    if (files['giftPhoto']) {
        const giftPhotoUrls = await uploadLocalFilesToS3(userId, giftListId, 'giftPhoto', giftId);
        newGiftPhotoUrl = giftPhotoUrls.length > 0 ? giftPhotoUrls[0] : undefined;
    }
    return { newBannerUrl, newMomentsImagesUrls, newGiftPhotoUrl };
};
exports.uploadNewImages = uploadNewImages;
const deleteOldImagesFromS3 = async (userId, giftListId, hasNewImages, req, giftId) => {
    if (hasNewImages && !giftId) {
        if (req.files['banner']) {
            console.log("Deletando imagens antigas de banner...");
            await deleteS3Files(userId, giftListId, false, giftId, 'banner');
        }
        if (req.files['moments_images']) {
            console.log("Deletando imagens antigas de momentos...");
            await deleteS3Files(userId, giftListId, false, giftId, 'moments');
        }
    }
    if (hasNewImages && giftId) {
        await deleteS3Files(userId, giftListId, false, giftId, 'giftPhoto');
    }
};
exports.deleteOldImagesFromS3 = deleteOldImagesFromS3;
const deleteSpecificMomentsImages = async (userId, giftListId, momentsImagesToDelete) => {
    try {
        const deletePromises = momentsImagesToDelete.map(async (url) => {
            const key = url.split(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`)[1];
            if (key) {
                const deleteParams = {
                    Bucket: process.env.AWS_BUCKET_NAME,
                    Key: key,
                };
                await aws_1.default.send(new client_s3_1.DeleteObjectCommand(deleteParams));
                console.log(`✅ Imagem deletada: ${key}`);
            }
        });
        await Promise.all(deletePromises);
    }
    catch (error) {
        console.error("Erro ao deletar imagens específicas de momentos:", error);
        throw error;
    }
};
exports.deleteSpecificMomentsImages = deleteSpecificMomentsImages;
