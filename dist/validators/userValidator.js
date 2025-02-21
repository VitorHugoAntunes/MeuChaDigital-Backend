"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGuestUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    email: zod_1.z.string().email('E-mail inválido'),
    googleId: zod_1.z.string().min(3, 'O Google ID está inválido'),
    photo: zod_1.z.string().optional(),
});
exports.createGuestUserSchema = zod_1.z.object({
    isGuest: zod_1.z.boolean(),
});
