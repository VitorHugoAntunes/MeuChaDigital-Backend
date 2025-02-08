import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  googleId: z.string().min(3, 'O Google ID está inválido'),
  photo: z.string().optional(),
});
