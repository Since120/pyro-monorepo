/*
  Warnings:

  - You are about to drop the column `zoneKey` on the `DynamicVoiceChannel` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DynamicVoiceChannel" DROP COLUMN "zoneKey",
ADD COLUMN     "customName" TEXT,
ADD COLUMN     "deletedInDiscord" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxUsers" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "zoneId" TEXT;

-- AddForeignKey
ALTER TABLE "DynamicVoiceChannel" ADD CONSTRAINT "DynamicVoiceChannel_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "Zone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DynamicVoiceChannel" ADD CONSTRAINT "DynamicVoiceChannel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
