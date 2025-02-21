"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInviteeSchema = void 0;
const zod_1 = require("zod");
exports.createInviteeSchema = zod_1.z.object({
    name: zod_1.z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
    phone: zod_1.z.string().min(3, 'O telefone deve ter pelo menos 3 caracteres'),
    email: zod_1.z.string().email('O e-mail está inválido'),
    giftListId: zod_1.z.string().min(3, 'O ID do evento está inválido'),
    status: zod_1.z.enum(['ACCEPTED', 'REJECTED']),
});
