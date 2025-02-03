// apps/api/src/zones/services/zone-find.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ZoneFindService {
  private prisma = new PrismaClient();

  async findAll(categoryId?: string) {
    // Wenn categoryId existiert => nur Zonen dieser Category
    const whereClause = categoryId
      ? { categoryId, deletedInDiscord: false }
      : { deletedInDiscord: false };

    return this.prisma.zone.findMany({
      where: whereClause,
      include: {
        category: true,
        voiceChannels: true,
      },
    });
  }
}
