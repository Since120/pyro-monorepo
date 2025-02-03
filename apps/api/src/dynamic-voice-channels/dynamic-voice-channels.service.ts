import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import axios from "axios";
import { DynamicVoiceChannel } from "@prisma/client";

@Injectable()
export class DynamicVoiceChannelsService {
  constructor(private prisma: PrismaService) {}

  /**
   * createDvc
   */
  async createDvc(params: {
    userId: string;
    categoryId: string;
    customName: string;
  }): Promise<DynamicVoiceChannel> {
    const cat = await this.prisma.category.findUnique({
      where: { id: params.categoryId },
    });
    if (!cat) {
      throw new HttpException(
        `Category ${params.categoryId} not found`,
        HttpStatus.NOT_FOUND
      );
    }
    return this.prisma.dynamicVoiceChannel.create({
      data: {
        customName: params.customName,
        categoryId: params.categoryId,
        createdByUser: params.userId,
      },
    });
  }

  /**
   * assignZone
   */
  async assignZone(userId: string, zoneId: string): Promise<DynamicVoiceChannel> {
    return this.prisma.$transaction(async (tx) => {
      const dvc = await tx.dynamicVoiceChannel.findFirst({
        where: {
          createdByUser: userId,
          zoneId: null,
          deletedInDiscord: false,
        },
        orderBy: { createdAt: "desc" },
      });
      if (!dvc) {
        throw new HttpException(
          `No DVC record found for user ${userId} (zoneId=null)`,
          HttpStatus.NOT_FOUND
        );
      }

      const zone = await tx.zone.findUnique({ where: { id: zoneId } });
      if (!zone) {
        throw new HttpException(
          `Zone ${zoneId} not found`,
          HttpStatus.NOT_FOUND
        );
      }
      if (!dvc.categoryId) {
        throw new HttpException(
          "DynamicVoiceChannel has no categoryId",
          HttpStatus.BAD_REQUEST
        );
      }
      const category = await tx.category.findUnique({
        where: { id: dvc.categoryId },
      });
      if (!category) {
        throw new HttpException(
          `Category ${dvc.categoryId} not found`,
          HttpStatus.NOT_FOUND
        );
      }
      // Update zoneId
      let updated = await tx.dynamicVoiceChannel.update({
        where: { id: dvc.id },
        data: { zoneId },
      });

      // Check if there's an existing DVC with a role (nicht nach deletedInDiscord filtern)
      const botUrl = process.env.BOT_SERVICE_URL || "http://localhost:3002";
      let existingRoleDvc = await tx.dynamicVoiceChannel.findFirst({
        where: {
          categoryId: dvc.categoryId,
          discordRoleId: { not: null },
        },
      });
      let finalRoleId = existingRoleDvc?.discordRoleId || null;
      // If no role, create a new one
      if (!finalRoleId) {
        const roleResp = await axios.post(`${botUrl}/discord/roles/create-dvc-role`, {
          roleName: `DVC-Role-${category.name}`.replace(/\s/g, "-"),
        });
        finalRoleId = roleResp.data?.roleId;
        if (!finalRoleId) {
          throw new Error("Bot could not create new DVC role");
        }
        updated = await tx.dynamicVoiceChannel.update({
          where: { id: updated.id },
          data: { discordRoleId: finalRoleId },
        });
      }
      // Assign role to user
      await axios.post(`${botUrl}/discord/roles/assign`, {
        userId,
        roleId: finalRoleId,
      });

      // Finally create the voice channel in Discord
      const allowedRoles = category.allowedRoles || [];
      const createVcResp = await axios.post(`${botUrl}/discord/voice-channels`, {
        channelName: updated.customName || zone.zoneName || "DYN-Voice",
        categoryId: category.discordCategoryId,
        roleId: finalRoleId,
        allowedRoles,
        sendSetup: category.sendSetup === true,
      });
      const discordChannelId = createVcResp.data?.discordChannelId;
      if (discordChannelId) {
        return tx.dynamicVoiceChannel.update({
          where: { id: updated.id },
          data: { discordChannelId },
        });
      } else {
        return updated;
      }
    });
  }

  /**
   * lookupByDiscordChannelId
   */
  async lookupByDiscordChannelId(discordChannelId: string) {
    return this.prisma.dynamicVoiceChannel.findUnique({
      where: { discordChannelId },
    });
  }

  /**
   * findAnyWithRole
   * => NICHT nach deletedInDiscord filtern
   */
  async findAnyWithRole(categoryId: string) {
    return this.prisma.dynamicVoiceChannel.findFirst({
      where: {
        categoryId,
        discordRoleId: { not: null },
      },
    });
  }

  /**
   * findAllByCategory
   * => Du kannst hier optional nach `deletedInDiscord: false` filtern,
   *    je nachdem, was du zurückgeben willst.
   */
  async findAllByCategory(categoryId: string) {
    return this.prisma.dynamicVoiceChannel.findMany({
      where: { categoryId },
    });
  }

  /**
   * markDeletedByDiscordChannel
   * => Markiert den Eintrag als "deletedInDiscord = true"
   */
  async markDeletedByDiscordChannel(discordChannelId: string) {
    const dvc = await this.prisma.dynamicVoiceChannel.findUnique({
      where: { discordChannelId },
    });
    if (!dvc) {
      throw new HttpException("DVC not found", HttpStatus.NOT_FOUND);
    }
    await this.prisma.dynamicVoiceChannel.update({
      where: { discordChannelId },
      data: {
        deletedInDiscord: true,
      },
    });
    return { ok: true, message: "DVC marked as deletedInDiscord" };
  }

  /**
   * Hard-Delete aller Datensätze, die bereits deletedInDiscord=true sind,
   * in der angegebenen Kategorie
   */
  async hardDeleteAllInCategory(categoryId: string) {
    const result = await this.prisma.dynamicVoiceChannel.deleteMany({
      where: {
        categoryId,
        deletedInDiscord: true,
      },
    });
    return { ok: true, deletedCount: result.count };
  }
}
