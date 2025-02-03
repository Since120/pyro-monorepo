// apps/api/src/tracking/tracking.module.ts
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
// Oder falls du in prisma.module.ts deinen PrismaService exportierst
// import { PrismaService } from '../prisma/prisma.service';

import { TrackingService } from './tracking.service';
import { TrackingController } from './tracking.controller';

@Module({
  imports: [PrismaModule], // <-- Damit wir PrismaService nutzen können
  controllers: [TrackingController],
  providers: [TrackingService],
  exports: [TrackingService], // <-- optional, falls andere Module den Service importieren sollen
})
export class TrackingModule {}
