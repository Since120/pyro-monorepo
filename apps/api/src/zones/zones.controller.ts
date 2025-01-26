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
} from '@nestjs/common';
import { ZonesService } from './zones.service';

@Controller('zones')
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Get()
  async findAll() {
    try {
      const zones = await this.zonesService.findAll();
      return zones; // Automatisch als JSON
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
      const newZone = await this.zonesService.createZone({
        zoneKey: body.zoneKey,
        zoneName: body.zoneName,
        minutesRequired: body.minutesRequired,
        pointsGranted: body.pointsGranted,
        categoryId: body.categoryId || null,
      });
      return newZone;
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
      const updated = await this.zonesService.updateZone(zoneId, body);
      return updated;
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
      const deleted = await this.zonesService.deleteZone(zoneId);
      return deleted;
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
      const { zoneIds } = body;
      if (!zoneIds || zoneIds.length === 0) {
        throw new HttpException('Keine IDs übergeben', HttpStatus.BAD_REQUEST);
      }
      // Alle Zone-IDs auf einmal löschen
      // Prisma kann das so machen:
      const result = await this.zonesService.deleteManyZones(zoneIds);
      return { deletedCount: result.count };
    } catch (err) {
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
