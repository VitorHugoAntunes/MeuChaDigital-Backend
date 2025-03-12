/*
  Warnings:

  - Added the required column `iv` to the `PixKey` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PixKey" ADD COLUMN     "iv" TEXT NOT NULL;
