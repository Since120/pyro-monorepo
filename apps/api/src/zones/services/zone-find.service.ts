// Pfad: apps/api/src/zones/services/zone-find.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ZoneFindService {
  private prisma = new PrismaClient();

  async findAll() {
    // Aus deinem alten findAll() kopiert
    return this.prisma.zone.findMany({
      include: {
        category: true,
        voiceChannels: true,
      },
    });
  }
}
