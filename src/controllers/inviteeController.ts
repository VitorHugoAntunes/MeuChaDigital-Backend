import { Request, Response } from 'express';
import InviteeService from '../services/inviteeService';
import { createInviteeSchema } from '../validators/inviteeValidator';
import { ZodError } from 'zod';

interface CreateInviteeParams {
  name: string;
  phone: string;
  email: string;
  giftListId: string;
  status: "ACCEPTED" | "REJECTED";
}

export const createInvitee = async (req: Request, res: Response) => {
  try {
    const { name, phone, email, additionalInvitees, observation, giftListId, status } = createInviteeSchema.parse(req.body);
    const invitee = await InviteeService.createInviteeService({ name, phone, email, additionalInvitees, observation, giftListId, status });
    res.status(201).json(invitee);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao criar convidado: ' + (error as Error).message });
    }
  }
};