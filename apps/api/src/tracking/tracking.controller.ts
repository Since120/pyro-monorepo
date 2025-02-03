// apps/api/src/tracking/tracking.controller.ts
import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { TrackingService } from './tracking.service';

@Controller('tracking')
export class TrackingController {
  constructor(private readonly trackingService: TrackingService) {}

  /**
   * POST /tracking/join
   * Body: { userId, zoneId, userRoles: string[] }
   */
  @Post('join')
  async userJoinedZone(
    @Body() body: { userId?: string; zoneId?: string; userRoles?: string[] },
  ) {
    if (!body.userId || !body.zoneId || !body.userRoles) {
      throw new HttpException(
        'Missing userId, zoneId or userRoles',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.trackingService.userJoinedZone({
      userId: body.userId,
      zoneId: body.zoneId,
      userRoles: body.userRoles,
    });

    return { ok: true };
  }

  /**
   * POST /tracking/leave
   * Body: { userId, zoneId }
   */
  @Post('leave')
  async userLeftZone(@Body() body: { userId?: string; zoneId?: string }) {
    if (!body.userId || !body.zoneId) {
      throw new HttpException(
        'Missing userId or zoneId',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.trackingService.userLeftZone({
      userId: body.userId,
      zoneId: body.zoneId,
    });

    return { ok: true };
  }
}
