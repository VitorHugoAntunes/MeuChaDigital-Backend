export interface Gift {
  id: string;
  name: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  description?: string;
  photo: string;
  totalValue: number;
  categoryId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GiftCreate {
  name: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  description?: string;
  photo?: string;
  totalValue: number;
  giftListId: string;
  categoryId: string;
}