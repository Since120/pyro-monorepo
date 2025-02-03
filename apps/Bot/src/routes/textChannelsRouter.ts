// Pfad: apps/Bot/src/routes/textChannelsRouter.ts

import { Router } from "express";
import { client } from "../index";
import {
  ChannelType,
  PermissionFlagsBits,
  OverwriteType,
  OverwriteResolvable, // <-- Wichtig für TS
} from "discord.js";

export const textChannelsRouter = Router();

/**
 * POST /discord/text-channels
 * => Erzeugt einen Textkanal
 */
textChannelsRouter.post("/", async (req, res) => {
  const { channelName, parentCategoryId, private: isPrivate } = req.body;
  const guildId = process.env.GUILD_ID;
  if (!guildId) {
    return res.status(500).json({ error: "No GUILD_ID in env" });
  }
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    return res.status(404).json({ error: `Guild ${guildId} not found` });
  }

  try {
    // 1) Channel erstellen
    const createdChannel = await guild.channels.create({
      name: channelName || "TEXT-CHANNEL",
      type: ChannelType.GuildText,
      parent: parentCategoryId || undefined,
      reason: "Automatisch via Setup",
    });

    // 2) Falls private => @everyone darf NICHT ViewChannel
    if (isPrivate) {
      const overwrites: OverwriteResolvable[] = [
        {
          id: guild.roles.everyone.id,
          deny: PermissionFlagsBits.ViewChannel, // BigInt
          type: OverwriteType.Role,
        },
      ];
      await createdChannel.permissionOverwrites.set(overwrites);
    }

    return res.json({ discordChannelId: createdChannel.id });
  } catch (err) {
    console.error("Error creating text channel:", err);
    return res.status(500).json({ error: "Bot error creating channel" });
  }
});

/**
 * DELETE /discord/text-channels/:channelId
 * => Löscht einen TextChannel
 */
textChannelsRouter.delete("/:channelId", async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    return res.status(400).json({ error: "Missing channel ID" });
  }
  try {
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }
    const channelToRemove = guild.channels.cache.get(channelId);
    if (!channelToRemove) {
      return res.status(404).json({ error: `Channel ${channelId} not found` });
    }
    if (channelToRemove.type !== ChannelType.GuildText) {
      return res.status(400).json({ error: "Channel is not a TextChannel" });
    }

    await channelToRemove.delete("API => remove text channel");
    console.log(`[Bot] TextChannel deleted => ${channelId}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error("Error deleting text channel:", err);
    return res
      .status(500)
      .json({ error: "Bot textChannel deletion error" });
  }
});

/**
 * PATCH /discord/text-channels/:channelId
 * => Ändert Overwrites je nach isVisible + allowedRoles
 */
textChannelsRouter.patch("/:channelId", async (req, res) => {
  const { channelId } = req.params;
  const { isVisible, allowedRoles } = req.body;

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

  if (typeof isVisible !== "boolean") {
    return res
      .status(400)
      .json({ error: "Missing or invalid isVisible:boolean" });
  }

  // 1) Everyone
  const everyoneId = guild.roles.everyone.id;

  // 2) Overwrites-Array
  const overwrites: OverwriteResolvable[] = [];

  if (isVisible) {
    // => @everyone => allow ViewChannel
    overwrites.push({
      id: everyoneId,
      allow: PermissionFlagsBits.ViewChannel,
      type: OverwriteType.Role,
    });
  } else {
    // => @everyone => deny ViewChannel
    overwrites.push({
      id: everyoneId,
      deny: PermissionFlagsBits.ViewChannel,
      type: OverwriteType.Role,
    });

    // => allowedRoles => allow
    for (const roleId of allowedRoles ?? []) {
      overwrites.push({
        id: roleId,
        allow: PermissionFlagsBits.ViewChannel,
        type: OverwriteType.Role,
      });
    }
  }

  // 3) Overwrites setzen
  try {
    await channel.permissionOverwrites.set(overwrites);
  } catch (err) {
    console.warn("Fehler beim Setzen der Overwrites:", err);
    return res.status(500).json({ error: "Failed to set textChannel overwrites" });
  }

  return res.json({ ok: true });
});
