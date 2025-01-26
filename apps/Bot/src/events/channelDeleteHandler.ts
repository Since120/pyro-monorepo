// KOMPLETTE Datei: apps/Bot/src/events/channelDeleteHandler.ts

import { Channel, ChannelType } from "discord.js";
import logger from "../services/logger";
import axios from "axios";

/**
 * Wird aufgerufen, sobald im Discord ein Channel gelöscht wird.
 * Prüfe, ob es sich um eine Kategorie handelt, und informiere ggf. die API.
 */
export async function channelDeleteHandler(channel: Channel) {
  try {
    // Nur weiter, wenn es eine Category ist
    if (channel.type !== ChannelType.GuildCategory) {
      return;
    }

    const channelId = channel.id; // Discord-Kanal-ID
    logger.info(`[Bot] channelDelete: Category ${channelId} wurde manuell gelöscht.`);

    // Der Bot sagt der API: "Channel X ist gelöscht" => wir nutzen dasselbe Feld `discordCategoryId`
    const apiUrl = process.env.API_URL || "http://localhost:3004";
    const response = await axios.patch(`${apiUrl}/categories/discord-deleted`, {
      // Sende dem API-Endpoint `discordCategoryId`
      discordCategoryId: channelId,
    });

    logger.info(
      `[Bot] Meldung an API gesendet: Category ${channelId} gelöscht. Antwort:`,
      response.data
    );
  } catch (err) {
    logger.error("[Bot] Fehler in channelDeleteHandler:", err);
  }
}
