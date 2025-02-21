// import { GiftList } from './giftListModel';
// import { Contribution } from './contributionModel';

export interface User {
  id: string;
  googleId: string;
  name: string;
  email: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreate {
  googleId: string;
  name: string;
  email: string;
  photo?: string;
}

export interface GuestUserCreate {
  isGuest: boolean;
}

