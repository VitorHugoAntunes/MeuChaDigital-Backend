/*
  Warnings:

  - Added the required column `payerId` to the `Charge` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Charge" ADD COLUMN     "payerId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "Charge" ADD CONSTRAINT "Charge_payerId_fkey" FOREIGN KEY ("payerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
