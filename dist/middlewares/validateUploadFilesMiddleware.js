"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUploadedFilesForGift = exports.validateUploadedFilesForGiftList = exports.uploadMiddleware = exports.upload = exports.storage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        console.log('req.body:', req.body);
        console.log('req.files:', req.files);
        // Isso define a subpasta com base no campo (fieldname) do arquivo
        const subfolder = file.fieldname; // banner, moments_images ou giftPhoto
        const uploadsDir = path_1.default.join(__dirname, '..', '..', 'uploads', req.body.userId, subfolder);
        // Cria a pasta se não existir
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        // Define o destino do arquivo
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Define o nome do arquivo
        const fileName = `${file.fieldname}_${Date.now()}`;
        cb(null, fileName);
    },
});
exports.upload = (0, multer_1.default)({ storage: exports.storage });
const uploadMiddleware = (req, res, next) => {
    console.log('req.files:', req.files);
    exports.upload.fields([
        { name: 'banner', maxCount: 1 },
        { name: 'moments_images', maxCount: 10 },
        { name: 'giftPhoto', maxCount: 1 },
    ])(req, res, next);
};
exports.uploadMiddleware = uploadMiddleware;
const validateUploadedFilesForGiftList = (req, res, next) => {
    const isPost = req.method === 'POST';
    const isPut = req.method === 'PUT';
    const hasBanner = !!req.files['banner'];
    const hasMoments = !!req.files['moments_images'];
    // Para POST: Ambos `banner` e `moments_images` são obrigatórios
    if (isPost && (!hasBanner || !hasMoments)) {
        return res.status(400).json({ error: 'Os campos "banner" e "moments_images" são obrigatórios no POST.' });
    }
    // Para PUT: Pode ter `banner`, `moments_images`, ambos ou nenhum
    if (isPut && !hasBanner && !hasMoments) {
        return next();
    }
    if (hasBanner) {
        const bannerFile = req.files['banner'][0];
        if (bannerFile.size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'O arquivo do banner excede o limite de 5MB.' });
        }
    }
    if (hasMoments) {
        const momentsImages = req.files['moments_images'];
        for (const file of momentsImages) {
            if (file.size > 5 * 1024 * 1024) {
                return res.status(400).json({ error: 'Uma ou mais imagens de momentos excedem o limite de 5MB.' });
            }
        }
    }
    next();
};
exports.validateUploadedFilesForGiftList = validateUploadedFilesForGiftList;
const validateUploadedFilesForGift = (req, res, next) => {
    const isPost = req.method === 'POST';
    const isPut = req.method === 'PUT';
    const hasGiftPhoto = !!req.files['giftPhoto'];
    // Para POST: O campo `giftPhoto` é obrigatório
    if (isPost && !hasGiftPhoto) {
        return res.status(400).json({ error: 'O campo "giftPhoto" é obrigatório no POST.' });
    }
    // Para PUT: O campo `giftPhoto` é opcional
    if (isPut && !hasGiftPhoto) {
        return next();
    }
    if (hasGiftPhoto) {
        const giftPhoto = req.files['giftPhoto'][0];
        if (giftPhoto.size > 5 * 1024 * 1024) {
            return res.status(400).json({ error: 'O arquivo da foto do presente excede o limite de 5MB.' });
        }
    }
    next();
};
exports.validateUploadedFilesForGift = validateUploadedFilesForGift;
