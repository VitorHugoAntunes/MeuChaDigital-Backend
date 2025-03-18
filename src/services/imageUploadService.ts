import fs from 'fs';
import path from 'path';
import s3 from '../config/aws';
import { PutObjectCommand, ListObjectsCommand, DeleteObjectsCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

const uploadLocalFilesToS3 = async (
  userId: string,
  giftListId: string,
  imageType: 'banner' | 'moments' | 'giftPhoto',
  giftId?: string
) => {

  const subfolder = imageType === 'banner' ? 'banner' : imageType === 'moments' ? 'moments_images' : 'giftPhoto';
  const uploadsDir = path.join(__dirname, "..", "..", "uploads", userId, subfolder);

  if (!fs.existsSync(uploadsDir)) {
    console.log(`A pasta de uploads para o usuário ${userId} e tipo ${imageType} não existe.`);
    return [];
  }

  const files = fs.readdirSync(uploadsDir);
  if (files.length === 0) {
    console.log(`Nenhum arquivo encontrado na pasta de uploads para o usuário ${userId} e tipo ${imageType}.`);
    return [];
  }

  const uploadPromises = files.map(async (file) => {
    const filePath = path.join(uploadsDir, file);
    const fileExtension = path.extname(file).toLowerCase();
    const baseName = path.basename(file, fileExtension);

    const finalFileName =
      fileExtension === ".jpeg" || fileExtension === ".jpg" ? file : `${baseName}.jpeg`;

    const s3Subfolder = imageType === 'banner' ? 'banner' : imageType === 'moments' ? 'momentsImages' : 'giftsImages';

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: giftId
        ? `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/${finalFileName}`
        : `uploads/${userId}/giftLists/${giftListId}/listsImages/${s3Subfolder}/${finalFileName}`,
      Body: fs.createReadStream(filePath),
      ContentType: "image/jpeg",
    };

    try {
      await s3.send(new PutObjectCommand(uploadParams));
      const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
      console.log(`✅ Upload concluído: ${fileUrl}`);

      fs.unlinkSync(filePath); // Isso remove o arquivo local após o upload
      return fileUrl;
    } catch (error) {
      console.error(`Erro ao fazer upload de ${file}:`, error);
      return null;
    }
  });

  const uploadedFilesUrls = (await Promise.all(uploadPromises)).filter((url) => url !== null);

  return uploadedFilesUrls;
};

const deleteS3Files = async (
  userId: string,
  giftListId: string,
  deleteAll?: boolean,
  giftId?: string,
  imageType?: 'banner' | 'moments' | 'giftPhoto'
) => {
  let prefix;

  if (deleteAll) {
    prefix = giftId
      ? `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/`
      : `uploads/${userId}/giftLists/${giftListId}`;
  } else if (giftId) {
    prefix = `uploads/${userId}/giftLists/${giftListId}/giftsImages/${giftId}/`;
  } else {
    const subfolder = imageType === 'banner' ? 'banner' : imageType === 'moments' ? 'momentsImages' : 'giftsImages';
    prefix = `uploads/${userId}/giftLists/${giftListId}/listsImages/${subfolder}/`;
  }

  const listParams = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Prefix: prefix,
  };

  try {
    const data = await s3.send(new ListObjectsCommand(listParams));
    console.log('Arquivos encontrados para deletar:', data.Contents?.length);

    if (data.Contents && data.Contents.length > 0) {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME!,
        Delete: {
          Objects: data.Contents.map((content) => ({ Key: content.Key! })),
          Quiet: false,
        },
      };

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
  let newBannerUrl = undefined;
  let newMomentsImagesUrls: string[] = [];
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


const deleteOldImagesFromS3 = async (
  userId: string,
  giftListId: string,
  hasNewImages: boolean,
  req: any,
  giftId?: string
) => {
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

const deleteSpecificMomentsImages = async (userId: string, giftListId: string, momentsImagesToDelete: string[]) => {
  try {
    const deletePromises = momentsImagesToDelete.map(async (url) => {
      const key = url.split(`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/`)[1];
      if (key) {
        const deleteParams = {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: key,
        };
        await s3.send(new DeleteObjectCommand(deleteParams));
        console.log(`✅ Imagem deletada: ${key}`);
      }
    });

    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Erro ao deletar imagens específicas de momentos:", error);
    throw error;
  }
};

export { uploadLocalFilesToS3, uploadNewImages, deleteS3Files, deleteOldImagesFromS3, deleteSpecificMomentsImages };