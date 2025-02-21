import { PrismaClient } from '@prisma/client';
import { InviteeCreate } from '../models/inviteeModel';

const prisma = new PrismaClient();

const createInvitee = async (data: InviteeCreate) => {
  const invitee = await prisma.invitee.create({
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      giftList: { connect: { id: data.giftListId } },
      status: data.status,
    },
  });

  return invitee;
};

export default { createInvitee };