// Pfad: apps/api/src/tracking/tracking.service.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Falls vorhanden, für Typsicherheit:
import { UserZoneStats, Zone } from '@prisma/client';

@Injectable()
export class TrackingService {
  constructor(private prisma: PrismaService) {}

  /**
   * User joint eine Zone
   */
  async userJoinedZone(params: {
    userId: string;
    zoneId: string;
    userRoles: string[]; // z.B. ["1234567890", "9876543210", ...]
  }) {
    const { userId, zoneId, userRoles } = params;

    // (A) Prüfen, ob userGlobalStats.isTracked = true
    const userGlob = await this.prisma.userGlobalStats.findUnique({
      where: { userId },
    });
    if (!userGlob || !userGlob.isTracked) {
      // => user hat globales Tracking deaktiviert => Abbrechen
      return;
    }

    // (B) Zone + Category laden
    const zone = await this.prisma.zone.findUnique({
      where: { id: zoneId },
      include: {
        category: true, // => hat .allowedRoles
      },
    });
    if (!zone || !zone.category) {
      // Keine passende Zone oder Category => Abbruch
      return;
    }

    const allowedRoles = zone.category.allowedRoles || [];
    // Schnittmenge => Hat user mind. 1 der allowedRoles?
    const hasIntersection = allowedRoles.some((r) => userRoles.includes(r));
    if (!hasIntersection) {
      // => user hat KEINE Rolle, die getrackt wird => NICHTS tun
      return;
    }

    // => user wird getrackt
    // (C) userZoneStats finden/erstellen
    let stats = await this.prisma.userZoneStats.findFirst({
      where: { userId, zoneId },
    });
    if (!stats) {
      // neu anlegen
      stats = await this.prisma.userZoneStats.create({
        data: {
          userId,
          zoneId,
          zoneKey: zone.zoneKey, // für evtl. ältere Mechanik
          totalSecondsInZone: 0,
          leftoverSeconds: 0,
          pointsInThisZone: 0,
          lastJoinTimestamp: new Date(),
        },
      });
    } else {
      // existiert => lastJoinTimestamp aktualisieren (wenn z.B.  re-joint)
      await this.prisma.userZoneStats.update({
        where: { id: stats.id },
        data: {
          lastJoinTimestamp: new Date(),
        },
      });
    }
  }

  /**
   * User verlässt eine Zone
   * => Wir speichern deltaSeconds in totalSecondsInZone + leftoverSeconds
   * => Danach rufen wir convertTimeToPoints(...) auf,
   *    um ggf. volle Intervalle in Punkte zu umzurechnen.
   */
  async userLeftZone(params: { userId: string; zoneId: string }) {
    const { userId, zoneId } = params;

    // (A) Stats + Zone laden (wir wollen zone.minutesRequired, zone.pointsGranted)
    const stats = await this.prisma.userZoneStats.findFirst({
      where: { userId, zoneId },
      include: {
        zone: true, // <-- wichtig für die Punkte-Logik
      },
    });
    if (!stats || !stats.lastJoinTimestamp) {
      // Keine laufende Session => Nichts zu tun
      return;
    }

    const now = new Date();
    const deltaSeconds = Math.floor(
      (now.getTime() - stats.lastJoinTimestamp.getTime()) / 1000,
    );

    // (B) Summieren => totalSecondsInZone + leftoverSeconds
    const updatedTotal = stats.totalSecondsInZone + deltaSeconds;
    const updatedLeftover = stats.leftoverSeconds + deltaSeconds;

    // => 1) userZoneStats updaten
    await this.prisma.userZoneStats.update({
      where: { id: stats.id },
      data: {
        totalSecondsInZone: updatedTotal,
        leftoverSeconds: updatedLeftover,
        pointsInThisZone: stats.pointsInThisZone,
        lastJoinTimestamp: null, // session beendet
        lastUsage: now,
      },
    });

    // => 2) userGlobalStats => totalTimeInAllZones += deltaSeconds
    //    (So summieren wir alle Sekunden, die in *irgendeiner* Zone angefallen sind.)
    await this.prisma.userGlobalStats.update({
      where: { userId },
      data: {
        totalTimeInAllZones: {
          increment: deltaSeconds,
        },
      },
    });

    // (C) Jetzt volle Intervalle in Punkte wandeln
    if (!stats.zone) {
      return;
    }

    await this.convertTimeToPoints({
      userId,
      stats,
      leftoverSeconds: updatedLeftover,
    });
  }

  /**
   * Wandelt leftoverSeconds in Punkte, sofern genug Zeit für volle Intervalle
   * (bspw. zone.minutesRequired=60 => 1 Punkt pro 60min).
   * => Zieht die bereits "abgerechneten" Sekunden von leftover ab, damit
   *    diese nicht doppelt gezählt werden können.
   * => Aktualisiert userZoneStats + userGlobalStats.
   */
  private async convertTimeToPoints(args: {
    userId: string;
    stats: UserZoneStats & { zone: Zone | null };
    leftoverSeconds: number;
  }) {
    const { userId, stats, leftoverSeconds } = args;

    // 1) Intervall-Infos
    const minutesReq = stats.zone?.minutesRequired ?? 60;
    const pointsGranted = stats.zone?.pointsGranted ?? 1;
    const secPerInterval = minutesReq * 60;

    // 2) Wie viele volle Intervalle sind vorhanden?
    const intervals = Math.floor(leftoverSeconds / secPerInterval);
    if (intervals <= 0) {
      return; // kein voller Intervall => keine Punkte
    }

    // 3) Anzahl Punkte
    const addPoints = intervals * pointsGranted;

    // 4) leftoverSeconds = leftoverSeconds mod secPerInterval
    const newLeftover = leftoverSeconds % secPerInterval;

    // 5) userZoneStats => leftoverSeconds reduzieren, pointsInThisZone erhöhen
    await this.prisma.userZoneStats.update({
      where: { id: stats.id },
      data: {
        leftoverSeconds: newLeftover,
        pointsInThisZone: {
          increment: addPoints,
        },
      },
    });

    // 6) userGlobalStats => totalPoints erhöhen
    await this.prisma.userGlobalStats.update({
      where: { userId },
      data: {
        totalPoints: { increment: addPoints },
      },
    });
  }
}
