import { Request, Response } from 'express';
import UserService from '../services/giftService';
import { createGiftListSchema } from '../validators/giftListValidator';
import { createGiftSchema } from '../validators/giftValidator';
import { ZodError } from 'zod';

interface CreateGiftParams {
  name: string;
  title: string;
  description: string;
  photo: string;
  totalValue: number;
  giftShares: number;
  valuePerShare: number;
  categoryId: string;
  giftListId: string;
}

interface CreateGiftListParams {
  name: string;
  description: string;
  banner: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE";
  gifts: CreateGiftParams[];
}

export const createGiftList = async (req: Request, res: Response) => {
  try {
    const { name, description, banner, userId, status, gifts } = createGiftListSchema.parse(req.body);
    const giftList = await UserService.createGiftList({ name, description, banner, userId, status, gifts });
    res.status(201).json(giftList); // Envia a resposta manualmente
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao criar lista de presentes: ' + (error as Error).message });
    }
  }
};

export const getAllGiftLists = async (req: Request, res: Response) => {
  const giftLists = await UserService.getAllGiftLists();
  res.json(giftLists);
};

export const getGiftListById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const giftList = await UserService.getGiftListById(id);
  if (giftList) {
    res.json(giftList);
  } else {
    res.status(404).json({ error: 'Lista de presentes não encontrada' });
  }
}

export const createGift = async (req: Request, res: Response) => {
  try {
    const { name, description, photo, totalValue, giftShares, valuePerShare, categoryId, giftListId } = createGiftSchema.parse(req.body);
    const gift = await UserService.createGift({ name, description, photo, totalValue, giftShares, valuePerShare, categoryId, giftListId });
    res.status(201).json(gift);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao criar presente: ' + (error as Error).message });
    }
  }
};

export const getAllGifts = async (req: Request, res: Response) => {
  const gifts = await UserService.getAllGifts();
  res.json(gifts);
};

export const getGiftById = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  const gift = await UserService.getGiftById(id);
  if (gift) {
    res.json(gift);
  } else {
    res.status(404).json({ error: 'Presente não encontrado' });
  }
};

export const updateGiftList = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  try {
    const { name, description, banner, userId, status } = createGiftListSchema.parse(req.body);
    const giftList = await UserService.updateGiftList(id, {
      name, description, banner, userId, status,
      gifts: []
    });
    res.json(giftList);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar lista de presentes: ' + (error as Error).message });
    }
  }
};

export const updateGift = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  try {
    const { name, description, photo, totalValue, giftShares, valuePerShare, categoryId, giftListId } = createGiftSchema.parse(req.body);
    const gift = await UserService.updateGift(id, {
      name, description, photo, totalValue, giftShares, valuePerShare, categoryId, giftListId
    });
    res.json(gift);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar presente: ' + (error as Error).message });
    }
  }
};

export const deleteGiftList = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  try {
    const giftList = await UserService.deleteGiftList(id);
    if (giftList) {
      res.json(giftList);
    } else {
      res.status(404).json({ error: 'Lista de presentes não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar lista de presentes: ' + (error as Error).message });
  }
};

export const deleteGift = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  try {
    const gift = await UserService.deleteGift(id);
    if (gift) {
      res.json(gift);
    } else {
      res.status(404).json({ error: 'Presente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar presente: ' + (error as Error).message });
  }
};
