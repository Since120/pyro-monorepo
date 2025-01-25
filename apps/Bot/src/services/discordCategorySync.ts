// src/services/discordCategorySync.ts
import { prisma } from './dbClient';
import { client } from '../index'; // dein Discord Client
import { ChannelType, GuildChannel } from 'discord.js';
import logger from './logger';

/**
 * Legt in Discord eine neue Kategorie an und speichert deren ID in der DB.
 * - categoryId: DB-ID der Category
 * - name: Name (z.B. "═══ VOICE 🔊 ═══════════")
 */
export async function createDiscordCategory(categoryId: string, name: string): Promise<void> {
  try {
    // 1) Such dir das Guild-Objekt (per ID in .env)
    const guildId = process.env.GUILD_ID; 
    if (!guildId) {
      logger.warn('createDiscordCategory: Keine DISCORD_GUILD_ID in .env definiert!');
      return;
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`createDiscordCategory: Guild ${guildId} nicht gefunden.`);
      return;
    }

    // 2) Discord-Category anlegen
    const created = await guild.channels.create({
      name: name,
      type: ChannelType.GuildCategory,
      reason: 'Automatische Erstellung via Webhook',
    });

    // 3) In DB: discordCategoryId eintragen
    await prisma.category.update({
      where: { id: categoryId },
      data: { discordCategoryId: created.id },
    });

    logger.info(`createDiscordCategory: Category "${name}" in Discord erstellt (ID=${created.id}).`);
  } catch (err) {
    logger.error('createDiscordCategory Fehler:', err);
  }
}

/**
 * Aktualisiert den Namen in Discord, basierend auf existingCategory.discordCategoryId
 */
export async function updateDiscordCategory(categoryId: string, name: string): Promise<void> {
  try {
    // 1) DB => Hol dir das Feld discordCategoryId
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      logger.warn(`updateDiscordCategory: CategoryId=${categoryId} nicht gefunden.`);
      return;
    }
    if (!cat.discordCategoryId) {
      // => es gibt noch keinen Discord-Kanal => evtl. anlegen?
      logger.info(`updateDiscordCategory: Keine discordCategoryId => wir legen neu an.`);
      return createDiscordCategory(categoryId, name);
    }

    // 2) Discord-Kanal suchen
    const guildId = process.env.GUILD_ID;
    if (!guildId) return;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`updateDiscordCategory: Guild ${guildId} nicht gefunden.`);
      return;
    }

    const channel = guild.channels.cache.get(cat.discordCategoryId) as GuildChannel | undefined;
    if (!channel) {
      logger.warn(`updateDiscordCategory: Channel ${cat.discordCategoryId} nicht im Cache gefunden. Evtl. neu anlegen?`);
      // Du könntest hier createDiscordCategory(categoryId, name) aufrufen. 
      return;
    }

    // 3) Rename
    await channel.setName(name);
    logger.info(`updateDiscordCategory: Channel ${channel.id} umbenannt zu "${name}".`);
  } catch (err) {
    logger.error('updateDiscordCategory Fehler:', err);
  }
}

/**
 * Löscht die zugeordnete Discord-Kategorie
 * und setzt discordCategoryId = null in DB.
 */
export async function deleteDiscordCategory(categoryId: string): Promise<void> {
  try {
    // 1) DB => find
    const cat = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!cat) {
      logger.warn(`deleteDiscordCategory: CategoryId=${categoryId} nicht gefunden.`);
      return;
    }

    if (!cat.discordCategoryId) {
      logger.info(`deleteDiscordCategory: Keine discordCategoryId => nix zu löschen in Discord.`);
      return;
    }

    // 2) Channel in Discord suchen
    const guildId = process.env.GUILD_ID;
    if (!guildId) return;
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`deleteDiscordCategory: Guild ${guildId} nicht gefunden.`);
      return;
    }

    const channel = guild.channels.cache.get(cat.discordCategoryId);
    if (!channel) {
      logger.warn(`deleteDiscordCategory: Channel ${cat.discordCategoryId} nicht (mehr) gefunden, ignoriere...`);
    } else {
      await channel.delete('Automatische Löschung via Webhook');
      logger.info(`deleteDiscordCategory: Channel ${cat.discordCategoryId} gelöscht.`);
    }

    // 3) DB updaten
    await prisma.category.update({
      where: { id: categoryId },
      data: { discordCategoryId: null },
    });
  } catch (err) {
    logger.error('deleteDiscordCategory Fehler:', err);
  }
}
