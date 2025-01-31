// Pfad: apps/api/src/wizard/wizard.service.ts


import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WizardService {
  constructor(private prisma: PrismaService) {}

  // Start => legt WizardSession an
  async startWizard(userId: string, categoryId?: string) {
    return this.prisma.wizardSession.upsert({
      where: { userId },
      update: { categoryId: categoryId || null },
      create: {
        userId,
        categoryId: categoryId || null,
      },
    });
  }

  // updateWizardSession => Set trackingActive + Upsert in userGlobalStats
  async updateWizardSession(input: { userId: string; trackingActive?: boolean }) {
    const { userId, trackingActive } = input;

    // (A) WizardSession trackingActive
    const updated = await this.prisma.wizardSession.update({
      where: { userId },
      data: { trackingActive },
    });

    // (B) Falls trackingActive vorhanden => userGlobalStats.isTracked
    if (trackingActive !== undefined) {
      await this.prisma.userGlobalStats.upsert({
        where: { userId },
        update: { isTracked: trackingActive },
        create: { userId, isTracked: trackingActive },
      });
    }

    return updated;
  }

  // finish => WizardSession löschen
  async finishWizard(userId: string) {
    await this.prisma.wizardSession.delete({ where: { userId } });
    return { ok: true, message: `Wizard finished for user=${userId}` };
  }

  // Optional: Debug
  async getWizardSessionByUser(userId: string) {
    return this.prisma.wizardSession.findUnique({ where: { userId } });
  }
}
