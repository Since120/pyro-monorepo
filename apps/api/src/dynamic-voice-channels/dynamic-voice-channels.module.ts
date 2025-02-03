// apps/api/src/dynamic-voice-channels/dynamic-voice-channels.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DynamicVoiceChannelsService } from './dynamic-voice-channels.service';
import { DynamicVoiceChannelsController } from './dynamic-voice-channels.controller';

@Module({
  imports: [PrismaModule],
  controllers: [DynamicVoiceChannelsController],
  providers: [DynamicVoiceChannelsService],
  exports: [DynamicVoiceChannelsService],
})
export class DynamicVoiceChannelsModule {}
