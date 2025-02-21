/*
  Warnings:

  - A unique constraint covering the columns `[photoId]` on the table `Gift` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[photoId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Image" ADD COLUMN     "userId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "Gift_photoId_key" ON "Gift"("photoId");

-- CreateIndex
CREATE UNIQUE INDEX "User_photoId_key" ON "User"("photoId");
