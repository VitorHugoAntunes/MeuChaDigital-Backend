// src/repositories/paymentRepository.ts
import { PrismaClient } from '@prisma/client';
import { ChargeCreate, PaymentCreate } from '../models/paymentModel';

const prisma = new PrismaClient();

export const createChargeInDatabase = async (data: ChargeCreate) => {
  return prisma.charge.create({
    data: {
      localId: data.localId,
      txId: data.txId,
      giftId: data.giftId,
      payerId: data.payerId,
      value: data.value,
      paymentMethod: data.paymentMethod,
      pixKey: data.pixKey,
      pixCopyAndPaste: data.pixCopyAndPaste,
      qrCode: data.qrCode,
      generatedAt: data.generatedAt,
      expirationDate: data.expirationDate,
    },
  });
};

export const getChargeInDatabase = async (id: string, giftId: string) => {
  return prisma.charge.findFirst({
    where: {
      localId: id,
      giftId,
      expirationDate: {
        gte: new Date(),
      },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const createPaymentInDatabase = async (data: PaymentCreate) => {
  return prisma.payment.create({
    data: {
      status: data.status,
      paymentMethod: data.paymentMethod,
      pixKey: data.pixKey,
      paymentDate: data.paymentDate,
      contribution: {
        connect: {
          id: data.contributionId,
        },
      },
    },
  });
};

export default {
  createChargeInDatabase,
  createPaymentInDatabase,
  getChargeInDatabase,
};