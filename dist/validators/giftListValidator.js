"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGiftListSchema = void 0;
const zod_1 = require("zod");
exports.createGiftListSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
    description: zod_1.z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
    banner: zod_1.z.string().optional(),
    userId: zod_1.z.string().min(3, 'O ID do usuário está inválido'),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']),
    // deve ter um array vazio ou um array de objetos
    gifts: zod_1.z.array(zod_1.z.object({
        name: zod_1.z.string().min(3, 'O título do presente deve ter pelo menos 3 caracteres'),
        description: zod_1.z.string().min(3, 'A descrição do presente deve ter pelo menos 3 caracteres'),
        photo: zod_1.z.string().url('A URL da foto do presente está inválida'),
        totalValue: zod_1.z.number().int().positive('O valor total do presente deve ser positivo'),
        giftShares: zod_1.z.number().int().positive('O número de cotas do presente deve ser positivo'),
        valuePerShare: zod_1.z.number().int().positive('O valor por cota do presente deve ser positivo'),
        categoryId: zod_1.z.string().min(3, 'O ID da categoria do presente está inválido'),
        giftListId: zod_1.z.string().min(3, 'O ID da lista de presentes do presente está inválido'),
    })),
});
