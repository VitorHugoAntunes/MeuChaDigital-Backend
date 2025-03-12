"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPixKeySchema = exports.PixKeyType = void 0;
const cpfValidation_1 = __importDefault(require("../utils/cpfValidation"));
const zod_1 = require("zod");
var PixKeyType;
(function (PixKeyType) {
    PixKeyType["CPF"] = "CPF";
    PixKeyType["PHONE"] = "PHONE";
    PixKeyType["EMAIL"] = "EMAIL";
    PixKeyType["RANDOM"] = "RANDOM";
})(PixKeyType || (exports.PixKeyType = PixKeyType = {}));
exports.createPixKeySchema = zod_1.z.object({
    key: zod_1.z.string(),
    type: zod_1.z.nativeEnum(PixKeyType),
    userId: zod_1.z.string().uuid({ message: 'O userId deve ser um UUID válido' }),
}).superRefine((data, ctx) => {
    const { key, type } = data;
    if (type === PixKeyType.CPF && !(0, cpfValidation_1.default)(key)) {
        ctx.addIssue({
            code: zod_1.ZodIssueCode.custom,
            message: 'O CPF deve conter exatamente 11 dígitos numéricos e ser um CPF válido',
            path: ['key'],
        });
    }
    if (type === PixKeyType.PHONE && !/^\d{10,11}$/.test(key)) {
        ctx.addIssue({
            code: zod_1.ZodIssueCode.custom,
            message: 'O telefone deve conter 10 ou 11 dígitos numéricos (com DDD)',
            path: ['key'],
        });
    }
    if (type === PixKeyType.EMAIL && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(key)) {
        ctx.addIssue({
            code: zod_1.ZodIssueCode.custom,
            message: 'O e-mail informado não é válido',
            path: ['key'],
        });
    }
    if (type === PixKeyType.RANDOM && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(key)) {
        ctx.addIssue({
            code: zod_1.ZodIssueCode.custom,
            message: 'A chave aleatória deve ser um UUID v4 válido',
            path: ['key'],
        });
    }
});
