"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGiftSchema = void 0;
const zod_1 = require("zod");
exports.createGiftSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
    description: zod_1.z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
    photo: zod_1.z.string().url('A URL da foto está inválida'),
    totalValue: zod_1.z.number().int().positive('O valor total deve ser positivo'),
    giftShares: zod_1.z.number().int().positive('O número de cotas deve ser positivo'),
    valuePerShare: zod_1.z.number().int().positive('O valor por cota deve ser positivo'),
    categoryId: zod_1.z.string().min(3, 'O ID da categoria está inválido'),
    giftListId: zod_1.z.string().min(3, 'O ID da lista de presentes está inválido'),
});
