import { z } from 'zod';

export const createInviteeSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  phone: z.string().min(3, 'O telefone deve ter pelo menos 3 caracteres'),
  email: z.string().email('O e-mail está inválido'),
  additionalInvitees: z.number().int().positive(),
  observation: z.string().min(3, 'A observação deve ter pelo menos 3 caracteres'),
  giftListId: z.string().min(3, 'O ID do evento está inválido'),
  status: z.enum(['ACCEPTED', 'REJECTED']),
});