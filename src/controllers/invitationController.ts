// src/controllers/invitationController.ts
import { Request, Response } from 'express';
import {
  getGiftListBySubdomain,
  getAllGiftsBySubdomain,
  getGiftByIdFromSubdomain,
} from '../services/invitationService';

export const getInvitation = async (req: Request, res: Response) => {
  const subdomain = (req as any).subdomain;

  try {
    const giftList = await getGiftListBySubdomain(subdomain);
    if (!giftList) {
      return res.status(404).send('Lista de presentes não encontrada') as any;
    }

    res.json(giftList);
  } catch (error) {
    console.error('Erro ao buscar lista de presentes:', error);
    res.status(500).send('Erro interno do servidor') as any;
  }
};

export const getGifts = async (req: Request, res: Response) => {
  const subdomain = (req as any).subdomain;

  try {
    const gifts = await getAllGiftsBySubdomain(subdomain);
    res.json(gifts);
  } catch (error) {
    console.error('Erro ao buscar presentes:', error);
    res.status(500).send('Erro interno do servidor');
  }
};

export const getGift = async (req: Request, res: Response) => {
  const subdomain = (req as any).subdomain;

  const giftId = req.params.id;

  try {
    const gift = await getGiftByIdFromSubdomain(subdomain, giftId);
    if (!gift) {
      return res.status(404).send('Presente não encontrado') as any;
    }

    res.json(gift);
  } catch (error) {
    console.error('Erro ao buscar presente:', error);
    res.status(500).send('Erro interno do servidor') as any;
  }
};