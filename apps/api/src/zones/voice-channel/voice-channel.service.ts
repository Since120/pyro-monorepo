// apps/api/src/zones/voice-channel/voice-channel.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

/**
 * Definiere ein eigenes Interface,
 * weil Prisma keinen Typ 'Zone' exportiert.
 * Du brauchst eigentlich nur 2-3 Felder (id, zoneName, categoryId).
 */
export interface MinimalZone {
  id: string;
  zoneName: string;
  categoryId?: string | null;
}

@Injectable()
export class VoiceChannelService {
  private prisma = new PrismaClient();

  /**
   * Erzeugt einen VoiceChannel-Datensatz in der DB
   * und legt einen Channel in Discord an.
   */
  async createInitialVoiceChannelForZone(zone: MinimalZone) {
    // 1) VoiceChannel-Record in DB
    const newVC = await this.prisma.voiceChannel.create({
      data: { zoneId: zone.id },
    });

    // 2) Bot => Channel anlegen
    try {
      // Falls zone.categoryId leer => kein Discord Channel
      if (!zone.categoryId) {
        console.warn(
          '[VoiceChannelService] Keine categoryId => kein Discord-Channel',
        );
        return newVC;
      }

      const cat = await this.prisma.category.findUnique({
        where: { id: zone.categoryId },
      });
      const discordCategoryId = cat?.discordCategoryId || null;
      if (!discordCategoryId) {
        console.warn(
          '[VoiceChannelService] Keine discordCategoryId => kein Discord-Channel',
        );
        return newVC;
      }

      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const resp = await axios.post(`${botUrl}/discord/voice-channels`, {
        channelName: zone.zoneName,
        categoryId: discordCategoryId,
      });
      const { discordChannelId } = resp.data;
      if (discordChannelId) {
        // 3) DB => voiceChannel updaten
        await this.prisma.voiceChannel.update({
          where: { id: newVC.id },
          data: { discordChannelId },
        });
      }

      return newVC;
    } catch (err) {
      console.error('[VoiceChannelService] Bot-Fehler =>', err);
      return newVC;
    }
  }
  async findByDiscordId(discordChannelId: string) {
    console.log("FIND_BY_DISCORD_ID =>", discordChannelId);
    return this.prisma.voiceChannel.findUnique({
      where: { discordChannelId },
      include: {
        zone: true,  // <--- WICHTIG
      },
    });
  }
  /**
   * Löscht alle VoiceChannels für eine Zone:
   * 1) In Discord löschen
   * 2) DB-Einträge entfernen
   */
  async deleteAllByZone(zoneId: string) {
    const voiceChannels = await this.prisma.voiceChannel.findMany({
      where: { zoneId },
    });

    for (const vc of voiceChannels) {
      if (vc.discordChannelId) {
        const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
        try {
          await axios.delete(
            `${botUrl}/discord/voice-channels/${vc.discordChannelId}`,
          );
        } catch (err) {
          console.warn(
            `[VoiceChannelService] Konnte VC in Discord nicht löschen: ${vc.discordChannelId}`,
            err,
          );
        }
      }
      // DB => remove
      await this.prisma.voiceChannel.delete({ where: { id: vc.id } });
    }

    return voiceChannels.length;
  }

  /**
   * Markiert einen VoiceChannel als 'deletedInDiscord = true',
   * wenn der Bot meldet, dass der Kanal in Discord manuell gelöscht wurde.
   */
  async markAsDeletedInDiscord(discordChannelId: string) {
    // 1) passender Datensatz
    const vc = await this.prisma.voiceChannel.findUnique({
      where: { discordChannelId },
    });
    if (!vc) {
      throw new HttpException(
        `VoiceChannel not found for discordChannelId=${discordChannelId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    // 2) DB => updated
    return this.prisma.voiceChannel.update({
      where: { id: vc.id },
      data: { deletedInDiscord: true },
    });
  }

  /**
   * Stellt einen VoiceChannel wieder her:
   * 1) Prüfen, ob er wirklich deletedInDiscord = true
   * 2) Neuen Kanal in Discord anlegen
   * 3) DB => discordChannelId updaten + deletedInDiscord = false
   */
  async restoreVoiceChannelInDiscord(voiceChannelId: string) {
    const vc = await this.prisma.voiceChannel.findUnique({
      where: { id: voiceChannelId },
    });
    if (!vc) {
      throw new HttpException(
        `VoiceChannel not found for ID=${voiceChannelId}`,
        HttpStatus.NOT_FOUND,
      );
    }
    if (!vc.deletedInDiscord) {
      throw new HttpException(
        'VoiceChannel ist gar nicht als gelöscht markiert.',
        HttpStatus.BAD_REQUEST,
      );
    }
    // Falls zone fehlt => kein Channel
    if (!vc.zoneId) {
      throw new HttpException(
        'VoiceChannel hat keine zoneId => kann nicht wiederhergestellt werden.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // (A) Zone laden => Name + categoryId
    const zone = await this.prisma.zone.findUnique({
      where: { id: vc.zoneId },
    });
    if (!zone) {
      throw new HttpException(
        `Zone not found for ID=${vc.zoneId}`,
        HttpStatus.NOT_FOUND,
      );
    }

    // (B) Bot => Neuen VoiceChannel anlegen
    //     (im Category-Workflow war es "axios.post(...)" => channelName, categoryId
    try {
      const cat = await this.prisma.category.findUnique({
        where: { id: zone.categoryId || '' },
      });
      const discordCategoryId = cat?.discordCategoryId;
      if (!discordCategoryId) {
        throw new Error(
          'Keine discordCategoryId gefunden => kann nicht wiederherstellen',
        );
      }

      const botUrl = process.env.BOT_SERVICE_URL || 'http://localhost:3002';
      const resp = await axios.post(`${botUrl}/discord/voice-channels`, {
        channelName: zone.zoneName, // z.B. zoneName
        categoryId: discordCategoryId,
      });
      const newDiscordChannelId = resp.data.discordChannelId;
      if (!newDiscordChannelId) {
        throw new Error('No discordChannelId returned from Bot');
      }

      // (C) DB => voiceChannel aktualisieren => ID neu setzen, deletedInDiscord=false
      const updated = await this.prisma.voiceChannel.update({
        where: { id: vc.id },
        data: {
          discordChannelId: newDiscordChannelId,
          deletedInDiscord: false,
        },
      });
      return updated;
    } catch (err) {
      console.error('Bot-Fehler beim Wiederherstellen =>', err);
      throw new HttpException(
        'Bot konnte den VoiceChannel nicht neu anlegen.',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }
}
