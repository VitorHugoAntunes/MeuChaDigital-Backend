// src/repositories/inviteeRepository.ts
import { PrismaClient } from '@prisma/client';
import { InviteeCreate } from '../models/inviteeModel';

const prisma = new PrismaClient();

export const createInviteeInDatabase = async (data: InviteeCreate) => {
  return prisma.invitee.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      additionalInvitees: data.additionalInvitees,
      observation: data.observation,
      giftList: { connect: { id: data.giftListId } },
      status: data.status,
    },
  });
};

export const getAllInviteesByGiftListSlugFromDatabase = async (slug: string) => {
  return prisma.invitee.findMany({
    where: {
      giftList: { slug }
    },
  });
};

export default {
  createInviteeInDatabase,
  getAllInviteesByGiftListSlugFromDatabase,
};