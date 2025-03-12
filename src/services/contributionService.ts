import { ContributionCreate } from '../models/contributionModel';
import PaymentService from './paymentService';
import {
  findChargeByTxId,
  findUserById,
  updateChargePaymentDate,
  createContributionInDatabase,
} from '../repositories/contributionRepository';

import EFIService from '../services/efiService';

const createContributionService = async (data: ContributionCreate) => {
  console.log('DADOS RECEBIDOS NO SERVICE DE CONTRIBUIÇÃO');
  console.log(data);

  const charge = await findChargeByTxId(data.txId);
  if (!charge) {
    throw new Error('Charge not found');
  }

  // Buscar o usuário pelo ID do pagador
  const user = await findUserById(charge.payerId);
  if (!user) {
    throw new Error('User not found');
  }

  const paymentDate = await EFIService.getChargeByTxId(data.txId);

  await updateChargePaymentDate(charge.id, paymentDate.pix[0].horario);

  if (charge.giftId === null) {
    return;
  }

  const contribution = await createContributionInDatabase(data, charge.giftId, user.id);

  await PaymentService.createPaymentService({
    status: 'PAID',
    paymentMethod: charge.paymentMethod,
    pixKey: charge.pixKey,
    paymentDate: paymentDate.pix[0].horario,
    contributionId: contribution.id,
  });

  console.log('Passou pelo service de contribuição');
  console.log(contribution);
  return contribution;
};

export default {
  createContributionService,
};