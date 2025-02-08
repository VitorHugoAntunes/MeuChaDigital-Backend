import { Request, Response } from 'express';
import { generateCharge } from '../services/paymentService';

export const createCharge = async (req: Request, res: Response) => {
  const { expiracao, original, chave, solicitacaoPagador } = req.body;

  const charge = await generateCharge(expiracao, original, chave, solicitacaoPagador);

  res.json(charge);
};