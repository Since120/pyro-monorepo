import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ZonesService {
  private prisma = new PrismaClient();

  findAll() {
    return this.prisma.zone.findMany({
      include: {
        category: true, // damit wir categoryName etc. abrufen können
      },
    });
  }

  createZone(data: {
    zoneKey: string;
    zoneName: string;
    minutesRequired?: number;
    pointsGranted?: number;
    categoryId?: string | null;
  }) {
    return this.prisma.zone.create({
      data: {
        zoneKey: data.zoneKey,
        zoneName: data.zoneName,
        minutesRequired: data.minutesRequired ?? 60,
        pointsGranted: data.pointsGranted ?? 1,
        categoryId: data.categoryId || null,
      },
    });
  }

  updateZone(zoneId: string, data: Partial<{
    zoneKey: string;
    zoneName: string;
    minutesRequired: number;
    pointsGranted: number;
    categoryId?: string | null;
  }>) {
    return this.prisma.zone.update({
      where: { id: zoneId },
      data: {
        ...data,
      },
    });
  }

  deleteZone(zoneId: string) {
    return this.prisma.zone.delete({
      where: { id: zoneId },
    });
  }

  async deleteManyZones(zoneIds: string[]) {
    return this.prisma.zone.deleteMany({
      where: { id: { in: zoneIds } },
    });
  }

}
