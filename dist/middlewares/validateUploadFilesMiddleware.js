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
        const uploadsDir = path_1.default.join(__dirname, '..', '..', 'uploads', req.body.userId);
        // Verifica se a pasta existe, e se não, cria
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true }); // `recursive: true` cria pastas pai, se necessário
        }
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Inclui o fieldname no nome do arquivo
        const fileName = `${file.fieldname}_${Date.now()}`;
        cb(null, fileName);
    },
});
exports.upload = (0, multer_1.default)({ storage: exports.storage });
exports.uploadMiddleware = exports.upload.fields([
    { name: 'banner', maxCount: 1 }, // banner (upload único)
    { name: 'moments_images', maxCount: 10 }, // imagens de momentos (upload múltiplo)
    { name: 'giftPhoto', maxCount: 1 }, // foto do presente (upload único)
]);
const validateUploadedFilesForGiftList = (req, res, next) => {
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
exports.validateUploadedFilesForGiftList = validateUploadedFilesForGiftList;
const validateUploadedFilesForGift = (req, res, next) => {
    if (!req.files || !req.files['giftPhoto']) {
        return res.status(400).json({ error: 'Nenhum arquivo enviado no campo "giftPhoto".' });
    }
    const giftPhoto = req.files['giftPhoto'][0];
    if (giftPhoto.size > 5 * 1024 * 1024) { // 5MB
        return res.status(400).json({ error: 'O arquivo da foto do presente excede o limite de 5MB.' });
    }
    next();
};
exports.validateUploadedFilesForGift = validateUploadedFilesForGift;
