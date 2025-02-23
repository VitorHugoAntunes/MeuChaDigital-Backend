"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const imageUploadService_1 = __importDefault(require("../services/imageUploadService"));
const uploadImage = (req, res) => {
    imageUploadService_1.default.upload.single("file")(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: "Erro ao fazer upload: " + err.message });
        }
        if (!req.file) {
            return res.status(400).json({ error: "Nenhum arquivo enviado" });
        }
        res.status(201).json({ imageUrl: req.file.location }); // O `multer-s3` retorna `location`
    });
};
exports.uploadImage = uploadImage;
