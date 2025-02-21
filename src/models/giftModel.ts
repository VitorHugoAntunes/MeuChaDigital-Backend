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
  photo: string;
  totalValue: number;
  giftListId: string;
  categoryId: string;
}

export interface GiftList {
  id: string;
  name: string;
  slug: string;
  type: "WEDDING" | "BIRTHDAY" | "BABY_SHOWER";
  description?: string;
  banner?: string;
  moments_images?: string[];
  shareableLink?: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: Date;
  updatedAt: Date;
  gifts: Gift[];
}

export interface GiftListCreate {
  name: string;
  slug: string;
  type: "WEDDING" | "BIRTHDAY" | "BABY_SHOWER";
  description?: string;
  banner?: string;
  moments_images?: string[];
  shareableLink?: string;
  userId: string;
  status: "ACTIVE" | "INACTIVE";
  gifts: GiftCreate[];
}