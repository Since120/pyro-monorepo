// Pfad: apps/api/src/zones/services/zone-delete.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { VoiceChannelService } from '../voice-channel/voice-channel.service';

@Injectable()
export class ZoneDeleteService {
  private prisma = new PrismaClient();

  constructor(private readonly voiceChannelService: VoiceChannelService) {}

  async deleteZone(zoneId: string) {
    // 1) remove VoiceChannels
    await this.voiceChannelService.deleteAllByZone(zoneId);

    // 2) remove Zone
    return this.prisma.zone.delete({
      where: { id: zoneId },
    });
  }
}
