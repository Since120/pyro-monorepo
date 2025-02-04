// apps/api/src/zones/voice-channel/voice-channel.controller.ts

import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Param,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { VoiceChannelService } from './voice-channel.service';

@Controller('voice-channels') // <-- Achtung: Der Prefix /voice-channels
export class VoiceChannelController {
  constructor(private readonly voiceChannelService: VoiceChannelService) {}

  /**
   * PATCH /voice-channels/discord-deleted
   * Body: { discordChannelId: string }
   * => Kennzeichnet einen VoiceChannel als `deletedInDiscord = true`
   */
  @Patch('discord-deleted')
  async markAsDeletedInDiscord(@Body() body: { discordChannelId: string }) {
    if (!body.discordChannelId) {
      throw new HttpException(
        'Missing discordChannelId',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.voiceChannelService.markAsDeletedInDiscord(
      body.discordChannelId,
    );
  }

  /**
   * PATCH /voice-channels/restore/:id
   * => VoiceChannel in Discord neu anlegen + deletedInDiscord=false
   */
  @Patch('restore/:id')
  async restoreInDiscord(@Param('id') vcId: string) {
    if (!vcId) {
      throw new HttpException('Missing voiceChannelId', HttpStatus.BAD_REQUEST);
    }
    try {
      const updated =
        await this.voiceChannelService.restoreVoiceChannelInDiscord(vcId);
      return { ok: true, data: updated };
    } catch (err) {
      console.error('Fehler in restoreInDiscord:', err);
      if (err instanceof HttpException) throw err;
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  /**
   * GET /voice-channels/lookup?discordChannelId=123
   * => Liefert { zoneId: string | null }, damit der Bot weiß, wohin tracken.
   */
  @Get("lookup")
  async lookupZoneId(@Query("discordChannelId") discordId: string) {
    console.log("=> /voice-channels/lookup => discordChannelId=", discordId);
    if (!discordId) {
      throw new BadRequestException("missing discordChannelId");
    }
  
    const vc = await this.voiceChannelService.findByDiscordId(discordId);
    console.log("=> /voice-channels/lookup => result from prisma=", vc);
  
    if (!vc) {
      // kein DB‐Eintrag => wir schicken
      // HTTP 404 zurück oder "zoneId: null"?
      return { zoneId: null }; 
      // Oder `throw new NotFoundException()`
    }
    // Nun kommt das zoneId-Feld:
    console.log("=> VoiceChannel in DB => zoneId=", vc.zoneId);
    return { zoneId: vc.zoneId, categoryId: vc.zone?.categoryId || null };
  }
  
}
