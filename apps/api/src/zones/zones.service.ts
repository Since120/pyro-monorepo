// Pfad: apps/api/src/zones/zones.service.ts

import { Injectable } from '@nestjs/common';
import { ZoneFindService } from './services/zone-find.service';
import { ZoneCreateService } from './services/zone-create.service';
import { ZoneUpdateService } from './services/zone-update.service';
import { ZoneDeleteService } from './services/zone-delete.service';
import { ZoneBulkDeleteService } from './services/zone-bulk-delete.service';

@Injectable()
export class ZonesService {
  constructor(
    private readonly zoneFindService: ZoneFindService,
    private readonly zoneCreateService: ZoneCreateService,
    private readonly zoneUpdateService: ZoneUpdateService,
    private readonly zoneDeleteService: ZoneDeleteService,
    private readonly zoneBulkDeleteService: ZoneBulkDeleteService,
  ) {}

  // 1) READ ALL
  findAll(categoryId?: string) {
    return this.zoneFindService.findAll(categoryId);
  }
  // 2) CREATE
  createZone(data: {
    zoneKey: string;
    zoneName: string;
    minutesRequired?: number;
    pointsGranted?: number;
    categoryId?: string | null;
  }) {
    return this.zoneCreateService.createZone(data);
  }

  // 3) UPDATE
  updateZone(
    zoneId: string,
    data: {
      zoneKey?: string;
      zoneName?: string;
      minutesRequired?: number;
      pointsGranted?: number;
      categoryId?: string | null;
    },
  ) {
    return this.zoneUpdateService.updateZone(zoneId, data);
  }

  // 4) DELETE
  deleteZone(zoneId: string) {
    return this.zoneDeleteService.deleteZone(zoneId);
  }

  // 5) BULK DELETE
  deleteManyZones(zoneIds: string[]) {
    return this.zoneBulkDeleteService.deleteManyZones(zoneIds);
  }
}
