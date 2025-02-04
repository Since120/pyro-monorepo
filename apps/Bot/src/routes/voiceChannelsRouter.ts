// apps\Bot\src\routes\voiceChannelsRouter.ts

import { Router } from "express";
import logger from "../services/logger";
import { client } from "../index";
import { ChannelsDeletedByApi } from "../index";
import { z } from "zod";

export const voiceChannelsRouter = Router();

/**
 * DELETE /discord/voice-channels/:discordChannelId
 * Deletes a voice channel in Discord.
 */
voiceChannelsRouter.delete("/:discordChannelId", async (req, res) => {
  const discordChannelId = req.params.discordChannelId;
  if (!discordChannelId) {
    return res.status(400).json({ error: "Missing channel ID in URL" });
  }

  try {
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    const channelToRemove = guild.channels.cache.get(discordChannelId);
    if (!channelToRemove) {
      return res.status(404).json({ error: `Channel ${discordChannelId} not found in guild` });
    }

    ChannelsDeletedByApi.add(discordChannelId);
    await channelToRemove.delete("API => remove voice channel");
    logger.info(`[voiceChannelsRouter] Deleted voice channel=${discordChannelId}`);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[voiceChannelsRouter] deleteVoiceChannel Error:", err);
    return res.status(500).json({ error: "Bot delete channel error" });
  }
});

/**
 * PATCH /discord/voice-channels/:discordChannelId
 * Body: { newName?: string, newCategoryId?: string }
 * Modifies an existing voice channel in Discord.
 */
voiceChannelsRouter.patch("/:discordChannelId", async (req, res) => {
  const discordChannelId = req.params.discordChannelId;
  if (!discordChannelId) {
    return res.status(400).json({ error: "Missing channel ID in URL" });
  }

  const patchVoiceChannelSchema = z.object({
    newName: z.string().min(1).optional(),
    newCategoryId: z.string().min(1).optional(),
  });

  const parseResult = patchVoiceChannelSchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[voiceChannelsRouter] PATCH => invalid request body for voice channel update.");
    return res.status(400).json({ error: "No changes (newName / newCategoryId) provided" });
  }

  const { newName, newCategoryId } = parseResult.data;

  if (!newName && !newCategoryId) {
    return res.status(400).json({ error: "No changes (newName / newCategoryId) provided" });
  }

  try {
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    const channelToPatch = guild.channels.cache.get(discordChannelId);
    if (!channelToPatch) {
      return res.status(404).json({ error: `Channel ${discordChannelId} not found in guild` });
    }
    // 2 = GUILD_VOICE
    if (channelToPatch.type !== 2) {
      return res.status(400).json({ error: "Channel is not a VoiceChannel" });
    }

    // Rename
    if (newName) {
      await channelToPatch.setName(newName);
      logger.info(
        `[voiceChannelsRouter] Renamed voice channel=${discordChannelId} to '${newName}'`
      );
    }

    // Re-parent
    if (newCategoryId) {
      const newCategory = guild.channels.cache.get(newCategoryId);
      // 4 = GUILD_CATEGORY
      if (!newCategory || newCategory.type !== 4) {
        return res.status(400).json({ error: "Invalid newCategoryId or not a Category" });
      }
      await channelToPatch.setParent(newCategory.id, { lockPermissions: true });
      logger.info(
        `[voiceChannelsRouter] Moved voice channel=${discordChannelId} to category=${newCategoryId}`
      );
    }

    return res.json({ ok: true });
  } catch (err) {
    logger.error("[voiceChannelsRouter] patchVoiceChannel error:", err);
    return res.status(500).json({ error: "Bot patch channel error" });
  }
});

/**
 * POST /discord/voice-channels
 * Creates a new voice channel in Discord.
 */
voiceChannelsRouter.post("/", async (req, res) => {
  const createVoiceChannelSchema = z.object({
    channelName: z.string().min(1),
    categoryId: z.string().min(1),
    roleId: z.string().optional(),
    allowedRoles: z.array(z.string()).optional(),
    sendSetup: z.boolean().optional(),
  });

  const parseResult = createVoiceChannelSchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[voiceChannelsRouter] POST => invalid request body for creating voice channel.");
    return res.status(400).json({ error: "Missing or invalid channelName/categoryId" });
  }

  const { channelName, categoryId, roleId, allowedRoles, sendSetup } = parseResult.data;

  try {
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    const parentChannel = guild.channels.cache.get(categoryId);
    // 4 = GUILD_CATEGORY
    if (!parentChannel || parentChannel.type !== 4) {
      return res.status(400).json({ error: "Category not found or invalid type" });
    }

    // 2 = GUILD_VOICE
    const newChannel = await guild.channels.create({
      name: channelName,
      type: 2,
      parent: parentChannel.id,
    });

    if (!sendSetup) {
      // Legacy system -> lockPermissions
      await newChannel.lockPermissions();
      if (roleId) {
        await newChannel.permissionOverwrites.create(roleId, {
          Connect: true,
          ViewChannel: true,
        });
      }
      logger.info(
        `[voiceChannelsRouter] Created voice channel=${newChannel.id} with lockPermissions (roleId=${roleId || "none"})`
      );
    } else {
      // Manual overwrites
      logger.info(
        `[voiceChannelsRouter] Created voice channel=${newChannel.id} with custom overwrites => setup mode`
      );

      // everyone => no connect, no view
      const everyone = guild.roles.everyone;
      await newChannel.permissionOverwrites.create(everyone, {
        Connect: false,
        ViewChannel: false,
      });

      // allowedRoles => can see, can't connect
      if (Array.isArray(allowedRoles)) {
        for (const rId of allowedRoles) {
          await newChannel.permissionOverwrites.create(rId, {
            Connect: false,
            ViewChannel: true,
          });
        }
      }

      // roleId => can connect, can view
      if (roleId) {
        await newChannel.permissionOverwrites.create(roleId, {
          Connect: true,
          ViewChannel: true,
        });
      }
    }

    return res.json({ ok: true, discordChannelId: newChannel.id });
  } catch (err) {
    logger.error("[voiceChannelsRouter] createVoiceChannel error:", err);
    return res.status(500).json({ error: "Bot create channel error" });
  }
});