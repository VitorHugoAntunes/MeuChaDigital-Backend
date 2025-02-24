"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGiftSchema = void 0;
const zod_1 = require("zod");
exports.createGiftSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
    priority: zod_1.z.enum(['LOW', 'MEDIUM', 'HIGH']),
    description: zod_1.z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
    totalValue: zod_1.z.number().positive('O valor total deve ser positivo'),
    categoryId: zod_1.z.string().min(3, 'O ID da categoria está inválido'),
    userId: zod_1.z.string().min(3, 'O ID do usuário está inválido'),
    giftListId: zod_1.z.string().min(3, 'O ID da lista de presentes está inválido'),
});
