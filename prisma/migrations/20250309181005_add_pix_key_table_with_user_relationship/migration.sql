-- CreateEnum
CREATE TYPE "PixKeyType" AS ENUM ('CPF', 'PHONE', 'EMAIL', 'RANDOM');

-- CreateTable
CREATE TABLE "PixKey" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "type" "PixKeyType" NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PixKey_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PixKey" ADD CONSTRAINT "PixKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
