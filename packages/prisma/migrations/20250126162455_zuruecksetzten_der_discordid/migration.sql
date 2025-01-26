/*
  Warnings:

  - You are about to drop the column `discordChannelId` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "discordChannelId",
ADD COLUMN     "discordCategoryId" TEXT;
