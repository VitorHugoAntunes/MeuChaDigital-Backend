-- CreateTable
CREATE TABLE "GiftListSlugHistory" (
    "id" UUID NOT NULL,
    "oldSlug" TEXT NOT NULL,
    "giftListId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GiftListSlugHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GiftListSlugHistory_oldSlug_key" ON "GiftListSlugHistory"("oldSlug");

-- AddForeignKey
ALTER TABLE "GiftListSlugHistory" ADD CONSTRAINT "GiftListSlugHistory_giftListId_fkey" FOREIGN KEY ("giftListId") REFERENCES "GiftList"("id") ON DELETE CASCADE ON UPDATE CASCADE;
