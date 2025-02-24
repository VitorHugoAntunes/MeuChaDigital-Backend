/*
  Warnings:

  - You are about to drop the column `giftId` on the `Gift` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Gift_giftId_key";

-- AlterTable
ALTER TABLE "Gift" DROP COLUMN "giftId";
