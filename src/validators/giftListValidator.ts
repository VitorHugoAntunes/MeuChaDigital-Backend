import { z } from 'zod';

export const createGiftListSchema = z.object({
  name: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  banner: z.string().optional(),
  userId: z.string().min(3, 'O ID do usuário está inválido'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  // deve ter um array vazio ou um array de objetos
  gifts: z.array(z.object({
    name: z.string().min(3, 'O título do presente deve ter pelo menos 3 caracteres'),
    description: z.string().min(3, 'A descrição do presente deve ter pelo menos 3 caracteres'),
    photo: z.string().url('A URL da foto do presente está inválida'),
    totalValue: z.number().int().positive('O valor total do presente deve ser positivo'),
    giftShares: z.number().int().positive('O número de cotas do presente deve ser positivo'),
    valuePerShare: z.number().int().positive('O valor por cota do presente deve ser positivo'),
    categoryId: z.string().min(3, 'O ID da categoria do presente está inválido'),
    giftListId: z.string().min(3, 'O ID da lista de presentes do presente está inválido'),
  })),
});