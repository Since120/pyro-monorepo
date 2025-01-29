// apps/api/src/zones/zones.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { VoiceChannelService } from './voice-channel/voice-channel.service';

@Injectable()
export class ZonesService {
  private prisma = new PrismaClient();

  constructor(
    private readonly voiceChannelService: VoiceChannelService,
  ) {}

  // 1) Alle Zonen
  findAll() {
      return this.prisma.zone.findMany({
          include: {
            category: true,
            voiceChannels: true,  // NEU: Damit wir pro Zone die VoiceChannel-Records bekommen
          },
        });
  }

  // 2) CREATE ZONE
  async createZone(data: {
    zoneKey: string;
    zoneName: string;
    minutesRequired?: number;
    pointsGranted?: number;
    categoryId?: string | null;
  }) {
    // (A) Category prüfen
    if (data.categoryId) {
      const cat = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!cat) {
        throw new HttpException('Category not exist', HttpStatus.BAD_REQUEST);
      }
    }

    // (B) DB => neue Zone
    const newZone = await this.prisma.zone.create({
      data: {
        zoneKey: data.zoneKey,
        zoneName: data.zoneName,
        minutesRequired: data.minutesRequired ?? 60,
        pointsGranted: data.pointsGranted ?? 1,
        categoryId: data.categoryId || null,
      },
    });

    // (C) VoiceChannel anlegen (DB + Bot)
    await this.voiceChannelService.createInitialVoiceChannelForZone(newZone);

    return newZone;
  } // <<-- Achte hier auf die schließende Klammer der createZone-Methode!

  // 3) UPDATE ZONE
  async updateZone(zoneId: string, data: {
    zoneKey?: string;
    zoneName?: string;
    minutesRequired?: number;
    pointsGranted?: number;
    categoryId?: string | null;
  }) {
    // 1) Zone updaten in DB
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

    // 2) Neue Category laden
    let newDiscordCategoryId: string | null = null;
    if (updatedZone.categoryId) {
      const newCat = await this.prisma.category.findUnique({
        where: { id: updatedZone.categoryId },
      });
      newDiscordCategoryId = newCat?.discordCategoryId || null;
    }

    // 3) VoiceChannels laden
    const vcs = await this.prisma.voiceChannel.findMany({
      where: { zoneId: updatedZone.id },
    });

    // 4) Bot-Call => rename + re-parent
    const botUrl = process.env.BOT_SERVICE_URL || "http://localhost:3002";
    for (const vc of vcs) {
      if (!vc.discordChannelId) continue; // Kein Discord-Kanal hinterlegt

      const patchPayload: any = {
        newName: updatedZone.zoneName,
      };
      if (newDiscordCategoryId) {
        patchPayload.newCategoryId = newDiscordCategoryId;
      }

      try {
        await axios.patch(
          `${botUrl}/discord/voice-channels/${vc.discordChannelId}`,
          patchPayload
        );
      } catch (err) {
        console.warn(`[ZonesService] Bot-Patch fehlgeschlagen für VC=${vc.id}`, err);
      }
    }

    return updatedZone;
  }

  // 4) DELETE ZONE
  async deleteZone(zoneId: string) {
    // 1) VoiceChannels löschen (Bot + DB)
    await this.voiceChannelService.deleteAllByZone(zoneId);

    // 2) Zone selbst löschen
    return this.prisma.zone.delete({
      where: { id: zoneId },
    });
  }

  // 5) BULK DELETE
  async deleteManyZones(zoneIds: string[]) {
    // 1) Für jede Zone => VoiceChannels löschen
    for (const zId of zoneIds) {
      await this.voiceChannelService.deleteAllByZone(zId);
    }

    // 2) Danach Zonen entfernen
    return this.prisma.zone.deleteMany({
      where: { id: { in: zoneIds } },
    });
  }
}
