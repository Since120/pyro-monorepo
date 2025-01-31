// Pfad: apps/api/src/zones/services/zone-update.service.ts

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ZoneUpdateService {
  private prisma = new PrismaClient();

  async updateZone(zoneId: string, data: {
    zoneKey?: string;
    zoneName?: string;
    minutesRequired?: number;
    pointsGranted?: number;
    categoryId?: string | null;
  }) {
    // 1) DB => update
    const updatedZone = await this.prisma.zone.update({
      where: { id: zoneId },
      data: {
        zoneKey: data.zoneKey,
        zoneName: data.zoneName,
        minutesRequired: data.minutesRequired,
        pointsGranted: data.pointsGranted,
        categoryId: data.categoryId,
      },
    });

    // 2) find new category => get discordCategoryId
    let newDiscordCategoryId: string | null = null;
    if (updatedZone.categoryId) {
      const newCat = await this.prisma.category.findUnique({
        where: { id: updatedZone.categoryId },
      });
      newDiscordCategoryId = newCat?.discordCategoryId || null;
    }

    // 3) get VoiceChannels
    const vcs = await this.prisma.voiceChannel.findMany({
      where: { zoneId: updatedZone.id },
    });

    // 4) rename + re-parent in Discord
    const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
    for (const vc of vcs) {
      if (!vc.discordChannelId) continue;

      const patchPayload: any = {
        newName: updatedZone.zoneName,
      };
      if (newDiscordCategoryId) {
        patchPayload.newCategoryId = newDiscordCategoryId;
      }

      try {
        await axios.patch(`${botUrl}/discord/voice-channels/${vc.discordChannelId}`, patchPayload);
      } catch (err) {
        console.warn(`[ZoneUpdateService] Bot-Patch failed for VC=${vc.id}`, err);
      }
    }

    return updatedZone;
  }
}
