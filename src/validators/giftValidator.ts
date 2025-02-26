import { z } from 'zod';

export const createGiftSchema = z.object({
  name: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  totalValue: z.number().positive('O valor total deve ser positivo'),
  categoryId: z.string().min(3, 'O ID da categoria está inválido'),
  userId: z.string().min(3, 'O ID do usuário está inválido'),
  giftListId: z.string().min(3, 'O ID da lista de presentes está inválido'),
});

export const updateGiftSchema = z.object({
  name: z.string().min(3, 'O título deve ter pelo menos 3 caracteres').optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres').optional(),
  totalValue: z.number().positive('O valor total deve ser positivo').optional(),
  categoryId: z.string().min(3, 'O ID da categoria está inválido').optional(),
});
