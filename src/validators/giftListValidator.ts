import { z } from 'zod';

export const createGiftListSchema = z.object({
  name: z.string().min(3, 'O título deve ter pelo menos 3 caracteres'),
  slug: z.string().min(3, 'O slug deve ter pelo menos 3 caracteres'),
  type: z.enum(['WEDDING', 'BIRTHDAY', 'BABY_SHOWER']),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'A data do evento está inválida'),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres'),
  shareableLink: z.string().url('O link compartilhável está inválido').optional(),
  userId: z.string().min(3, 'O ID do usuário está inválido'),
  status: z.enum(['ACTIVE', 'INACTIVE']),
  gifts: z.array(
    z.object({
      name: z.string().min(3, 'O título do presente deve ter pelo menos 3 caracteres'),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
      description: z.string().min(3, 'A descrição do presente deve ter pelo menos 3 caracteres'),
      photo: z.string().url('A URL da foto do presente está inválida'),
      totalValue: z.number().positive('O valor total do presente deve ser positivo'),
      categoryId: z.string().min(3, 'O ID da categoria do presente está inválido'),
      giftListId: z.string().min(3, 'O ID da lista de presentes do presente está inválido'),
    })
  ).optional(),
});

export const updateGiftListSchema = z.object({
  userId: z.string().min(3, 'O ID do usuário está inválido'),
  giftListId: z.string().min(3, 'O ID da lista de presentes está inválido'),
  name: z.string().min(3, 'O título deve ter pelo menos 3 caracteres').optional(),
  slug: z.string().min(3, 'O slug deve ter pelo menos 3 caracteres').optional(),
  type: z.enum(['WEDDING', 'BIRTHDAY', 'BABY_SHOWER']).optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'A data do evento está inválida').optional(),
  description: z.string().min(3, 'A descrição deve ter pelo menos 3 caracteres').optional(),
  shareableLink: z.string().url('O link compartilhável está inválido').optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
