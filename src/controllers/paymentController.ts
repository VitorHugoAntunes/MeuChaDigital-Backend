import { Request, Response } from 'express';
import PaymentService from '../services/paymentService';

export const createCharge = async (req: Request, res: Response) => {
  const { expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest } = req.body;

  const charge = await PaymentService.generateChargeService(expiracao, original, chave, solicitacaoPagador, giftId, payerId, isGuest);

  res.json(charge);
};

export const createPayment = async (req: Request, res: Response) => {
  const { status, paymentMethod, pixKey, paymentDate, contributionId } = req.body;

  const payment = await PaymentService.createPaymentService({ status, paymentMethod, pixKey, paymentDate, contributionId });

  res.json(payment);
};

export const getCharge = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { giftId } = req.query;

  try {
    const charge = await PaymentService.getChargeService(id, giftId as string);

    if (!charge) {
      res.status(404).json({ error: 'Cobrança não encontrada ou expirada' });
      return;
    }

    res.json(charge);
  } catch (error) {
    console.error('Erro ao buscar cobrança:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};