export interface Gift {
  id: string;
  name: string;
  description?: string;
  photo: string;
  totalValue: number;
  giftShares: number;
  valuePerShare: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftCreate {
  name: string;
  description?: string;
  photo: string;
  totalValue: number;
  giftShares: number;
  valuePerShare: number;
  giftListId: string;
  categoryId: string;
}

export interface GiftList {
  id: string;
  name: string;
  description?: string;
  banner?: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
  gifts: Gift[];
}

export interface GiftListCreate {
  name: string;
  description?: string;
  banner?: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE";
  gifts: GiftCreate[];
}