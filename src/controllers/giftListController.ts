import { Request, Response } from 'express';
import GiftListService from '../services/giftListService';
import { createGiftListSchema, updateGiftListSchema } from '../validators/giftListValidator';
import { ZodError } from 'zod';

export const createGiftList = async (req: Request, res: Response) => {
  try {
    const parsedGifts = req.body.gifts ? JSON.parse(req.body.gifts) : [];

    const { userId, type, name, slug, eventDate, description, status } =
      createGiftListSchema.parse({ ...req.body, gifts: parsedGifts });

    const giftList = await GiftListService.createGiftListService(
      { userId, type, name, slug, eventDate, description, status, gifts: parsedGifts },
      req,
      res
    );

    res.status(201).json({ message: 'Lista de presentes criada com sucesso', giftList });

  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar lista de presentes', details: (error as Error).message });
  }
};

export const getAllGiftLists = async (req: Request, res: Response) => {
  const giftLists = await GiftListService.getAllGiftListsService();
  res.json(giftLists);
};

export const getGiftListById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const giftList = await GiftListService.getGiftListByIdService(id);
  if (giftList) {
    res.json(giftList);
  } else {
    res.status(404).json({ error: 'Lista de presentes não encontrada' });
  }
}

export const getAllGiftListsByUserId = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const giftLists = await GiftListService.getAllGiftListsByUserIdService(userId);
  res.json(giftLists);
};

export const getGiftListBySlug = async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const giftList = await GiftListService.getGiftListBySlugService(slug);
  if (giftList) {
    res.json(giftList);
  } else {
    res.status(404).json({ error: 'Lista de presentes não encontrada' });
  }
};

export const updateGiftList = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const { userId, giftListId, type, name, slug, eventDate, description, status } = updateGiftListSchema.parse(req.body);
    console.log('req.body', req.body);
    const giftList = await GiftListService.updateGiftListService(id, { userId, giftListId, type, name, slug, eventDate, description, status }, req, res);
    res.json(giftList);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar lista de presentes: ' + (error as Error).message });
    }
  }
};

export const deleteGiftList = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const giftList = await GiftListService.deleteGiftList(id);
    if (giftList) {
      res.json(giftList);
    } else {
      res.status(404).json({ error: 'Lista de presentes não encontrada' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar lista de presentes: ' + (error as Error).message });
  }
};