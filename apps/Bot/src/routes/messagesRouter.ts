// apps/Bot/src/routes/messagesRouter.ts
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

export const messagesRouter = Router();

// Definiere ein Interface für das Request-Body
interface MessageRequestBody {
  channelId: string;
  embed?: {
    title?: string;
    description?: string;
    // ...etc. Falls du noch mehr Felder brauchst
  };
  components?: Array<{
    type: "button";
    label?: string;
    style?: "primary" | "danger" | "success" | "secondary" | "link";
    customId?: string;
  }>;
  content?: string;
}

/**
 * POST /discord/messages
 */
messagesRouter.post(
  "/",
  async (req: Request<unknown, unknown, MessageRequestBody>, res: Response) => {
    const { channelId, embed, components, content } = req.body;

    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      return res.status(500).json({ error: "No GUILD_ID in env" });
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    // Kanal abfragen
    const channel = guild.channels.cache.get(channelId);
    if (!channel) {
      return res.status(404).json({ error: `Channel ${channelId} not found in guild` });
    }
    if (channel.type !== ChannelType.GuildText) {
      return res.status(400).json({ error: "Channel is not a text channel" });
    }

    // Embed bauen
    let embedBuilder: EmbedBuilder | null = null;
    if (embed) {
      embedBuilder = new EmbedBuilder()
        .setTitle(embed.title || "Info")
        .setDescription(embed.description || "")
        .setColor(0x007fff);
    }

    // Buttons bauen
    const rows = [];
    if (components && components.length > 0) {
      // Nur 1 Row als Beispiel
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
        // Falls du später SelectMenus etc. hast, hier erweitern
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

      return res.json({ messageId: msg.id });
    } catch (err) {
      console.error("Error sending message:", err);
      return res.status(500).json({ error: "Bot error sending message" });
    }
  }
);

/** Hilfsfunktion, um Button-Styles zu mappen */
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
