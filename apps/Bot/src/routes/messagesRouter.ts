// apps\Bot\src\routes\messagesRouter.ts

import { Router, Request, Response } from "express";
import { client } from "../index";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import { z } from "zod";
import logger from "../services/logger";

export const messagesRouter = Router();

/**
 * POST /discord/messages
 * Sends a message (possibly with embed or buttons) to the specified channel.
 */

// Define Zod schemas for the incoming body
const buttonSchema = z.object({
  type: z.literal("button"),
  label: z.string().optional(),
  style: z.enum(["primary", "danger", "success", "secondary", "link"]).optional(),
  customId: z.string().optional(),
});
const messageRequestBodySchema = z.object({
  channelId: z.string().min(1),
  embed: z
    .object({
      title: z.string().optional(),
      description: z.string().optional(),
    })
    .optional(),
  components: z.array(buttonSchema).optional(),
  content: z.string().optional(),
});

messagesRouter.post("/", async (req: Request, res: Response) => {
  const parseResult = messageRequestBodySchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[messagesRouter] POST => invalid request body for sending message.");
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { channelId, embed, components, content } = parseResult.data;
  const guildId = process.env.GUILD_ID;
  if (!guildId) {
    logger.error("[messagesRouter] Missing GUILD_ID in environment variables.");
    return res.status(500).json({ error: "No GUILD_ID in env" });
  }

  const guild = client.guilds.cache.get(guildId);
  if (!guild) {
    logger.warn(`[messagesRouter] Guild ${guildId} not found.`);
    return res.status(404).json({ error: `Guild ${guildId} not found` });
  }

  // Fetch the channel
  const channel = guild.channels.cache.get(channelId);
  if (!channel) {
    logger.warn(`[messagesRouter] Channel ${channelId} not found in guild.`);
    return res.status(404).json({ error: `Channel ${channelId} not found in guild` });
  }
  if (channel.type !== ChannelType.GuildText) {
    return res.status(400).json({ error: "Channel is not a text channel" });
  }

  // Build the embed
  let embedBuilder: EmbedBuilder | null = null;
  if (embed) {
    embedBuilder = new EmbedBuilder()
      .setTitle(embed.title || "Info")
      .setDescription(embed.description || "")
      .setColor(0x007fff);
  }

  // Build buttons
  const rows = [];
  if (components && components.length > 0) {
    const row = new ActionRowBuilder<ButtonBuilder>();
    components.forEach((c) => {
      if (c.type === "button") {
        const btnStyle = mapButtonStyle(c.style);
        const btn = new ButtonBuilder()
          .setLabel(c.label || "Button")
          .setStyle(btnStyle)
          .setCustomId(c.customId || "btn:default");
        row.addComponents(btn);
      }
    });
    rows.push(row);
  }

  try {
    const textChannel = channel as TextChannel;
    const msg = await textChannel.send({
      content: content || undefined,
      embeds: embedBuilder ? [embedBuilder] : [],
      components: rows,
    });

    logger.info(`[messagesRouter] Message sent to channel ${channelId}, msgId=${msg.id}`);
    return res.json({ messageId: msg.id });
  } catch (err) {
    logger.error("[messagesRouter] Error sending message:", err);
    return res.status(500).json({ error: "Bot error sending message" });
  }
});

/**
 * Helper to map string style to Discord's ButtonStyle
 */
function mapButtonStyle(style?: string) {
  switch (style) {
    case "primary":
      return ButtonStyle.Primary;
    case "success":
      return ButtonStyle.Success;
    case "danger":
      return ButtonStyle.Danger;
    case "secondary":
      return ButtonStyle.Secondary;
    case "link":
      return ButtonStyle.Link;
    default:
      return ButtonStyle.Primary;
  }
}
