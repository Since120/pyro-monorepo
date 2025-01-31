// apps/Bot/src/routes/textChannelsRouter.ts
import { Router } from 'express';
import { client } from '../index';
import { ChannelType, PermissionFlagsBits } from 'discord.js';

export const textChannelsRouter = Router();

/**
 * POST /discord/text-channels
 * Body: { channelName: string, parentCategoryId?: string, private?: boolean }
 * => Erstellt in Discord einen Text-Kanal. Return: { discordChannelId }
 */
textChannelsRouter.post('/', async (req, res) => {
  const { channelName, parentCategoryId, private: isPrivate } = req.body;
  const guildId = process.env.GUILD_ID;
  if (!guildId) {
    return res.status(500).json({ error: 'No GUILD_ID in env' });
  }
  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    return res.status(404).json({ error: `Guild ${guildId} not found` });
  }

  try {
    const createdChannel = await guild.channels.create({
      name: channelName || 'TEXT-CHANNEL',
      type: ChannelType.GuildText,
      parent: parentCategoryId || undefined,
      reason: 'Automatisch via Setup',
    });

    // Falls "private: true" => Overwrites
    if (isPrivate) {
      // Standard: @everyone => deny ViewChannel
      await createdChannel.permissionOverwrites.edit(guild.roles.everyone, {
        ViewChannel: false,
      });
      // Bsp: Du könntest hier auch Admin-Rolle zulassen
      // await createdChannel.permissionOverwrites.edit('1234567890', {
      //   ViewChannel: true,
      // });
    }

    return res.json({
      discordChannelId: createdChannel.id,
    });
  } catch (err) {
    console.error('Error creating text channel:', err);
    return res.status(500).json({ error: 'Bot error creating channel' });
  }
});

+/**
+ * DELETE /discord/text-channels/:channelId
+ * => Löscht einen TextChannel
+ */
textChannelsRouter.delete('/:channelId', async (req, res) => {
    const { channelId } = req.params;
    if (!channelId) {
      return res.status(400).json({ error: 'Missing channel ID' });
    }
    try {
      const guildId = process.env.GUILD_ID;
      const guild = client.guilds.cache.get(guildId!);
      if (!guild) {
        return res.status(404).json({ error: `Guild ${guildId} not found` });
      }
      const channelToRemove = guild.channels.cache.get(channelId);
      if (!channelToRemove) {
        return res.status(404).json({ error: `Channel ${channelId} not found in guild` });
      }
      if (channelToRemove.type !== ChannelType.GuildText) {
        return res.status(400).json({ error: 'Channel is not a TextChannel' });
      }
      await channelToRemove.delete('API => remove text channel');
      console.log(`[Bot] TextChannel deleted => ${channelId}`);
      return res.json({ ok: true });
    } catch (err) {
      console.error('Error deleting text channel:', err);
      return res.status(500).json({ error: 'Bot textChannel deletion error' });
    }
  });