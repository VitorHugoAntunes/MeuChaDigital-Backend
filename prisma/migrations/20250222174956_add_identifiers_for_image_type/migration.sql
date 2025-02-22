/*
  Warnings:

  - You are about to drop the column `giftListId` on the `Image` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_giftListId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "giftListId",
ADD COLUMN     "bannerForGiftListId" UUID,
ADD COLUMN     "momentsForGiftListId" UUID;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_momentsForGiftListId_fkey" FOREIGN KEY ("momentsForGiftListId") REFERENCES "GiftList"("id") ON DELETE SET NULL ON UPDATE CASCADE;
