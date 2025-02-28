import { Gift, GiftCreate } from "./giftModel";

export interface GiftList {
  id: string;
  name: string;
  slug: string;
  type: "WEDDING" | "BIRTHDAY" | "BABY_SHOWER";
  eventDate: string;
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
  eventDate: string;
  description?: string;
  banner?: string;
  moments_images?: string[];
  userId: string;
  status: "ACTIVE" | "INACTIVE";
  gifts: GiftCreate[];
}
export interface GiftListUpdate {
  name?: string;
  slug?: string;
  type?: "WEDDING" | "BIRTHDAY" | "BABY_SHOWER";
  eventDate?: string;
  description?: string;
  banner?: string;
  moments_images?: string[];
  shareableLink?: string;
  userId?: string;
  status?: "ACTIVE" | "INACTIVE";
}
