// Pfad: apps/api/src/zones/services/zone-bulk-delete.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { VoiceChannelService } from '../voice-channel/voice-channel.service';

@Injectable()
export class ZoneBulkDeleteService {
  private prisma = new PrismaClient();

  constructor(private readonly voiceChannelService: VoiceChannelService) {}

  async deleteManyZones(zoneIds: string[]) {
    // 1) For each zone => remove voice channels
    for (const zId of zoneIds) {
      await this.voiceChannelService.deleteAllByZone(zId);
    }

    // 2) remove all zones
    return this.prisma.zone.deleteMany({
      where: { id: { in: zoneIds } },
    });
  }
}
