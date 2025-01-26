/*
  Warnings:

  - You are about to drop the column `discordCategoryId` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "discordCategoryId",
ADD COLUMN     "discordChannelId" TEXT;
