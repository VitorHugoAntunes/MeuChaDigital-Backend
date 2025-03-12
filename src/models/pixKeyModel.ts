import { PixKeyType } from "@prisma/client"

export interface PixKeyCreate {
  key: string;
  type: PixKeyType;
  userId: string;
}

export interface PixKeyInsertData extends PixKeyCreate {
  iv: string;
}

export interface PixKeyUpdate {
  key?: string;
  type?: PixKeyType;
}