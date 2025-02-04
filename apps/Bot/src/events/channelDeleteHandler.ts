// apps\Bot\src\events\channelDeleteHandler.ts

import { Channel, ChannelType } from "discord.js";
import axios from "axios";
import logger from "../services/logger";
import { z } from "zod";

/**
 * Called whenever a Discord channel is deleted.
 * Checks if it is a Category and informs the API if so.
 */
export async function channelDeleteHandler(channel: Channel) {
  try {
    // Only proceed if it's a GuildCategory
    if (channel.type !== ChannelType.GuildCategory) {
      return;
    }

    // Validate channelId using Zod
    const channelIdSchema = z.string().min(1);
    const channelId = channelIdSchema.parse(channel.id);

    logger.info(`[channelDeleteHandler] Category ${channelId} was manually deleted.`);

    // Notify the API that this category is deleted
    const apiUrl = process.env.API_URL || "http://localhost:3004";
    const response = await axios.patch(`${apiUrl}/categories/discord-deleted`, {
      discordCategoryId: channelId,
    });

    logger.info(
      `[channelDeleteHandler] Deletion notice sent to API for category ${channelId}. Response:`,
      response.data
    );
  } catch (err) {
    logger.error("[channelDeleteHandler] Error:", err);
  }
}
