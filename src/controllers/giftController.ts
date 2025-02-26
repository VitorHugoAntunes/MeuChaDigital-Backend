import { Request, Response } from 'express';
import GiftService from '../services/giftService';
import { createGiftSchema, updateGiftSchema } from '../validators/giftValidator';
import { ZodError } from 'zod';

export const createGift = async (req: Request, res: Response) => {
  try {
    const parsedTotalValue = parseFloat(req.body.totalValue);

    const { name, priority, description, totalValue, categoryId, userId, giftListId } = createGiftSchema.parse({ ...req.body, totalValue: parsedTotalValue });
    const gift = await GiftService.createGiftService({ name, priority, description, totalValue: parsedTotalValue, categoryId, giftListId }, req, res);
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
  const gifts = await GiftService.getAllGiftsService();
  res.json(gifts);
};

export const getGiftById = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  const gift = await GiftService.getGiftByIdService(id);
  if (gift) {
    res.json(gift);
  } else {
    res.status(404).json({ error: 'Presente não encontrado' });
  }
};

export const updateGift = async (req: Request, res: Response) => {
  const userId = req.body.userId;
  const giftListId = req.params.id;
  const giftId = req.params.giftId;

  try {
    const { name, priority, description, totalValue, categoryId } = updateGiftSchema.parse(req.body);
    const gift = await GiftService.updateGiftService(userId, giftListId, giftId, { name, priority, description, totalValue, categoryId }, req);
    res.json(gift);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar presente: ' + (error as Error).message });
    }
  }
};

export const deleteGift = async (req: Request, res: Response) => {
  const id = req.params.giftId;
  try {
    const gift = await GiftService.deleteGiftService(id);
    if (gift) {
      res.json(gift);
    } else {
      res.status(404).json({ error: 'Presente não encontrado' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar presente: ' + (error as Error).message });
  }
};