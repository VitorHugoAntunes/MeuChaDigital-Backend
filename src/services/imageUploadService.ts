import fs from 'fs';
import path from 'path';
import s3 from '../config/aws';
import { PutObjectCommand, ListObjectsCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

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
      Key: gift ? `uploads/${userId}/giftLists/${giftListId}/giftsImages/${finalFileName}` : `uploads/${userId}/giftLists/${giftListId}/listsImages/${finalFileName}`, // path e nome do arquivo no S3
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

const deleteS3Files = async (userId: string, giftListId: string, gift?: boolean, deleteAll?: boolean) => {
  let prefix;

  if (deleteAll) {
    prefix = `uploads/${userId}/giftLists/${giftListId}`;
  } else {
    prefix = gift
      ? `uploads/${userId}/giftLists/${giftListId}/giftsPhotos/`
      : `uploads/${userId}/giftLists/${giftListId}/listsImages/`;
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

const uploadNewImages = async (userId: string, giftListId: string, files: any) => {
  if (files['banner'] || files['moments_images']) {
    const uploadedFilesUrls = await uploadLocalFilesToS3(userId, giftListId, false);
    const newBannerUrl = uploadedFilesUrls.length > 0 ? uploadedFilesUrls[0] : undefined;
    const newMomentsImagesUrls = uploadedFilesUrls.length > 1 ? uploadedFilesUrls.slice(1) : [];
    return { newBannerUrl, newMomentsImagesUrls };
  }
  return { newBannerUrl: undefined, newMomentsImagesUrls: [] };
};

export { uploadLocalFilesToS3, uploadNewImages, deleteS3Files };