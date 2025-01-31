/*
  Warnings:

  - You are about to drop the column `channelId` on the `DynamicVoiceChannel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[discordChannelId]` on the table `DynamicVoiceChannel` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `discordChannelId` to the `DynamicVoiceChannel` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DynamicVoiceChannel_channelId_key";

-- AlterTable
ALTER TABLE "DynamicVoiceChannel" DROP COLUMN "channelId",
ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "discordChannelId" TEXT NOT NULL,
ADD COLUMN     "discordRoleId" TEXT;

-- AlterTable
ALTER TABLE "SetupChannels" ADD COLUMN     "embedMessageId" TEXT,
ADD COLUMN     "setupRoleId" TEXT,
ALTER COLUMN "textChannelId" DROP NOT NULL,
ALTER COLUMN "voiceChannelId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "DynamicVoiceChannel_discordChannelId_key" ON "DynamicVoiceChannel"("discordChannelId");

-- AddForeignKey
ALTER TABLE "SetupChannels" ADD CONSTRAINT "SetupChannels_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
