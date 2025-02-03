// Pfad: apps/api/src/zones/services/zone-create.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

@Injectable()
export class ZoneCreateService {
  private prisma = new PrismaClient();

  async createZone(data: {
    zoneKey: string;
    zoneName: string;
    minutesRequired?: number;
    pointsGranted?: number;
    categoryId?: string | null;
  }) {
    // 1) Check Category
    if (data.categoryId) {
      const cat = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!cat) {
        throw new HttpException(
          'Category does not exist',
          HttpStatus.BAD_REQUEST,
        );
      }

      // If Category is in Setup Mode => skip Discord creation
      if (cat.sendSetup) {
        console.warn(
          `[ZoneCreateService] Category ${cat.id} is in Setup mode => skipping VoiceChannel creation.`,
        );
      }
    }

    // 2) DB => create new Zone
    const newZone = await this.prisma.zone.create({
      data: {
        zoneKey: data.zoneKey,
        zoneName: data.zoneName,
        minutesRequired: data.minutesRequired ?? 60,
        pointsGranted: data.pointsGranted ?? 1,
        categoryId: data.categoryId || null,
      },
    });

    // 3) Always create a VoiceChannel record in DB (discordChannelId = null)
    const newVC = await this.prisma.voiceChannel.create({
      data: {
        zoneId: newZone.id,
      },
    });

    // 4) If category exists AND sendSetup=false => create channel in Discord
    if (data.categoryId) {
      const cat = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (cat && !cat.sendSetup) {
        // => create in Discord
        const createdId = await this.createDiscordVoiceChannel(
          newZone,
          newVC.id,
        );
        if (createdId) {
          // update DB => set discordChannelId
          await this.prisma.voiceChannel.update({
            where: { id: newVC.id },
            data: { discordChannelId: createdId },
          });
        }
      }
    }

    return newZone;
  }

  /**
   * Helper function to create a VoiceChannel in Discord, returns the discordChannelId or null.
   */
  private async createDiscordVoiceChannel(
    zone: {
      id: string;
      zoneKey: string;
      zoneName: string;
      categoryId: string | null;
    },
    voiceChannelId: string,
  ): Promise<string | null> {
    if (!zone.categoryId) return null;

    const cat = await this.prisma.category.findUnique({
      where: { id: zone.categoryId },
    });
    if (!cat?.discordCategoryId) return null;

    const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';

    try {
      const resp = await axios.post(`${botUrl}/discord/voice-channels`, {
        channelName: zone.zoneName,
        categoryId: cat.discordCategoryId,
      });
      return resp.data.discordChannelId || null;
    } catch (err) {
      console.warn(
        '[ZoneCreateService] createDiscordVoiceChannel -> Error:',
        err,
      );
      return null;
    }
  }
}
