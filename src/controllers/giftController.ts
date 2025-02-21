import { Request, Response } from 'express';
import GiftService from '../services/giftService';
import { createGiftListSchema } from '../validators/giftListValidator';
import { createGiftSchema } from '../validators/giftValidator';
import { ZodError } from 'zod';

interface CreateGiftParams {
  name: string;
  title: string;
  description: string;
  photo: string;
  totalValue: number;
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
    const { userId, type, name, slug, eventDate, description, banner, moments_images, shareableLink, status, gifts } = createGiftListSchema.parse(req.body);
    const giftList = await GiftService.createGiftList({ userId, type, name, slug, eventDate, description, banner, moments_images, shareableLink, status, gifts: gifts || [] });
    res.status(201).json(giftList);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao criar lista de presentes: ' + (error as Error).message });
    }
  }
};

export const getAllGiftLists = async (req: Request, res: Response) => {
  const giftLists = await GiftService.getAllGiftLists();
  res.json(giftLists);
};

export const getGiftListById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const giftList = await GiftService.getGiftListById(id);
  if (giftList) {
    res.json(giftList);
  } else {
    res.status(404).json({ error: 'Lista de presentes não encontrada' });
  }
}

export const createGift = async (req: Request, res: Response) => {
  try {
    const { name, priority, description, photo, totalValue, categoryId, giftListId } = createGiftSchema.parse(req.body);
    const gift = await GiftService.createGift({ name, priority, description, photo, totalValue, categoryId, giftListId });
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
  const gifts = await GiftService.getAllGifts();
  res.json(gifts);
};

export const getGiftById = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  const gift = await GiftService.getGiftById(id);
  if (gift) {
    res.json(gift);
  } else {
    res.status(404).json({ error: 'Presente não encontrado' });
  }
};

export const updateGiftList = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  try {
    const { userId, type, name, slug, eventDate, description, banner, moments_images, shareableLink, status, gifts } = createGiftListSchema.parse(req.body);
    const giftList = await GiftService.updateGiftList(id, { userId, type, name, slug, eventDate, description, banner, moments_images, shareableLink, status, gifts: gifts || [] });
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
    const { name, priority, description, photo, totalValue, categoryId, giftListId } = createGiftSchema.parse(req.body);
    const gift = await GiftService.updateGift(id, { name, priority, description, photo, totalValue, categoryId, giftListId });
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
    const giftList = await GiftService.deleteGiftList(id);
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
    const gift = await GiftService.deleteGift(id);
    if (gift) {
      res.json(gift);
    } else {
      res.status(404).json({ error: 'Presente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar presente: ' + (error as Error).message });
  }
};
