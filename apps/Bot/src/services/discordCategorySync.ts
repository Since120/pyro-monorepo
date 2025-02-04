// apps\Bot\src\services\discordCategorySync.ts

import { client } from "../index";
import { ChannelType, GuildChannel, PermissionFlagsBits, VoiceChannel } from "discord.js";
import logger from "./logger";
import { z } from "zod";

/**
 * Creates a new Discord category.
 * Returns the created channelId (discordCategoryId) or an empty string on error.
 */
export async function createDiscordCategory(
  name: string,
  isVisible?: boolean,
  allowedRoles?: string[]
): Promise<string> {
  const envSchema = z.object({ GUILD_ID: z.string().min(1) });
  const envCheck = envSchema.safeParse(process.env);
  if (!envCheck.success) {
    logger.warn("[createDiscordCategory] Missing GUILD_ID in environment variables.");
    return "";
  }

  try {
    const guildId = envCheck.data.GUILD_ID;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`[createDiscordCategory] Guild ${guildId} not found.`);
      return "";
    }

    const created = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      reason: "Created automatically via API->Bot",
    });
    logger.info(`[createDiscordCategory] Channel "${created.name}" created (ID=${created.id}).`);

    // Prepare overwrites
    const overwrites = [];
    const everyone = guild.roles.everyone;
    const isCatVisible = isVisible ?? true;

    if (isCatVisible) {
      // if visible => @everyone can ViewChannel
      overwrites.push({
        id: everyone.id,
        allow: [PermissionFlagsBits.ViewChannel],
      });
    } else {
      // if not visible => @everyone can't ViewChannel
      overwrites.push({
        id: everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      });
      // allowedRoles => can ViewChannel, Connect
      for (const roleId of allowedRoles ?? []) {
        if (roleId === everyone.id) continue;
        overwrites.push({
          id: roleId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
        });
      }
    }

    await created.permissionOverwrites.set(overwrites, "Initial overwrites for category");
    logger.info(`[createDiscordCategory] Overwrites set for category ${created.id}`);
    return created.id;
  } catch (err) {
    logger.error("[createDiscordCategory] Error:", err);
    return "";
  }
}

/**
 * Renames an existing Discord category and optionally updates visibility/roles.
 */
export async function renameDiscordCategory(
  channelId: string,
  newName: string,
  isVisible?: boolean,
  allowedRoles?: string[]
): Promise<void> {
  const envSchema = z.object({ GUILD_ID: z.string().min(1) });
  const envCheck = envSchema.safeParse(process.env);
  if (!envCheck.success) {
    logger.warn("[renameDiscordCategory] Missing GUILD_ID in environment variables.");
    return;
  }

  try {
    const guildId = envCheck.data.GUILD_ID;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`[renameDiscordCategory] Guild ${guildId} not found.`);
      return;
    }

    const channel = guild.channels.cache.get(channelId) as GuildChannel | undefined;
    if (!channel) {
      logger.warn(`[renameDiscordCategory] Channel ${channelId} not found.`);
      return;
    }

    await channel.setName(newName);
    logger.info(`[renameDiscordCategory] Channel ${channel.id} renamed to "${newName}".`);

    // Update overwrites if isVisible is defined
    if (isVisible !== undefined) {
      const overwritesArray = [];
      const everyoneRole = guild.roles.everyone;
      const catVisible = isVisible;

      if (catVisible) {
        overwritesArray.push({
          id: everyoneRole.id,
          allow: [PermissionFlagsBits.ViewChannel],
        });
      } else {
        overwritesArray.push({
          id: everyoneRole.id,
          deny: [PermissionFlagsBits.ViewChannel],
        });
        for (const rId of allowedRoles ?? []) {
          if (rId === everyoneRole.id) continue;
          overwritesArray.push({
            id: rId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
          });
        }
      }
      await channel.permissionOverwrites.set(overwritesArray, "Sync overwrites on rename");
      logger.info(`[renameDiscordCategory] Overwrites set for #${channel.id}`);
    }

    // For each child VoiceChannel, lockPermissions() to sync with the category
    const childVoiceChannels = guild.channels.cache.filter(
      (c): c is VoiceChannel => c.parentId === channel.id && c.type === ChannelType.GuildVoice
    );

    // Remove `id` to avoid "assigned but never used"
    for (const [, vc] of childVoiceChannels) {
      try {
        await vc.lockPermissions();
        logger.info(
          `[renameDiscordCategory] VoiceChannel #${vc.id} => lockPermissions() synced to category #${channel.id}`
        );
      } catch (err) {
        logger.warn(`[renameDiscordCategory] lockPermissions failed for #${vc.id}`, err);
      }
    }
  } catch (err) {
    logger.error("[renameDiscordCategory] Error:", err);
  }
}

/**
 * Deletes a Discord category by channelId.
 */
export async function removeDiscordCategory(channelId: string): Promise<void> {
  const envSchema = z.object({ GUILD_ID: z.string().min(1) });
  const envCheck = envSchema.safeParse(process.env);
  if (!envCheck.success) {
    logger.warn("[removeDiscordCategory] Missing GUILD_ID in environment variables.");
    return;
  }

  try {
    const guildId = envCheck.data.GUILD_ID;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`[removeDiscordCategory] Guild ${guildId} not found.`);
      return;
    }

    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
      logger.warn(`[removeDiscordCategory] Channel ${channelId} not found.`);
      return;
    }

    await channel.delete("Auto deletion via API->Bot");
    logger.info(`[removeDiscordCategory] Channel ${channelId} deleted.`);
  } catch (err) {
    logger.error("[removeDiscordCategory] Error:", err);
  }
}
