import { InviteeCreate } from '../models/inviteeModel';
import { createInviteeInDatabase, getAllInviteesByGiftListSlugFromDatabase } from '../repositories/inviteeRepository';

const createInviteeService = async (data: InviteeCreate) => {
  return createInviteeInDatabase(data);
};

const getAllInviteesByGiftListSlugService = async (slug: string) => {
  return getAllInviteesByGiftListSlugFromDatabase(slug);
};

export default {
  createInviteeService,
  getAllInviteesByGiftListSlugService,
};