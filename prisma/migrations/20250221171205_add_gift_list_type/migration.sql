/*
  Warnings:

  - Added the required column `type` to the `GiftList` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GiftListType" AS ENUM ('BIRTHDAY', 'WEDDING', 'BABY_SHOWER');

-- AlterTable
ALTER TABLE "GiftList" ADD COLUMN     "type" "GiftListType" NOT NULL;
