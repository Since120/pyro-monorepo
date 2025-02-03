// Pfad: apps/api/src/zones/zones.module.ts
import { Module } from '@nestjs/common';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';

// Sub-Services:
import { ZoneCreateService } from './services/zone-create.service';
import { ZoneUpdateService } from './services/zone-update.service';
import { ZoneDeleteService } from './services/zone-delete.service';
import { ZoneBulkDeleteService } from './services/zone-bulk-delete.service';
import { ZoneFindService } from './services/zone-find.service';

import { VoiceChannelService } from './voice-channel/voice-channel.service';
import { VoiceChannelController } from './voice-channel/voice-channel.controller';

@Module({
  controllers: [
    ZonesController, // dein Zonen-Controller
    VoiceChannelController, // dein VoiceChannel-Controller
  ],
  providers: [
    ZonesService, // Haupt-Service (Orchestrierung)
    VoiceChannelService, // VoiceChannelService bleibt
    ZoneFindService,
    ZoneCreateService,
    ZoneUpdateService,
    ZoneDeleteService,
    ZoneBulkDeleteService,
  ],
})
export class ZonesModule {}
