import {
  Controller,
  Post,
  Patch,
  Get,
  Query,
  Body,
  HttpException,
  HttpStatus,
  Delete,
} from "@nestjs/common";
import { DynamicVoiceChannelsService } from "./dynamic-voice-channels.service";

/**
 * Für createDvc
 */
interface CreateDvcDto {
  userId: string;
  categoryId: string;
  customName: string;
}

/**
 * Für assignZone
 */
interface AssignZoneDto {
  userId: string;
  zoneId: string;
}

@Controller("dynamic-voice-channels")
export class DynamicVoiceChannelsController {
  constructor(private readonly dvcService: DynamicVoiceChannelsService) {}

  /**
   * POST /dynamic-voice-channels
   */
  @Post()
  async createDvc(@Body() body: CreateDvcDto) {
    if (!body.userId || !body.categoryId || !body.customName) {
      throw new HttpException(
        "Missing userId, categoryId or customName",
        HttpStatus.BAD_REQUEST
      );
    }
    return this.dvcService.createDvc(body);
  }

  /**
   * PATCH /dynamic-voice-channels/assign-zone
   */
  @Patch("assign-zone")
  async assignZone(@Body() body: AssignZoneDto) {
    if (!body.userId || !body.zoneId) {
      throw new HttpException("Missing userId or zoneId", HttpStatus.BAD_REQUEST);
    }
    return this.dvcService.assignZone(body.userId, body.zoneId);
  }

  /**
   * GET /dynamic-voice-channels/any-role?categoryId=123
   * => Schaut, ob in dieser Kategorie schon ein DVC mit discordRoleId!=null existiert.
   */
  @Get("any-role")
  async getAnyRole(@Query("categoryId") categoryId: string) {
    if (!categoryId) {
      throw new HttpException("Missing categoryId", HttpStatus.BAD_REQUEST);
    }
    // Neu: NICHT mehr nach deletedInDiscord=false filtern
    const found = await this.dvcService.findAnyWithRole(categoryId);
    return { roleId: found?.discordRoleId || null };
  }

  /**
   * GET /dynamic-voice-channels/lookup?discordChannelId=XXX
   */
  @Get("lookup")
  async lookup(@Query("discordChannelId") discordChannelId: string) {
    if (!discordChannelId) {
      throw new HttpException("Missing discordChannelId", HttpStatus.BAD_REQUEST);
    }
    const dvc = await this.dvcService.lookupByDiscordChannelId(discordChannelId);
    if (!dvc) {
      throw new HttpException("Not found", HttpStatus.NOT_FOUND);
    }
    return { zoneId: dvc.zoneId, categoryId: dvc.categoryId };
  }

  /**
   * GET /dynamic-voice-channels?categoryId=123
   * => Gibt ALLE DVCs in dieser Kategorie zurück (auch gelöschte) – 
   */
  @Get()
  async findAllForCategory(@Query("categoryId") categoryId: string) {
    if (!categoryId) {
      throw new HttpException("Missing categoryId", HttpStatus.BAD_REQUEST);
    }
    return this.dvcService.findAllByCategory(categoryId);
  }

  /**
   * PATCH /dynamic-voice-channels/mark-deleted
   * => Markiert den DVC als gelöscht in der DB (deletedInDiscord=true).
   */
  @Patch("mark-deleted")
  async markDeleted(@Body() body: { discordChannelId: string }) {
    if (!body.discordChannelId) {
      throw new HttpException("Missing discordChannelId", HttpStatus.BAD_REQUEST);
    }
    return this.dvcService.markDeletedByDiscordChannel(body.discordChannelId);
  }

  /**
   * DELETE /dynamic-voice-channels/hard-delete?categoryId=XYZ
   * => Entfernt ALLE Einträge in dieser Kategorie,
   *    die `deletedInDiscord=true` haben.
   */
  @Delete("hard-delete")
  async hardDeleteAll(@Query("categoryId") categoryId: string) {
    if (!categoryId) {
      throw new HttpException("Missing categoryId", HttpStatus.BAD_REQUEST);
    }
    return this.dvcService.hardDeleteAllInCategory(categoryId);
  }
}
