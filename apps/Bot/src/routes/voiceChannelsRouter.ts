// apps/Bot/src/routes/voiceChannelsRouter.ts

import { Router } from "express";
import logger from "../services/logger";
import { client } from "../index";
import { ChannelsDeletedByApi } from "../index"; // <-- neu importieren


export const voiceChannelsRouter = Router();


/**
 * DELETE /discord/voice-channels/:discordChannelId
 * => Löscht Voice-Kanal in Discord
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
    logger.info(`[Bot] VoiceChannel deleted => ${discordChannelId}`);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[Bot] deleteVoiceChannel Error:", err);
    return res.status(500).json({ error: "Bot delete channel error" });
  }
});

+(
  /**
+  * PATCH /discord/voice-channels/:discordChannelId
+  * Body: { newName?: string, newCategoryId?: string }
+  * => Ändert einen bestehenden Voice-Kanal in Discord
+  */
  voiceChannelsRouter.patch("/:discordChannelId", async (req, res) => {
    const discordChannelId = req.params.discordChannelId;
    if (!discordChannelId) {
      return res.status(400).json({ error: "Missing channel ID in URL" });
    }

    const { newName, newCategoryId } = req.body;
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
      // Check: Muss Voice-Kanal sein
      if (channelToPatch.type !== 2) {
        // 2 = GUILD_VOICE
        return res.status(400).json({ error: "Channel is not a VoiceChannel" });
      }

      // 1) Optional: rename
      if (newName) {
        await channelToPatch.setName(newName);
        logger.info(`[Bot] Renamed voice channel ${discordChannelId} => ${newName}`);
      }

      // 2) Optional: re-parent -> newCategoryId
      if (newCategoryId) {
        const newCategory = guild.channels.cache.get(newCategoryId);
        if (!newCategory || newCategory.type !== 4) {
          // 4 = GUILD_CATEGORY
          return res.status(400).json({ error: "Invalid newCategoryId or not a Category" });
        }
        // (B) Option A: re-parent + dann lockPermissions()
        // (B) Option B: via setParent(..., { lockPermissions: true })
        await channelToPatch.setParent(newCategory.id, { lockPermissions: true });
        logger.info(`[Bot] Moved voice channel ${discordChannelId} to category ${newCategoryId}`);
      }

      return res.json({ ok: true });
    } catch (err) {
      logger.error("[Bot] patchVoiceChannel error:", err);
      return res.status(500).json({ error: "Bot patch channel error" });
    }
  })
);

/**
 * DELETE /discord/voice-channels/:discordChannelId
 * => Löscht Voice-Kanal in Discord
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

    await channelToRemove.delete("API => remove voice channel");
    console.log(`[Bot] VoiceChannel deleted => ${discordChannelId}`);
    return res.json({ ok: true });
  } catch (err) {
    console.error("[Bot] deleteVoiceChannel Error:", err);
    return res.status(500).json({ error: "Bot delete channel error" });
  }
});

/**
 * PATCH /discord/voice-channels/:discordChannelId
 * Body: { newName?: string, newCategoryId?: string }
 * => Ändert einen bestehenden Voice-Kanal in Discord
 */
voiceChannelsRouter.patch("/:discordChannelId", async (req, res) => {
  const discordChannelId = req.params.discordChannelId;
  if (!discordChannelId) {
    return res.status(400).json({ error: "Missing channel ID in URL" });
  }

  const { newName, newCategoryId } = req.body;
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
    // Check: Muss Voice-Kanal sein
    if (channelToPatch.type !== 2) {
      // 2 = GUILD_VOICE
      return res.status(400).json({ error: "Channel is not a VoiceChannel" });
    }

    // 1) Optional: rename
    if (newName) {
      await channelToPatch.setName(newName);
      console.log(`[Bot] Renamed voice channel ${discordChannelId} => ${newName}`);
    }

    // 2) Optional: re-parent -> newCategoryId
    if (newCategoryId) {
      const newCategory = guild.channels.cache.get(newCategoryId);
      // 4 = GUILD_CATEGORY
      if (!newCategory || newCategory.type !== 4) {
        return res.status(400).json({
          error: "Invalid newCategoryId or not a Category",
        });
      }
      // Re-parent + Lock Permissions
      await channelToPatch.setParent(newCategory.id, { lockPermissions: true });
      console.log(`[Bot] Moved voice channel ${discordChannelId} to category ${newCategoryId}`);
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error("[Bot] patchVoiceChannel error:", err);
    return res.status(500).json({ error: "Bot patch channel error" });
  }
});


voiceChannelsRouter.post("/", async (req, res) => {
  try {
    const {
      channelName,
      categoryId,
      roleId,        // NEU: vom Wizard
      allowedRoles,  // NEU: array
      sendSetup,     // NEU: boolean
    } = req.body;

    if (!channelName || !categoryId) {
      return res.status(400).json({ error: "Missing channelName or categoryId" });
    }

    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    const parentChannel = guild.channels.cache.get(categoryId);
    if (!parentChannel || parentChannel.type !== 4) {
      return res.status(400).json({ error: "Category not found or invalid type" });
    }

    // 1) Erstelle VoiceChannel
    // vorerst KEINE Overwrites => wir machen das manuell
    const newChannel = await guild.channels.create({
      name: channelName,
      type: 2, // Voice
      parent: parentChannel.id,
      // permissionOverwrites: [] => wir setzen Overwrites gleich unten
    });

    // 2) Wenn sendSetup = false => altes System
    // => lockPermissions => Overwrites vererbt aus Category
    if (!sendSetup) {
      // altes System
      await newChannel.lockPermissions();
      // => optional: Wenn roleId existiert, Overwrite "connect=true"
      if (roleId) {
        await newChannel.permissionOverwrites.create(roleId, {
          Connect: true,
          ViewChannel: true,
        });
      }

      console.log(`[BOT] old system => lockPermissions done, roleId=?${roleId}`);
    } else {
      // 3) Wenn sendSetup = true => wir überschreiben manuell
      console.log(`[BOT] setup=TRUE => manuelle Overwrites => no lockPermissions`);

      // @everyone => connect=false, viewChannel=false
      const everyone = guild.roles.everyone;
      await newChannel.permissionOverwrites.create(everyone, {
        Connect: false,
        ViewChannel: false,
      });

      // allowedRoles => connect=false, viewChannel=true (sehen, aber nicht joinen)
      if (Array.isArray(allowedRoles)) {
        for (const rId of allowedRoles) {
          await newChannel.permissionOverwrites.create(rId, {
            Connect: false,
            ViewChannel: true,
          });
        }
      }

      // Wizard-Rolle => connect=true, viewChannel=true
      if (roleId) {
        await newChannel.permissionOverwrites.create(roleId, {
          Connect: true,
          ViewChannel: true,
        });
      }
    }

    // success
    return res.json({ ok: true, discordChannelId: newChannel.id });
  } catch (err) {
    logger.error("[Bot] createVoiceChannel Error:", err);
    return res.status(500).json({ error: "Bot create channel error" });
  }
});