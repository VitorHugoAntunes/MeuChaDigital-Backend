export interface InviteeCreate {
  name: string;
  phone: string;
  email: string;
  giftListId: string;
  status: "ACCEPTED" | "REJECTED";
}