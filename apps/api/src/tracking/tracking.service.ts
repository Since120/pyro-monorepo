// apps/api/src/tracking/tracking.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  /**
   * Wenn ein User in einen VoiceChannel joint,
   *  => Wir prüfen: Zu welcher Zone gehört der Channel?
   *  => Hat user mind. 1 Rolle, die in category.allowedRoles enthalten ist?
   *  => Dann legen wir (falls nicht existiert) ein userZoneStats an
   *     oder setzen lastJoinTimestamp neu.
   */
  async userJoinedZone(params: {
    userId: string;
    zoneId: string;
    userRoles: string[];  // z.B. ["1234567890", "9876543210", ...]
  }) {
    const { userId, zoneId, userRoles } = params;

    // 1) Zone + Category laden
    const zone = await this.prisma.zone.findUnique({
      where: { id: zoneId },
      include: {
        category: true, // => hat .allowedRoles
      },
    });
    if (!zone || !zone.category) {
      // Kein passender Datensatz => abbrechen
      return;
    }

    const allowedRoles = zone.category.allowedRoles || [];
    // Schnittmenge
    const hasIntersection = allowedRoles.some((r) => userRoles.includes(r));
    if (!hasIntersection) {
      // => user hat KEINE Rolle, die getrackt wird => NICHTS tun
      return;
    }

    // => user wird getrackt
    // 2) UserZoneStats finden/erstellen
    let stats = await this.prisma.userZoneStats.findFirst({
      where: { userId, zoneId },
    });
    if (!stats) {
      // neu anlegen
      stats = await this.prisma.userZoneStats.create({
        data: {
          userId,
          zoneId,
          zoneKey: zone.zoneKey, // alt: Bot nutzt zoneKey
          totalSecondsInZone: 0,
          leftoverSeconds: 0,
          pointsInThisZone: 0,
          lastJoinTimestamp: new Date(),  // jetzt joined
        },
      });
    } else {
      // existiert => lastJoinTimestamp aktualisieren
      // => user „joint“ erneut => evtl. war leftJoinTimestamp = null
      await this.prisma.userZoneStats.update({
        where: { id: stats.id },
        data: {
          lastJoinTimestamp: new Date(),
        },
      });
    }
  }

  /**
   * Wenn ein User den VoiceChannel verlässt
   * => Zeitdifferenz = now - lastJoinTimestamp
   * => leftoverSeconds + ...
   * => Speichern in DB
   */
  async userLeftZone(params: {
    userId: string;
    zoneId: string;
  }) {
    const { userId, zoneId } = params;

    // 1) Stats finden
    const stats = await this.prisma.userZoneStats.findFirst({
      where: { userId, zoneId },
    });
    if (!stats || !stats.lastJoinTimestamp) {
      // Keine laufende Session => Nichts tun
      return;
    }

    const now = new Date();
    const deltaSeconds = Math.floor((now.getTime() - stats.lastJoinTimestamp.getTime()) / 1000);

    // 2) Summieren
    const updatedTotal = stats.totalSecondsInZone + deltaSeconds;
    const updatedLeftover = stats.leftoverSeconds + deltaSeconds;

    // => Vorläufig: Wir speichern leftoverSeconds, updaten totalSecondsInZone
    await this.prisma.userZoneStats.update({
      where: { id: stats.id },
      data: {
        totalSecondsInZone: updatedTotal,
        leftoverSeconds: updatedLeftover,
        pointsInThisZone: stats.pointsInThisZone,  // Noch kein Punktemechanismus
        lastJoinTimestamp: null,                  // session beendet
        lastUsage: now,
      },
    });
  }
}
