-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "sendSetup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "trackingActive" BOOLEAN NOT NULL DEFAULT false;
