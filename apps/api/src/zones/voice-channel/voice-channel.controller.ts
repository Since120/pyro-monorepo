// apps/api/src/zones/voice-channel/voice-channel.controller.ts

import { Body, Controller, HttpException, HttpStatus, Patch, Param  } from '@nestjs/common';
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
      throw new HttpException('Missing discordChannelId', HttpStatus.BAD_REQUEST);
    }
    return this.voiceChannelService.markAsDeletedInDiscord(body.discordChannelId);
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
      const updated = await this.voiceChannelService.restoreVoiceChannelInDiscord(vcId);
      return { ok: true, data: updated };
    } catch (err) {
      console.error('Fehler in restoreInDiscord:', err);
      if (err instanceof HttpException) throw err;
      throw new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
