/*
  Warnings:

  - A unique constraint covering the columns `[giftId]` on the table `Gift` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Gift" DROP CONSTRAINT "Gift_photoId_fkey";

-- DropForeignKey
ALTER TABLE "GiftList" DROP CONSTRAINT "GiftList_bannerId_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_momentsForGiftListId_fkey";

-- DropForeignKey
ALTER TABLE "Invitee" DROP CONSTRAINT "Invitee_giftListId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_photoId_fkey";

-- AlterTable
ALTER TABLE "Gift" ADD COLUMN     "giftId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Gift_giftId_key" ON "Gift"("giftId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GiftList" ADD CONSTRAINT "GiftList_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_momentsForGiftListId_fkey" FOREIGN KEY ("momentsForGiftListId") REFERENCES "GiftList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invitee" ADD CONSTRAINT "Invitee_giftListId_fkey" FOREIGN KEY ("giftListId") REFERENCES "GiftList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
