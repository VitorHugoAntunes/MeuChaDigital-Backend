import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request, Response, NextFunction } from 'express';

interface MulterRequest extends Request {
  files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);
    // Isso define a subpasta com base no campo (fieldname) do arquivo
    const subfolder = file.fieldname; // banner, moments_images ou giftPhoto
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', req.body.userId, subfolder);

    // Cria a pasta se não existir
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Define o destino do arquivo
    cb(null, uploadsDir);
  },
  filename: (req: MulterRequest, file, cb) => {
    // Define o nome do arquivo
    const fileName = `${file.fieldname}_${Date.now()}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });

export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log('req.files:', req.files);

  upload.fields([
    { name: 'banner', maxCount: 1 },
    { name: 'moments_images', maxCount: 10 },
    { name: 'giftPhoto', maxCount: 1 },
  ])(req, res, next);
};

export const validateUploadedFilesForGiftList = (req: MulterRequest, res: Response, next: NextFunction) => {
  const isPost = req.method === 'POST';
  const isPut = req.method === 'PUT';

  const hasBanner = !!(req.files as { [fieldname: string]: Express.Multer.File[] })['banner'];
  const hasMoments = !!(req.files as { [fieldname: string]: Express.Multer.File[] })['moments_images'];

  // Para POST: Ambos `banner` e `moments_images` são obrigatórios
  if (isPost && (!hasBanner || !hasMoments)) {
    return res.status(400).json({ error: 'Os campos "banner" e "moments_images" são obrigatórios no POST.' }) as any;
  }

  // Para PUT: Pode ter `banner`, `moments_images`, ambos ou nenhum
  if (isPut && !hasBanner && !hasMoments) {
    return next();
  }

  if (hasBanner) {
    const bannerFile = (req.files as { [fieldname: string]: Express.Multer.File[] })['banner'][0];
    if (bannerFile.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'O arquivo do banner excede o limite de 5MB.' }) as any;
    }
  }

  if (hasMoments) {
    const momentsImages = (req.files as { [fieldname: string]: Express.Multer.File[] })['moments_images'];
    for (const file of momentsImages) {
      if (file.size > 5 * 1024 * 1024) {
        return res.status(400).json({ error: 'Uma ou mais imagens de momentos excedem o limite de 5MB.' }) as any;
      }
    }
  }

  next();
};

export const validateUploadedFilesForGift = (req: MulterRequest, res: Response, next: NextFunction) => {
  const isPost = req.method === 'POST';
  const isPut = req.method === 'PUT';

  const hasGiftPhoto = !!(req.files as { [fieldname: string]: Express.Multer.File[] })['giftPhoto'];

  // Para POST: O campo `giftPhoto` é obrigatório
  if (isPost && !hasGiftPhoto) {
    return res.status(400).json({ error: 'O campo "giftPhoto" é obrigatório no POST.' }) as any;
  }

  // Para PUT: O campo `giftPhoto` é opcional
  if (isPut && !hasGiftPhoto) {
    return next();
  }

  if (hasGiftPhoto) {
    const giftPhoto = (req.files as { [fieldname: string]: Express.Multer.File[] })['giftPhoto'][0];
    if (giftPhoto.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: 'O arquivo da foto do presente excede o limite de 5MB.' }) as any;
    }
  }

  next();
};
