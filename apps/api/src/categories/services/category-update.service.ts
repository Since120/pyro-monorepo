// Pfad: apps/api/src/categories/services/category-update.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../../prisma/prisma.service';
import { SetupService } from '../../setup/setup.service';

@Injectable()
export class CategoryUpdateService {
  constructor(
    private prisma: PrismaService,
    private setupService: SetupService,
  ) {}

  async updateCategory(
    catId: string,
    data: Partial<{
      name: string;
      categoryType: string;
      isVisible: boolean;
      allowedRoles: string[];
      trackingActive: boolean;
      sendSetup: boolean;
    }>,
  ) {
    // (A) load old data
    const oldCat = await this.prisma.category.findUnique({
      where: { id: catId },
    });
    if (!oldCat) {
      throw new HttpException(
        'Category not found (oldCat)',
        HttpStatus.NOT_FOUND,
      );
    }
    const wasSetup = oldCat.sendSetup === true;

    // (B) DB => update
    const updated = await this.prisma.category.update({
      where: { id: catId },
      data,
    });
    const isNowSetup = updated.sendSetup === true;

    // (C) If name changed => rename in Discord
    if (data.name) {
      try {
        if (!updated.discordCategoryId) {
          console.warn(
            `updateCategory: Category ${catId} has no discordCategoryId => skip rename`,
          );
        } else {
          const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
          await axios.patch(`${botUrl}/discord/categories`, {
            id: updated.discordCategoryId,
            newName: data.name,
            isVisible: data.isVisible,
            allowedRoles: data.allowedRoles,
          });
        }
      } catch (err) {
        console.error('Error while updating Discord category:', err);
        throw new HttpException(
          'Bot could not rename the Discord category.',
          HttpStatus.BAD_GATEWAY,
        );
      }
    }

    // (C2) Falls isVisible (oder allowedRoles) geändert => Setup-Textkanal aktualisieren
    if (data.isVisible !== undefined || data.allowedRoles !== undefined) {
      // 1) SetupChannel in DB suchen
      const setupEntry = await this.prisma.setupChannels.findFirst({
        where: { categoryId: catId },
      });
      if (setupEntry?.textChannelId) {
        const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
        try {
          // 2) PATCH /discord/text-channels/<textChannelId>
          await axios.patch(`${botUrl}/discord/text-channels/${setupEntry.textChannelId}`, {
            isVisible: data.isVisible ?? oldCat.isVisible,  // Fallback auf alten Wert, falls nur allowedRoles kamen
            allowedRoles: data.allowedRoles ?? oldCat.allowedRoles,
          });
        } catch (err) {
          console.warn('Fehler beim Patchen des Setup-TextChannels:', err);
        }
      }
    }

    // (D) Setup toggle logic
    // 1) false -> true
    if (!wasSetup && isNowSetup) {
      await this.removeZoneVoiceChannelsWithoutSettingDeleted(catId);
      // Activate Setup
      try {
        const apiUrl = process.env.API_URL || 'http://localhost:3004';
        await axios.post(`${apiUrl}/setup/activate`, { categoryId: catId });
      } catch (err) {
        console.error('Error calling /setup/activate:', err);
      }
    }

    // 2) true -> false
    if (wasSetup && !isNowSetup) {
      // remove setup-channels
      await this.setupService.deactivateSetup(catId);
      // restore zone-voice-channels
      await this.restoreZoneVoiceChannels(catId);
    }

    return updated;
  }

  /**
   * Deletes all zone voice channels in Discord (but sets `discordChannelId=null` in DB, not deletedInDiscord).
   */
  private async removeZoneVoiceChannelsWithoutSettingDeleted(
    categoryId: string,
  ) {
    const zones = await this.prisma.zone.findMany({
      where: { categoryId },
      include: { voiceChannels: true },
    });

    const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
    for (const z of zones) {
      for (const vc of z.voiceChannels) {
        if (!vc.discordChannelId) continue; // already null => skip
        // A) remove in Discord
        try {
          await axios.delete(
            `${botUrl}/discord/voice-channels/${vc.discordChannelId}`,
          );
        } catch (err) {
          console.warn('Error removing VC (Setup-Switch):', err);
        }
        // B) DB => set discordChannelId=null
        await this.prisma.voiceChannel.update({
          where: { id: vc.id },
          data: { discordChannelId: null },
        });
      }
    }
  }

  /**
   * Recreates voice channels for all zones that have `discordChannelId=null` & `deletedInDiscord=false`.
   */
  private async restoreZoneVoiceChannels(categoryId: string) {
    const zones = await this.prisma.zone.findMany({
      where: { categoryId },
      include: { voiceChannels: true },
    });
    for (const z of zones) {
      for (const vc of z.voiceChannels) {
        if (!vc.discordChannelId && !vc.deletedInDiscord) {
          await this.recreateOneVoiceChannel(vc);
        }
      }
    }
  }

  /**
   * Creates ONE voice channel in Discord, updates DB => discordChannelId
   */
  private async recreateOneVoiceChannel(vc: {
    id: string;
    zoneId: string | null;
  }) {
    if (!vc.zoneId) return;

    const zone = await this.prisma.zone.findUnique({
      where: { id: vc.zoneId },
      include: { category: true },
    });
    if (!zone?.category?.discordCategoryId) return;

    const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
    try {
      const resp = await axios.post(`${botUrl}/discord/voice-channels`, {
        channelName: zone.zoneName,
        categoryId: zone.category.discordCategoryId,
      });
      const newId = resp.data.discordChannelId;

      if (newId) {
        await this.prisma.voiceChannel.update({
          where: { id: vc.id },
          data: { discordChannelId: newId },
        });
      }
    } catch (err) {
      console.warn('Error in recreateOneVoiceChannel:', err);
    }
  }
}
