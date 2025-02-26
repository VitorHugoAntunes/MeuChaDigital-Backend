"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGiftListSchema = exports.createGiftListSchema = void 0;
const zod_1 = require("zod");
exports.createGiftListSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
    slug: zod_1.z.string().min(3, 'O slug deve ter pelo menos 3 caracteres'),
    type: zod_1.z.enum(['WEDDING', 'BIRTHDAY', 'BABY_SHOWER']),
    eventDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'A data do evento está inválida'),
    description: zod_1.z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
    shareableLink: zod_1.z.string().url('O link compartilhável está inválido').optional(),
    userId: zod_1.z.string().min(3, 'O ID do usuário está inválido'),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']),
    gifts: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(3, 'O título do presente deve ter pelo menos 3 caracteres'),
        priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']),
        description: zod_1.z.string().min(3, 'A descrição do presente deve ter pelo menos 3 caracteres'),
        photo: zod_1.z.string().url('A URL da foto do presente está inválida'),
        totalValue: zod_1.z.number().positive('O valor total do presente deve ser positivo'),
        categoryId: zod_1.z.string().min(3, 'O ID da categoria do presente está inválido'),
        giftListId: zod_1.z.string().min(3, 'O ID da lista de presentes do presente está inválido'),
    })).optional(),
});
exports.updateGiftListSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'O título deve ter pelo menos 3 caracteres').optional(),
    slug: zod_1.z.string().min(3, 'O slug deve ter pelo menos 3 caracteres').optional(),
    type: zod_1.z.enum(['WEDDING', 'BIRTHDAY', 'BABY_SHOWER']).optional(),
    eventDate: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'A data do evento está inválida').optional(),
    description: zod_1.z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres').optional(),
    shareableLink: zod_1.z.string().url('O link compartilhável está inválido').optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
