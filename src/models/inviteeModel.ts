export interface InviteeCreate {
  name: string;
  phone: string;
  email: string;
  additionalInvitees: number;
  observation: string;
  giftListId: string;
  status: "ACCEPTED" | "REJECTED";
}

export interface InviteeUpdate {
  name?: string;
  phone?: string;
  email?: string;
  additionalInvitees?: number;
  observation?: string;
  status?: "ACCEPTED" | "REJECTED";
}