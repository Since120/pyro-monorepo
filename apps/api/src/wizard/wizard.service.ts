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
  async updateWizardSession(input: {
    userId: string;
    trackingActive?: boolean;
  }) {
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

  async afterTrackingDecision(userId: string) {
    // (A) WizardSession laden
    const session = await this.prisma.wizardSession.findUnique({
      where: { userId },
    });
    if (!session) {
      return {
        scenario: 'NO_SESSION',
        text: 'Keine Wizard-Session gefunden. (Fehler)',
        enableCreate: false,
        enableJoin: false,
      };
    }

    // (B) categoryId check
    if (!session.categoryId) {
      return {
        scenario: 'NO_CATEGORY',
        text: 'Keine Kategorie in der Session hinterlegt.',
        enableCreate: false,
        enableJoin: false,
      };
    }

    // (C) DynamicVoiceChannel check
    const dvc = await this.prisma.dynamicVoiceChannel.findFirst({
      where: {
        categoryId: session.categoryId,
        deletedInDiscord: false,
      },
    });

    const trackingActive = session.trackingActive === true;

    // *** ALLE Scenario-Texte definieren wir HIER (nicht im Bot) ***
    let text = '';
    let enableCreate = true;
    let enableJoin = false;

    if (!dvc) {
      // KEIN DynamicVoiceChannel
      if (trackingActive) {
        // scenario=1
        text =
          'Tracking ist AKTIVIERT, kein Channel vorhanden.\n' +
          'Klicke auf [Voice erstellen], um einen VoiceChannel zu erstellen.';
      } else {
        // scenario=2
        text =
          'Tracking ist DEAKTIVIERT, kein Channel vorhanden.\n' +
          'Trotzdem kannst du einen Kanal erstellen, wenn du willst.';
      }
      enableJoin = false; // weil kein Channel existiert
    } else {
      // ES GIBT schon DynamicVoiceChannel
      if (trackingActive) {
        // scenario=3
        text =
          'Tracking ist AKTIVIERT, und es existiert schon ein VoiceChannel.\n' +
          'Wähle [Voice erstellen] für weiteren Kanal oder [Beitreten], um dem existierenden beizutreten.';
      } else {
        // scenario=4
        text =
          'Tracking ist DEAKTIVIERT, aber es existiert bereits ein VoiceChannel.\n' +
          'Du kannst trotzdem [Voice erstellen] oder [Beitreten].';
      }
      enableJoin = true; // Channel existiert => "beitreten" möglich
    }

    return {
      scenario: 'whatever', // Falls du es brauchst
      text,
      enableCreate,
      enableJoin,
      // Falls du noch die channelId etc. brauchst:
      channelId: dvc?.discordChannelId || null,
    };
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
