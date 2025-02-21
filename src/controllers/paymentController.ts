import { Request, Response } from 'express';
import PaymentService from '../services/paymentService';

export const createCharge = async (req: Request, res: Response) => {
  const { expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest } = req.body;

  const charge = await PaymentService.generateCharge(expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest);

  res.json(charge);
};

export const createPayment = async (req: Request, res: Response) => {
  const { status, paymentMethod, pixKey, paymentDate, contributionId } = req.body;

  const payment = await PaymentService.createPayment({ status, paymentMethod, pixKey, paymentDate, contributionId });

  res.json(payment);
};
