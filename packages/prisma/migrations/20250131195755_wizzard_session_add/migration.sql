-- CreateTable
CREATE TABLE "WizardSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT,
    "stepIndex" INTEGER NOT NULL DEFAULT 0,
    "trackingActive" BOOLEAN,
    "channelName" TEXT,
    "chosenZoneId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WizardSession_pkey" PRIMARY KEY ("id")
);
