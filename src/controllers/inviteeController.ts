import { Request, Response } from 'express';
import InviteeService from '../services/inviteeService';
import { createInviteeSchema, updateInviteeSchema } from '../validators/inviteeValidator';
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

export const getAllInviteesWithPaginationByGiftListSlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { page, limit, search, status } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const limitNumber = parseInt(limit as string) || 10;

    if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
      return res.status(400).json({ error: 'Parâmetros de paginação inválidos.' });
    }
    const invitees = await InviteeService.getAllInviteesWithPaginationByGiftListSlugService(slug, pageNumber, limitNumber, search as string, status as string);
    return res.status(200).json(invitees) as any;
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar convidados: ' + (error as Error).message });
  }
};

export const getAllInviteesByGiftListSlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const invitees = await InviteeService.getAllInviteesByGiftListSlugService(slug);
    return res.status(200).json(invitees) as any;
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar convidados: ' + (error as Error).message });
  }
};

export const updateInvitee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, phone, email, additionalInvitees, observation, status } = updateInviteeSchema.parse(req.body);
    const invitee = await InviteeService.updateInviteeService(id, { name, phone, email, additionalInvitees, observation, status });
    res.status(200).json(invitee);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar convidado: ' + (error as Error).message });
    }
  }
}

export const deleteInvitee = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await InviteeService.deleteInviteeService(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar convidado: ' + (error as Error).message });
  }
}