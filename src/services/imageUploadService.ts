import fs from 'fs';
import path from 'path';
import s3 from '../config/aws';
import { PutObjectCommand } from '@aws-sdk/client-s3';

const uploadLocalFilesToS3 = async (userId: string, giftListId: string, gift?: boolean) => {
  const uploadsDir = path.join(__dirname, '..', '..', 'uploads', userId);

  if (!fs.existsSync(uploadsDir)) {
    console.log(`A pasta de uploads para o usuário ${userId} não existe.`);
    return [];
  }

  const files = fs.readdirSync(uploadsDir);
  const uploadedFilesUrls: string[] = [];

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    const fileStream = fs.createReadStream(filePath);
    const fileExtension = path.extname(file).toLowerCase();
    const baseName = path.basename(file, fileExtension);

    const finalFileName = fileExtension === '.jpeg' || fileExtension === '.jpg'
      ? file
      : `${baseName}.jpeg`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: gift ? `uploads/${userId}/giftLists/${giftListId}/gifts/${finalFileName}` : `uploads/${userId}/giftLists/${giftListId}/${finalFileName}`, // path e nome do arquivo no S3
      Body: fileStream,
      ContentType: 'image/jpeg',
    };

    try {
      await s3.send(new PutObjectCommand(uploadParams));
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
      uploadedFilesUrls.push(fileUrl);
      console.log(`Upload concluído: ${fileUrl}`);
    } catch (error) {
      console.error(`Erro ao fazer upload de ${file}:`, error);
    } finally {
      fs.unlinkSync(filePath);
    }
  }

  return uploadedFilesUrls;
};

export default uploadLocalFilesToS3;