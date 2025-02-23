import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/aws";

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME!,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `uploads/${Date.now()}_${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE,
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

export const validateUploadedFiles = (req: any, res: any, next: any) => {
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