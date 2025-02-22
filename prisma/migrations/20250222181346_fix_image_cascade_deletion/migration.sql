/*
  Warnings:

  - A unique constraint covering the columns `[bannerForGiftListId]` on the table `Image` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "GiftList" DROP CONSTRAINT "GiftList_bannerId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Image_bannerForGiftListId_key" ON "Image"("bannerForGiftListId");

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_bannerForGiftListId_fkey" FOREIGN KEY ("bannerForGiftListId") REFERENCES "GiftList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
