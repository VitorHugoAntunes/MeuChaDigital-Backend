import ContributionService from '../services/contributionService';

import { Request, Response } from 'express';

export const createContribution = async (req: Request, res: Response) => {
  try {
    const { txid: txId, valor: value, infoPagador: message } = req.body.pix[0];

    const formattedValue = Number(value);

    const contribution = await ContributionService.createContribution({ value: formattedValue, message, txId });
    console.log('Passou pelo controller de contribuição');
    res.status(201).json(contribution);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Erro ao criar contribuição: ' + (error as Error).message });
  }
};
