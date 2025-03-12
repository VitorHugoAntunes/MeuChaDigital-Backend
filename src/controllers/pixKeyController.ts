import { Request, Response } from 'express';

import PixKeyService from '../services/pixKeyService';
import { createPixKeySchema } from '../validators/pixKeyValidator';

export const createPixKey = async (req: Request, res: Response) => {
  try {
    const { key, type, userId } = createPixKeySchema.parse(req.body);
    const pixKey = await PixKeyService.createPixKeyService({ key, type, userId });
    res.status(201).json(pixKey);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar chave PIX: ' + (error as Error).message });
  }
};

export const getAllPixKeysByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const pixKeys = await PixKeyService.getAllPixKeysByUserService(userId);
    res.status(200).json(pixKeys);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar chaves PIX: ' + (error as Error).message });
  }
};

export const updatePixKey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { key, type } = createPixKeySchema.parse(req.body);
    const pixKey = await PixKeyService.updatePixKeyService(id, { key, type });
    res.status(200).json(pixKey);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar chave PIX: ' + (error as Error).message });
  }
};

export const deletePixKey = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await PixKeyService.deletePixKeyService(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar chave PIX: ' + (error as Error).message });
  }
};
