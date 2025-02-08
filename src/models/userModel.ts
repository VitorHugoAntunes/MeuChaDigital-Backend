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
  // lista: GiftList[];
  // contributions: Contribution[];
}

export interface UserCreate {
  googleId: string;
  name: string;
  email: string;
  photo?: string;
}
