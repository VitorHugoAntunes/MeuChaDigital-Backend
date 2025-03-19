import { InviteeCreate, InviteeUpdate } from '../models/inviteeModel';
import { createInviteeInDatabase, getAllInviteesWithPaginationByGiftListSlugFromDatabase, updateInviteeInDatabase, deleteInviteeInDatabase, getAllInviteesByGiftListSlugFromDatabase } from '../repositories/inviteeRepository';

const createInviteeService = async (data: InviteeCreate) => {
  return createInviteeInDatabase(data);
};

const getAllInviteesWithPaginationByGiftListSlugService = async (slug: string, page: number, limit: number, search: string, status: string) => {
  return getAllInviteesWithPaginationByGiftListSlugFromDatabase(slug, page, limit, search, status);
};

const getAllInviteesByGiftListSlugService = async (slug: string) => {
  return getAllInviteesByGiftListSlugFromDatabase(slug);
}

const updateInviteeService = async (id: string, data: InviteeUpdate) => {
  return updateInviteeInDatabase(id, data);
};

const deleteInviteeService = async (id: string) => {
  return deleteInviteeInDatabase(id);
};

export default {
  createInviteeService,
  getAllInviteesByGiftListSlugService,
  getAllInviteesWithPaginationByGiftListSlugService,
  updateInviteeService,
  deleteInviteeService,
};