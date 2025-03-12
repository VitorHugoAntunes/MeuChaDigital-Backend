import isValidCPF from '../utils/cpfValidation';
import { z, ZodIssueCode, RefinementCtx } from 'zod';

export enum PixKeyType {
  CPF = 'CPF',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  RANDOM = 'RANDOM',
}

export interface PixKeyDTO {
  key: string;
  type: PixKeyType;
  userId: string;
}

export const createPixKeySchema = z.object({
  key: z.string(),
  type: z.nativeEnum(PixKeyType),
  userId: z.string().uuid({ message: 'O userId deve ser um UUID válido' }),
}).superRefine((data, ctx: RefinementCtx) => {
  const { key, type } = data;

  if (type === PixKeyType.CPF && !isValidCPF(key)) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: 'O CPF deve conter exatamente 11 dígitos numéricos e ser um CPF válido',
      path: ['key'],
    });
  }

  if (type === PixKeyType.PHONE && !/^\d{10,11}$/.test(key)) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: 'O telefone deve conter 10 ou 11 dígitos numéricos (com DDD)',
      path: ['key'],
    });
  }

  if (type === PixKeyType.EMAIL && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(key)) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: 'O e-mail informado não é válido',
      path: ['key'],
    });
  }

  if (type === PixKeyType.RANDOM && !/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(key)) {
    ctx.addIssue({
      code: ZodIssueCode.custom,
      message: 'A chave aleatória deve ser um UUID v4 válido',
      path: ['key'],
    });
  }
});

export type CreatePixKeyInput = z.infer<typeof createPixKeySchema>;
