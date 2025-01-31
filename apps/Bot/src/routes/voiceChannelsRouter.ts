// apps/Bot/src/routes/voiceChannelsRouter.ts

import { Router } from "express";
import logger from "../services/logger";
import { client } from "../index";
import { ChannelsDeletedByApi } from "../index"; // <-- neu importieren

export const voiceChannelsRouter = Router();

/**
 * POST /discord/voice-channels
 * Body: { channelName, categoryId }
 * => Erstellt in Discord einen Voice-Kanal
 */
voiceChannelsRouter.post("/", async (req, res) => {
  const { channelName, categoryId } = req.body;
  if (!channelName || !categoryId) {
    return res
      .status(400)
      .json({ error: "Missing channelName or categoryId" });
  }

  try {
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      return res
        .status(404)
        .json({ error: `Guild ${guildId} not found` });
    }

    // Category check
    const parentChannel = guild.channels.cache.get(categoryId);
    if (!parentChannel || parentChannel.type !== 4) {
      return res
        .status(400)
        .json({ error: "Category not found or invalid type" });
    }

    // => type: 2 => GUILD_VOICE
    const newChannel = await guild.channels.create({
      name: channelName,
      type: 2,
      parent: parentChannel.id,
    });

    const discordChannelId = newChannel.id;

    // (A) Permissions mit der Kategorie syncen
    await newChannel.lockPermissions();
    logger.info(`[Bot] lockPermissions => VoiceChannel ${discordChannelId} synced with parent`);

    logger.info(`[Bot] Created VoiceChannel: id=${discordChannelId} name=${channelName}`);

    return res.json({ ok: true, discordChannelId });
  } catch (err) {
    logger.error("[Bot] createVoiceChannelInDiscord Error:", err);
    return res
      .status(500)
      .json({ error: "Bot create channel error" });
  }
});

/**
 * DELETE /discord/voice-channels/:discordChannelId
 * => Löscht Voice-Kanal in Discord
 */
voiceChannelsRouter.delete("/:discordChannelId", async (req, res) => {
  const discordChannelId = req.params.discordChannelId;
  if (!discordChannelId) {
    return res
      .status(400)
      .json({ error: "Missing channel ID in URL" });
  }

  try {
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) {
      return res
        .status(404)
        .json({ error: `Guild ${guildId} not found` });
    }

    const channelToRemove = guild.channels.cache.get(discordChannelId);
    if (!channelToRemove) {
      return res
        .status(404)
        .json({ error: `Channel ${discordChannelId} not found in guild` });
    }
    ChannelsDeletedByApi.add(discordChannelId);
    await channelToRemove.delete("API => remove voice channel");
    logger.info(`[Bot] VoiceChannel deleted => ${discordChannelId}`);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[Bot] deleteVoiceChannel Error:", err);
    return res
      .status(500)
      .json({ error: "Bot delete channel error" });
  }
});

+ /**
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
     if (channelToPatch.type !== 2) { // 2 = GUILD_VOICE
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
       if (!newCategory || newCategory.type !== 4) { // 4 = GUILD_CATEGORY
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
 });

  /**
  * DELETE /discord/voice-channels/:discordChannelId
  * => Löscht Voice-Kanal in Discord
  */
 voiceChannelsRouter.delete('/:discordChannelId', async (req, res) => {
   const discordChannelId = req.params.discordChannelId;
   if (!discordChannelId) {
     return res.status(400).json({ error: 'Missing channel ID in URL' });
   }

   try {
     const guildId = process.env.GUILD_ID;
     const guild = client.guilds.cache.get(guildId!);
     if (!guild) {
       return res
         .status(404)
         .json({ error: `Guild ${guildId} not found` });
     }

     const channelToRemove = guild.channels.cache.get(discordChannelId);
     if (!channelToRemove) {
       return res
         .status(404)
         .json({ error: `Channel ${discordChannelId} not found in guild` });
     }

     await channelToRemove.delete('API => remove voice channel');
     console.log(`[Bot] VoiceChannel deleted => ${discordChannelId}`);
     return res.json({ ok: true });
   } catch (err) {
     console.error('[Bot] deleteVoiceChannel Error:', err);
     return res
       .status(500)
       .json({ error: 'Bot delete channel error' });
   }
 });

 /**
  * PATCH /discord/voice-channels/:discordChannelId
  * Body: { newName?: string, newCategoryId?: string }
  * => Ändert einen bestehenden Voice-Kanal in Discord
  */
 voiceChannelsRouter.patch('/:discordChannelId', async (req, res) => {
  const discordChannelId = req.params.discordChannelId;
   if (!discordChannelId) {
     return res.status(400).json({ error: 'Missing channel ID in URL' });
   }

   const { newName, newCategoryId } = req.body;
   if (!newName && !newCategoryId) {
     return res.status(400).json({ error: 'No changes (newName / newCategoryId) provided' });
   }

   try {
     const guildId = process.env.GUILD_ID;
     const guild = client.guilds.cache.get(guildId!);
     if (!guild) {
       return res.status(404).json({ error: `Guild ${guildId} not found` });
     }

     const channelToPatch = guild.channels.cache.get(discordChannelId);
     if (!channelToPatch) {
       return res
         .status(404)
         .json({ error: `Channel ${discordChannelId} not found in guild` });
     }
     // Check: Muss Voice-Kanal sein
     if (channelToPatch.type !== 2) { // 2 = GUILD_VOICE
       return res.status(400).json({ error: 'Channel is not a VoiceChannel' });
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
           error: 'Invalid newCategoryId or not a Category',
         });
       }
       // Re-parent + Lock Permissions
       await channelToPatch.setParent(newCategory.id, { lockPermissions: true });
       console.log(`[Bot] Moved voice channel ${discordChannelId} to category ${newCategoryId}`);
     }

     return res.json({ ok: true });
   } catch (err) {
     console.error('[Bot] patchVoiceChannel error:', err);
     return res.status(500).json({ error: 'Bot patch channel error' });
   }
 });