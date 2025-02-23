"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadedFiles = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_1 = __importDefault(require("../config/aws"));
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: aws_1.default,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `uploads/${Date.now()}_${file.originalname}`);
        },
        contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});
const validateUploadedFiles = (req, res, next) => {
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
exports.validateUploadedFiles = validateUploadedFiles;
