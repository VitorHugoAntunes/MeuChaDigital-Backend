import { z } from 'zod';

export const createInviteeSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  phone: z.string().min(3, 'O telefone deve ter pelo menos 3 caracteres'),
  email: z.string().email('O e-mail está inválido'),
  additionalInvitees: z.number().min(0, 'O número de convidados adicionais deve ser maior ou igual a 0'),
  observation: z.string().min(1, 'A observação deve ter pelo menos 1 caractere'),
  giftListId: z.string().min(3, 'O ID do evento está inválido'),
  status: z.enum(['ACCEPTED', 'REJECTED']),
});