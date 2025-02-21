import { z } from 'zod';

export const createGiftSchema = z.object({
  name: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  photo: z.string().url('A URL da foto está inválida'),
  totalValue: z.number().positive('O valor total deve ser positivo'),
  categoryId: z.string().min(3, 'O ID da categoria está inválido'),
  giftListId: z.string().min(3, 'O ID da lista de presentes está inválido'),
});
