// apps/Bot/src/services/discordCategorySync.ts

import { client } from "../index";
import { ChannelType, GuildChannel } from "discord.js";
import logger from "./logger";

/**
 * Legt in Discord eine neue Kategorie an.
 * Return: die erstellte channelId (discordCategoryId).
 */
export async function createDiscordCategory(name: string): Promise<string> {
  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      logger.warn("createDiscordCategory: Keine GUILD_ID in .env definiert!");
      return "";
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`createDiscordCategory: Guild ${guildId} nicht gefunden.`);
      return "";
    }

    const created = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      reason: "Automatisch via API->Bot"
    });

    logger.info(`createDiscordCategory: Channel "${created.name}" erstellt (ID=${created.id}).`);
    return created.id;
  } catch (err) {
    logger.error("createDiscordCategory Fehler:", err);
    return "";
  }
}

/**
 * Benennt eine existierende Discord-Kategorie (Channel) um.
 * channelId => die Discord channel id
 */
export async function renameDiscordCategory(channelId: string, newName: string): Promise<void> {
  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      logger.warn("renameDiscordCategory: Keine GUILD_ID in .env");
      return;
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`renameDiscordCategory: Guild ${guildId} nicht gefunden.`);
      return;
    }

    const channel = guild.channels.cache.get(channelId) as GuildChannel | undefined;
    if (!channel) {
      logger.warn(`renameDiscordCategory: Channel ${channelId} nicht gefunden!`);
      return;
    }

    await channel.setName(newName);
    logger.info(`renameDiscordCategory: Channel ${channel.id} umbenannt zu "${newName}".`);
  } catch (err) {
    logger.error("renameDiscordCategory Fehler:", err);
  }
}

/**
 * Löscht einen Channel in Discord.
 * channelId => discordChannelId
 */
export async function removeDiscordCategory(channelId: string): Promise<void> {
  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      logger.warn("removeDiscordCategory: Keine GUILD_ID in .env");
      return;
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`removeDiscordCategory: Guild ${guildId} nicht gefunden.`);
      return;
    }

    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
      logger.warn(`removeDiscordCategory: Channel ${channelId} nicht (mehr) gefunden.`);
      return;
    }

    await channel.delete("Automatische Löschung via API->Bot");
    logger.info(`removeDiscordCategory: Channel ${channelId} gelöscht.`);
  } catch (err) {
    logger.error("removeDiscordCategory Fehler:", err);
  }
}
