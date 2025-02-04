// apps\Bot\src\routes\textChannelsRouter.ts

import { Router } from "express";
import { client } from "../index";
import { ChannelType, PermissionFlagsBits, OverwriteType, OverwriteResolvable } from "discord.js";
import { z } from "zod";
import logger from "../services/logger";

export const textChannelsRouter = Router();

/**
 * POST /discord/text-channels
 * Creates a text channel.
 */
textChannelsRouter.post("/", async (req, res) => {
  const createTextChannelSchema = z.object({
    channelName: z.string().optional(),
    parentCategoryId: z.string().optional(),
    private: z.boolean().optional(),
  });

  const parseResult = createTextChannelSchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[textChannelsRouter] POST => invalid request body for creating text channel.");
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { channelName, parentCategoryId, private: isPrivate } = parseResult.data;

  const guildId = process.env.GUILD_ID;
  if (!guildId) {
    logger.error("[textChannelsRouter] No GUILD_ID in env variables.");
    return res.status(500).json({ error: "No GUILD_ID in env" });
  }
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    logger.warn(`[textChannelsRouter] Guild ${guildId} not found.`);
    return res.status(404).json({ error: `Guild ${guildId} not found` });
  }

  try {
    const createdChannel = await guild.channels.create({
      name: channelName || "TEXT-CHANNEL",
      type: ChannelType.GuildText,
      parent: parentCategoryId || undefined,
      reason: "Created via Setup",
    });

    if (isPrivate) {
      const overwrites: OverwriteResolvable[] = [
        {
          id: guild.roles.everyone.id,
          deny: PermissionFlagsBits.ViewChannel,
          type: OverwriteType.Role,
        },
      ];
      await createdChannel.permissionOverwrites.set(overwrites);
      logger.info(`[textChannelsRouter] Created private text channel=${createdChannel.id}`);
    } else {
      logger.info(`[textChannelsRouter] Created public text channel=${createdChannel.id}`);
    }

    return res.json({ discordChannelId: createdChannel.id });
  } catch (err) {
    logger.error("[textChannelsRouter] Error creating text channel:", err);
    return res.status(500).json({ error: "Bot error creating channel" });
  }
});

/**
 * DELETE /discord/text-channels/:channelId
 * Deletes a text channel.
 */
textChannelsRouter.delete("/:channelId", async (req, res) => {
  const channelId = req.params.channelId;
  if (!channelId) {
    return res.status(400).json({ error: "Missing channel ID" });
  }

  try {
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      logger.warn(`[textChannelsRouter] Guild ${guildId} not found.`);
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    const channelToRemove = guild.channels.cache.get(channelId);
    if (!channelToRemove) {
      logger.warn(`[textChannelsRouter] Channel ${channelId} not found in guild.`);
      return res.status(404).json({ error: `Channel ${channelId} not found` });
    }
    if (channelToRemove.type !== ChannelType.GuildText) {
      return res.status(400).json({ error: "Channel is not a TextChannel" });
    }

    await channelToRemove.delete("API => remove text channel");
    logger.info(`[textChannelsRouter] Deleted text channel=${channelId}`);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[textChannelsRouter] Error deleting text channel:", err);
    return res.status(500).json({ error: "Bot textChannel deletion error" });
  }
});

/**
 * PATCH /discord/text-channels/:channelId
 * Modifies channel overwrites (visibility, allowed roles).
 */
textChannelsRouter.patch("/:channelId", async (req, res) => {
  const channelId = req.params.channelId;
  if (!channelId) {
    return res.status(400).json({ error: "Missing channel ID" });
  }

  const patchChannelSchema = z.object({
    isVisible: z.boolean(),
    allowedRoles: z.array(z.string()).optional(),
  });

  const parseResult = patchChannelSchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[textChannelsRouter] PATCH => invalid request body.");
    return res.status(400).json({ error: "Invalid request body" });
  }
  const { isVisible, allowedRoles } = parseResult.data;

  try {
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }
    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
      return res.status(404).json({ error: "TextChannel not found" });
    }
    if (channel.type !== ChannelType.GuildText) {
      return res.status(400).json({ error: "Channel is not a TextChannel" });
    }

    logger.debug(
      `[textChannelsRouter] Updating channel=${channelId} => isVisible=${isVisible}, allowedRolesCount=${
        allowedRoles?.length || 0
      }`
    );

    const everyoneId = guild.roles.everyone.id;
    const overwrites: OverwriteResolvable[] = [];

    // @everyone
    if (isVisible) {
      overwrites.push({
        id: everyoneId,
        allow: PermissionFlagsBits.ViewChannel,
        type: OverwriteType.Role,
      });
    } else {
      overwrites.push({
        id: everyoneId,
        deny: PermissionFlagsBits.ViewChannel,
        type: OverwriteType.Role,
      });

      // allowedRoles => allow
      for (const roleId of allowedRoles ?? []) {
        overwrites.push({
          id: roleId,
          allow: PermissionFlagsBits.ViewChannel,
          type: OverwriteType.Role,
        });
      }
    }

    await channel.permissionOverwrites.set(overwrites);
    logger.info(`[textChannelsRouter] Updated overwrites for text channel=${channelId}`);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[textChannelsRouter] Failed to set overwrites:", err);
    return res.status(500).json({ error: "Failed to set textChannel overwrites" });
  }
});
