import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

interface MulterRequest extends Request {
  files: { [fieldname: string]: Express.Multer.File[] };
}

export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = path.join(__dirname, '..', '..', 'uploads', req.body.userId);
    // Verifica se a pasta existe, e se não, cria
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // `recursive: true` cria pastas pai, se necessário
    }
    cb(null, uploadsDir);
  },
  filename: (req: MulterRequest, file, cb) => {
    // Inclui o fieldname no nome do arquivo
    const fileName = `${file.fieldname}_${Date.now()}`;
    cb(null, fileName);
  },
});

export const upload = multer({ storage });

export const uploadMiddleware = upload.fields([
  { name: 'banner', maxCount: 1 }, // banner (upload único)
  { name: 'moments_images', maxCount: 10 }, // imagens de momentos (upload múltiplo)
  { name: 'giftPhoto', maxCount: 1 }, // foto do presente (upload único)
]);

export const validateUploadedFilesForGiftList = (req: any, res: any, next: any) => {
  if (!req.files || !req.files['banner']) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado no campo "banner".' });
  }

  if (!req.files || !req.files['moments_images']) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado no campo "moments_images".' });
  }

  const bannerFile = req.files['banner'][0];
  if (bannerFile.size > 5 * 1024 * 1024) { // 5MB
    return res.status(400).json({ error: 'O arquivo do banner excede o limite de 5MB.' });
  }

  const momentsImages = req.files['moments_images'];
  for (const file of momentsImages) {
    if (file.size > 5 * 1024 * 1024) { // 5MB
      return res.status(400).json({ error: 'Uma ou mais imagens de momentos excedem o limite de 5MB.' });
    }
  }

  next();
};

export const validateUploadedFilesForGift = (req: any, res: any, next: any) => {
  if (!req.files || !req.files['giftPhoto']) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado no campo "giftPhoto".' });
  }

  const giftPhoto = req.files['giftPhoto'][0];
  if (giftPhoto.size > 5 * 1024 * 1024) { // 5MB
    return res.status(400).json({ error: 'O arquivo da foto do presente excede o limite de 5MB.' });
  }

  next();
};