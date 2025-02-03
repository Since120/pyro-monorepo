// apps/api/src/zones/zones.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Query, // <-- WICHTIG
} from '@nestjs/common';
import { ZonesService } from './zones.service';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  async findAll(@Query('categoryId') catId?: string) {
    try {
      return await this.zonesService.findAll(catId);
    } catch (err) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post()
  async create(
    @Body()
    body: {
      zoneKey: string;
      zoneName: string;
      minutesRequired?: number;
      pointsGranted?: number;
      categoryId?: string;
    },
  ) {
    if (!body.zoneKey || !body.zoneName) {
      throw new HttpException(
        'zoneKey & zoneName required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await this.zonesService.createZone({
        ...body,
        categoryId: body.categoryId || null,
      });
    } catch (err) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  async update(
    @Param('id') zoneId: string,
    @Body()
    body: {
      zoneKey?: string;
      zoneName?: string;
      minutesRequired?: number;
      pointsGranted?: number;
      categoryId?: string;
    },
  ) {
    if (!zoneId) {
      throw new HttpException('Missing zoneId', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.zonesService.updateZone(zoneId, {
        ...body,
        categoryId: body.categoryId || null,
      });
    } catch (err) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') zoneId: string) {
    if (!zoneId) {
      throw new HttpException('Missing zoneId', HttpStatus.BAD_REQUEST);
    }
    try {
      return await this.zonesService.deleteZone(zoneId);
    } catch (err) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('bulk-delete')
  async bulkDelete(@Body() body: { zoneIds: string[] }) {
    try {
      if (!body.zoneIds || body.zoneIds.length === 0) {
        throw new HttpException('No IDs given', HttpStatus.BAD_REQUEST);
      }
      const result = await this.zonesService.deleteManyZones(body.zoneIds);
      return { deletedCount: result.count };
    } catch (err) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
