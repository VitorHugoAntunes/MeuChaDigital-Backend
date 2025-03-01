import fs from 'fs';
import path from 'path';
import s3 from '../config/aws';
import { PutObjectCommand, ListObjectsCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const uploadLocalFilesToS3 = async (userId: string, giftListId: string, giftId?: string) => {
  const uploadsDir = path.join(__dirname, "..", "..", "uploads", userId);

  if (!fs.existsSync(uploadsDir)) {
    console.log(`A pasta de uploads para o usuário ${userId} não existe.`);
    return [];
  }

  const files = fs.readdirSync(uploadsDir);
  if (files.length === 0) {
    console.log(`Nenhum arquivo encontrado na pasta de uploads para o usuário ${userId}.`);
    return [];
  }

  const uploadPromises = files.map(async (file) => {
    const filePath = path.join(uploadsDir, file);
    const fileExtension = path.extname(file).toLowerCase();
    const baseName = path.basename(file, fileExtension);

    const finalFileName =
      fileExtension === ".jpeg" || fileExtension === ".jpg" ? file : `${baseName}.jpeg`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: giftId
        ? `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/${finalFileName}`
        : `uploads/${userId}/giftLists/${giftListId}/listsImages/${finalFileName}`,
      Body: fs.createReadStream(filePath),
      ContentType: "image/jpeg",
    };

    try {
      await s3.send(new PutObjectCommand(uploadParams));
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
      console.log(`✅ Upload concluído: ${fileUrl}`);

      fs.unlinkSync(filePath);
      return fileUrl;
    } catch (error) {
      console.error(`Erro ao fazer upload de ${file}:`, error);
      return null;
    }
  });

  const uploadedFilesUrls = (await Promise.all(uploadPromises)).filter((url) => url !== null);

  return uploadedFilesUrls;
};

const deleteS3Files = async (userId: string, giftListId: string, deleteAll?: boolean, giftId?: string,) => {
  let prefix;

  if (deleteAll) {
    prefix = giftId
      ? `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/`
      : `uploads/${userId}/giftLists/${giftListId}`;
  } else if (giftId) {
    prefix = `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/`;
  } else {
    prefix = `uploads/${userId}/giftLists/${giftListId}/listsImages/`;
  }

  const listParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Prefix: prefix,
  };

  try {
    // Lista todos os objetos no prefixo especificado
    const data = await s3.send(new ListObjectsCommand(listParams));
    console.log('Arquivos encontrados para deletar:', data.Contents?.length);

    if (data.Contents && data.Contents.length > 0) {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Delete: {
          Objects: data.Contents.map((content) => ({ Key: content.Key! })),
          Quiet: false, // Define como `true` para suprimir erros de deleção
        },
      };

      // Deleta os objetos
      const deleteResponse = await s3.send(new DeleteObjectsCommand(deleteParams));
      console.log('Arquivos deletados com sucesso:', deleteResponse.Deleted);
    } else {
      console.log('Nenhum arquivo encontrado para deletar.');
    }
  } catch (error) {
    console.error('Erro ao deletar arquivos do S3:', error);
    throw error;
  }
};

const uploadNewImages = async (userId: string, giftListId: string, files: any, giftId?: string) => {
  if (files['banner'] || files['moments_images'] || files['giftPhoto']) {
    const uploadedFilesUrls = await uploadLocalFilesToS3(userId, giftListId, giftId);
    const newBannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
    const newMomentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];
    const newGiftPhotoUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
    return { newBannerUrl, newMomentsImagesUrls, newGiftPhotoUrl };
  }
  return { newBannerUrl: undefined, newMomentsImagesUrls: [] };
};

const deleteOldImagesFromS3 = async (userId: string, giftListId: string, hasNewImages: boolean, giftId?: string,) => {
  if (hasNewImages) {
    await deleteS3Files(userId, giftListId, true, giftId);
  }
};

export { uploadLocalFilesToS3, uploadNewImages, deleteS3Files, deleteOldImagesFromS3 };