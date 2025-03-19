import { PrismaClient, Prisma } from '@prisma/client';
import { InviteeCreate, InviteeUpdate } from '../models/inviteeModel';

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

export const getAllInviteesWithPaginationByGiftListSlugFromDatabase = async (
  slug: string,
  page: number = 1,
  limit: number = 10,
  search: string = "",
  status: string = ""
) => {
  const skip = (page - 1) * limit;

  const baseWhereClause: Prisma.InviteeWhereInput = {
    giftList: { slug },
    AND: [
      {
        OR: [
          { name: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
          { phone: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
          { email: { contains: search, mode: "insensitive" as Prisma.QueryMode } },
        ],
      },
    ],
  };

  if (status !== "") {
    (baseWhereClause.AND as Prisma.InviteeWhereInput[]).push({
      status: status.toUpperCase() as "ACCEPTED" | "REJECTED",
    });
  }

  const [invitees, total, counts] = await Promise.all([
    prisma.invitee.findMany({
      where: baseWhereClause,
      skip,
      take: limit,
    }),
    prisma.invitee.count({
      where: baseWhereClause,
    }),
    prisma.invitee.groupBy({
      by: ["status"],
      where: { giftList: { slug } },
      _count: { status: true },
    }),
  ]);

  let totalWithoutPagination = 0;
  let totalAccepted = 0;
  let totalRejected = 0;

  for (const count of counts) {
    totalWithoutPagination += count._count.status;
    if (count.status === "ACCEPTED") totalAccepted = count._count.status;
    if (count.status === "REJECTED") totalRejected = count._count.status;
  }

  return {
    invitees,
    total,
    totalPages: Math.ceil(total / limit),
    totalWithoutPagination,
    totalAccepted,
    totalRejected,
  };
};

export const getAllInviteesByGiftListSlugFromDatabase = async (slug: string) => {
  return prisma.invitee.findMany({
    where: {
      giftList: { slug },
    },
  });
};

export const updateInviteeInDatabase = async (id: string, data: InviteeUpdate) => {
  return prisma.invitee.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      phone: data.phone,
      email: data.email,
      additionalInvitees: data.additionalInvitees,
      observation: data.observation,
      status: data.status,
    },
  });
};

export const deleteInviteeInDatabase = async (id: string) => {
  return prisma.invitee.delete({
    where: {
      id,
    },
  });
};

export default {
  createInviteeInDatabase,
  getAllInviteesWithPaginationByGiftListSlugFromDatabase,
  getAllInviteesByGiftListSlugFromDatabase,
  updateInviteeInDatabase,
  deleteInviteeInDatabase,
};