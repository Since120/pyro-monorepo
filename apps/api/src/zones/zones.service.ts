// apps/api/src/zones/zones.service.ts

import { Injectable, HttpException, HttpStatus } from '@nestjs/common'; // NEU: HttpException import
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ZonesService {
  private prisma = new PrismaClient();

  // Alle Zonen + Category
  findAll() {
    return this.prisma.zone.findMany({
      include: {
        category: true,
      },
    });
  }

  // NEU: Category-Check beim Erstellen
  async createZone(data: {
    zoneKey: string;
    zoneName: string;
    minutesRequired?: number;
    pointsGranted?: number;
    categoryId?: string | null;
  }) {
    // 1) Falls categoryId übergeben wurde, check Category exist
    if (data.categoryId) {
      const cat = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!cat) {
        // => API-Fehler => 400
        throw new HttpException(
          'Kann Zone nicht erstellen, da Category nicht existiert.',
          HttpStatus.BAD_REQUEST
        );
      }
    }

    // 2) Zone anlegen
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

  // Update einer Zone
  async updateZone(
    zoneId: string,
    data: Partial<{
      zoneKey: string;
      zoneName: string;
      minutesRequired: number;
      pointsGranted: number;
      categoryId?: string | null;
    }>
  ) {
    // Optional: Auch hier checken, ob categoryId existiert
    if (data.categoryId) {
      const cat = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!cat) {
        throw new HttpException(
          'Kann Zone nicht updaten, da Category nicht existiert.',
          HttpStatus.BAD_REQUEST
        );
      }
    }

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
