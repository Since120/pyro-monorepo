// apps/api/src/zones/zones.module.ts
import { Module } from '@nestjs/common';
import { ZonesController } from './zones.controller';
import { ZonesService } from './zones.service';
import { VoiceChannelService } from './voice-channel/voice-channel.service';
import { VoiceChannelController } from './voice-channel/voice-channel.controller';


@Module({
  controllers: [ZonesController, VoiceChannelController,],
  providers: [ZonesService, VoiceChannelService, VoiceChannelService,],
})
export class ZonesModule {}