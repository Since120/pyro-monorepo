// Pfad: apps/api/src/categories/services/category-restore.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CategoryRestoreService {
  constructor(private prisma: PrismaService) {}

  async restoreCategoryInDiscord(catId: string) {
    // (A) load from DB
    const cat = await this.prisma.category.findUnique({ where: { id: catId } });
    if (!cat) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // (B) check if it's actually deletedInDiscord
    if (!cat.deletedInDiscord) {
      throw new HttpException('Category is not marked as deleted.', HttpStatus.BAD_REQUEST);
    }

    // (C) Bot => create new
    try {
      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const response = await axios.post(`${botUrl}/discord/categories`, {
        name: cat.name,
      });
      const { discordChannelId } = response.data;
      if (!discordChannelId) {
        throw new Error('No channelId returned from Bot');
      }

      // (D) DB => update
      const updated = await this.prisma.category.update({
        where: { id: cat.id },
        data: {
          discordCategoryId: discordChannelId,
          deletedInDiscord: false,
        },
      });

      // (E) re-parent existing voice channels
      try {
        const zones = await this.prisma.zone.findMany({
          where: { categoryId: cat.id },
        });

        for (const z of zones) {
          const voiceChannels = await this.prisma.voiceChannel.findMany({
            where: {
              zoneId: z.id,
              deletedInDiscord: false,
              discordChannelId: { not: null },
            },
          });

          for (const vc of voiceChannels) {
            await axios.patch(`${botUrl}/discord/voice-channels/${vc.discordChannelId}`, {
              newCategoryId: discordChannelId,
            });
          }
        }
      } catch (err) {
        console.warn(
          'restoreCategoryInDiscord -> error while re-parenting voice channels:',
          err,
        );
      }

      return updated;
    } catch (err) {
      console.error('restoreCategoryInDiscord -> Bot error:', err);
      throw new HttpException(
        'Bot could not create the Discord category again.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
