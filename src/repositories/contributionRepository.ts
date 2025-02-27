import { PrismaClient } from '@prisma/client';
import { ContributionCreate } from '../models/contributionModel';

const prisma = new PrismaClient();

const findChargeByTxId = async (txId: string) => {
  return prisma.charge.findFirst({
    where: { txId },
  });
};

const findUserById = async (userId: string) => {
  return prisma.user.findFirst({
    where: { id: userId },
  });
};

const updateChargePaymentDate = async (chargeId: string, paymentDate: string) => {
  return prisma.charge.update({
    where: { id: chargeId },
    data: { paymentDate },
  });
};

const createContributionInDatabase = async (data: ContributionCreate, giftId: string, userId: string) => {
  return prisma.contribution.create({
    data: {
      value: data.value,
      message: data.message,
      gift: { connect: { id: giftId } },
      user: { connect: { id: userId } },
    },
  });
};

export {
  findChargeByTxId,
  findUserById,
  updateChargePaymentDate,
  createContributionInDatabase,
};