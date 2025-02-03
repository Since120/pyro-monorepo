// apps/Bot/src/services/discordCategorySync.ts

import { client } from "../index";
import { ChannelType, GuildChannel, PermissionFlagsBits } from "discord.js";
import { Collection, Snowflake, VoiceChannel } from "discord.js";
import logger from "./logger";

/**
 * Legt in Discord eine neue Kategorie an.
 * Return: die erstellte channelId (discordCategoryId).
 */
export async function createDiscordCategory(
  name: string,
  isVisible?: boolean,
  allowedRoles?: string[]
): Promise<string> {
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
      reason: "Automatisch via API->Bot",
    });

    logger.info(`createDiscordCategory: Channel "${created.name}" erstellt (ID=${created.id}).`);

    // (A) Wir erstellen ein Array ALLER gewünschten Overwrites
    const overwrites = [];
    const everyone = guild.roles.everyone;
    const isCatVisible = isVisible ?? true; // Falls undefined => true

    if (isCatVisible) {
      // isVisible=true => @everyone: ViewChannel = true
      overwrites.push({
        id: everyone.id,
        allow: [PermissionFlagsBits.ViewChannel],
      });
    } else {
      // isVisible=false => @everyone: ViewChannel = false
      overwrites.push({
        id: everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
      });
      // allowedRoles => ViewChannel=true
      for (const roleId of allowedRoles ?? []) {
        if (roleId === everyone.id) continue;
        overwrites.push({
          id: roleId,
          allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
        });
      }
    }

    // (B) Einmaliges Setzen => Alle Overwrites in einem Rutsch
    await created.permissionOverwrites.set(overwrites, "Initial Overwrites");
    logger.info(`createDiscordCategory: Overwrites gesetzt für Channel ${created.id}`);

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
export async function renameDiscordCategory(
  channelId: string,
  newName: string,
  isVisible?: boolean,
  allowedRoles?: string[]
): Promise<void> {
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

    // 2) Falls isVisible / allowedRoles => neu in EINEM Rutsch setzen
    if (isVisible !== undefined) {
      const overwritesArray = [];
      const everyoneRole = guild.roles.everyone;
      const catVisible = isVisible; // bool

      if (catVisible) {
        // => @everyone: ViewChannel => true
        overwritesArray.push({
          id: everyoneRole.id,
          allow: [PermissionFlagsBits.ViewChannel],
        });
      } else {
        // => @everyone: ViewChannel => false
        overwritesArray.push({
          id: everyoneRole.id,
          deny: [PermissionFlagsBits.ViewChannel],
        });
        // => allowedRoles => ViewChannel => true
        for (const rId of allowedRoles ?? []) {
          if (rId === everyoneRole.id) continue;
          overwritesArray.push({
            id: rId,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.Connect],
          });
        }
      }

      // (C) Einmaliges Setzen => vorhandene Overwrites werden entfernt
      await channel.permissionOverwrites.set(overwritesArray, "Sync Overwrites rename");
      logger.info(`renameDiscordCategory: Overwrites neu gesetzt => #${channel.id}`);
    }
    // (B) NEU: VoiceChannels via Type Guard filtern => c is VoiceChannel
    const childVoiceChannels = guild.channels.cache.filter(
      (c): c is VoiceChannel => c.parentId === channel.id && c.type === ChannelType.GuildVoice
    );

    // (C) lockPermissions() auf jeden VoiceChannel anwenden
    for (const [id, vc] of childVoiceChannels) {
      try {
        await vc.lockPermissions();
        logger.info(
          `renameDiscordCategory: VoiceChannel #${vc.id} => lockPermissions() => synced to category #${channel.id}`
        );
      } catch (err) {
        logger.warn(`renameDiscordCategory: lockPermissions fehlgeschlagen für #${vc.id}`, err);
      }
    }
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
