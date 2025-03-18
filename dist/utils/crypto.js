"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptPixKey = exports.encryptPixKey = void 0;
const crypto_1 = __importDefault(require("crypto"));
const encryptPixKey = (key) => {
    const iv = crypto_1.default.randomBytes(16);
    if (!process.env.ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY is not defined');
    }
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    console.log(encryptionKey.length); // Deve ser 32
    if (encryptionKey.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be 32 bytes');
    }
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', encryptionKey, iv);
    let encrypted = cipher.update(key, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return { encryptedKey: encrypted, iv: iv.toString('hex') };
};
exports.encryptPixKey = encryptPixKey;
const decryptPixKey = (encryptedKey, iv) => {
    if (!process.env.ENCRYPTION_KEY) {
        throw new Error('ENCRYPTION_KEY is not defined');
    }
    const encryptionKey = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
    if (encryptionKey.length !== 32) {
        throw new Error('ENCRYPTION_KEY must be 32 bytes');
    }
    const ivBuffer = Buffer.from(iv, 'hex');
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', encryptionKey, ivBuffer);
    let decrypted = decipher.update(encryptedKey, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decryptPixKey = decryptPixKey;
const key = crypto_1.default.randomBytes(32).toString('hex');
