"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const aws_1 = __importDefault(require("../config/aws"));
const client_s3_1 = require("@aws-sdk/client-s3");
const uploadLocalFilesToS3 = async (userId, giftListId, gift) => {
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
            Key: gift ? `uploads/${userId}/giftLists/${giftListId}/gifts/${finalFileName}` : `uploads/${userId}/giftLists/${giftListId}/${finalFileName}`, // path e nome do arquivo no S3
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
exports.default = uploadLocalFilesToS3;
