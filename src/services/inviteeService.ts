import { InviteeCreate } from '../models/inviteeModel';
import { createInviteeInDatabase } from '../repositories/inviteeRepository';

const createInviteeService = async (data: InviteeCreate) => {
  return createInviteeInDatabase(data);
};

export default {
  createInviteeService,
};