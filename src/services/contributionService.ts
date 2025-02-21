import { PrismaClient } from '@prisma/client';
import { ContributionCreate } from '../models/contributionModel';
import PaymentService from '../services/paymentService';
import axios from 'axios';
import { getEfiToken } from '../config/efi';

const prisma = new PrismaClient();

import dotenv from 'dotenv';
dotenv.config();

const EFI_URL = process.env.EFI_URL || 'https://pix.api.efipay.com.br';

const efiRequest = async (txtId: string) => {
  const credentials = await getEfiToken();
  const URL = `${EFI_URL}/v2/cob/${txtId}`;

  const config = {
    httpsAgent: credentials.agent,
    headers: {
      Authorization: `Bearer ${credentials.token}`,
      'Content-Type': 'application/json',
    },
  };

  const response = await axios.get(URL, config);

  return response.data;
}

const createContribution = async (data: ContributionCreate) => {
  console.log('DADOS RECEBIDOS NO SERVICE DE CONTRIBUIÇÃO');
  console.log(data);

  const charge = await prisma.charge.findFirst({
    where: {
      txId: data.txId,
    },
  });

  if (!charge) {
    throw new Error('Charge not found');
  }

  const user = await prisma.user.findFirst({
    where: {
      id: charge?.payerId,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  const paymentDate = await efiRequest(data.txId);

  const updatedCharge = await prisma.charge.update({
     where: {
       id: charge.id,
     },
     data: {
       paymentDate: paymentDate.pix[0].horario,
     },
  });

  const contribution = await prisma.contribution.create({
    data: {
      value: data.value,
      message: data.message,
      gift: {
        connect: {
          id: charge.giftId,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  await PaymentService.createPayment({
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
  createContribution,
};
