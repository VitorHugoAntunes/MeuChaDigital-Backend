"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanUploadDirectory = void 0;
const fs_1 = __importDefault(require("fs"));
const cleanUploadDirectory = (userId) => {
    if (!userId) {
        throw new Error('O ID do usuário é obrigatório para limpar o diretório de uploads.');
    }
    const uploadPath = `uploads/${userId}`;
    if (fs_1.default.existsSync(uploadPath)) {
        fs_1.default.rmdirSync(uploadPath, { recursive: true });
    }
};
exports.cleanUploadDirectory = cleanUploadDirectory;
