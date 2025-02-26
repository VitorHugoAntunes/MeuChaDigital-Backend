"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOldImagesFromS3 = exports.deleteS3Files = exports.uploadNewImages = exports.uploadLocalFilesToS3 = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const aws_1 = __importDefault(require("../config/aws"));
const client_s3_1 = require("@aws-sdk/client-s3");
const uploadLocalFilesToS3 = async (userId, giftListId, giftId) => {
    const uploadsDir = path_1.default.join(__dirname, '..', '..', 'uploads', userId);
    if (!fs_1.default.existsSync(uploadsDir)) {
        console.log(`A pasta de uploads para o usuário ${userId} não existe.`);
        return [];
    }
    const files = fs_1.default.readdirSync(uploadsDir);
    const uploadedFilesUrls = [];
    for (const file of files) {
        const filePath = path_1.default.join(uploadsDir, file);
        const fileStream = fs_1.default.createReadStream(filePath);
        const fileExtension = path_1.default.extname(file).toLowerCase();
        const baseName = path_1.default.basename(file, fileExtension);
        const finalFileName = fileExtension === '.jpeg' || fileExtension === '.jpg'
            ? file
            : `${baseName}.jpeg`;
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: giftId ? `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/${finalFileName}` : `uploads/${userId}/giftLists/${giftListId}/listsImages/${finalFileName}`, // path e nome do arquivo no S3
            Body: fileStream,
            ContentType: 'image/jpeg',
        };
        try {
            await aws_1.default.send(new client_s3_1.PutObjectCommand(uploadParams));
            const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
            uploadedFilesUrls.push(fileUrl);
            console.log(`Upload concluído: ${fileUrl}`);
        }
        catch (error) {
            console.error(`Erro ao fazer upload de ${file}:`, error);
        }
        finally {
            fs_1.default.unlinkSync(filePath);
        }
    }
    return uploadedFilesUrls;
};
exports.uploadLocalFilesToS3 = uploadLocalFilesToS3;
const deleteS3Files = async (userId, giftListId, deleteAll, giftId) => {
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
        prefix = `uploads/${userId}/giftLists/${giftListId}/listsImages/`;
    }
    const listParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Prefix: prefix,
    };
    try {
        // Lista todos os objetos no prefixo especificado
        const data = await aws_1.default.send(new client_s3_1.ListObjectsCommand(listParams));
        console.log('Arquivos encontrados para deletar:', data.Contents?.length);
        if (data.Contents && data.Contents.length > 0) {
            const deleteParams = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Delete: {
                    Objects: data.Contents.map((content) => ({ Key: content.Key })),
                    Quiet: false, // Define como `true` para suprimir erros de deleção
                },
            };
            // Deleta os objetos
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
    if (files['banner'] || files['moments_images'] || files['giftPhoto']) {
        const uploadedFilesUrls = await uploadLocalFilesToS3(userId, giftListId, giftId);
        const newBannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
        const newMomentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];
        const newGiftPhotoUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
        return { newBannerUrl, newMomentsImagesUrls, newGiftPhotoUrl };
    }
    return { newBannerUrl: undefined, newMomentsImagesUrls: [] };
};
exports.uploadNewImages = uploadNewImages;
const deleteOldImagesFromS3 = async (userId, giftListId, hasNewImages, giftId) => {
    if (hasNewImages) {
        await deleteS3Files(userId, giftListId, true, giftId);
    }
};
exports.deleteOldImagesFromS3 = deleteOldImagesFromS3;
