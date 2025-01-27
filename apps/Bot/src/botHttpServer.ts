// apps/Bot/src/botHttpServer.ts

import express from "express";
import logger from "./services/logger";
import {
  createDiscordCategory,
  renameDiscordCategory,
  removeDiscordCategory
} from "./services/discordCategorySync";
import { client } from "./index"; // Beispiel: Pfad anpassen

/**
 * Startet einen kleinen HTTP-Server im Bot,
 * damit die API gezielt Discord-Aktionen auslösen kann.
 */
export function startBotHttpServer() {
  const app = express();
  app.use(express.json());

  /**
   * POST /discord/categories
   * { id: string, name: string }
   * => Erstellt eine neue Kategorie im Discord
   * => Gibt Channel-Id zurück im Feld discordChannelId
   */
  app.post("/discord/categories", async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
          return res.status(400).json({ error: "Missing 'name' in body" });
        }

      // NEU: Der Bot selbst speichert NICHTS in DB, er legt nur in Discord an.
      const discordChannelId = await createDiscordCategory(name);

      // => Bot schickt channelId zurück an die API
      return res.status(200).json({
        ok: true,
        discordChannelId
      });
    } catch (err) {
      logger.error("[Bot] createDiscordCategory Error:", err);
      return res.status(500).json({ error: "Internal Bot Error" });
    }
  });

  /**
   * PATCH /discord/categories
   * { id: string, newName: string }
   * => Benennt eine vorhandene Kategorie um
   */
  app.patch("/discord/categories", async (req, res) => {
    try {
      const { id, newName } = req.body;
      if (!id || !newName) {
        return res.status(400).json({ error: "Missing 'id' or 'newName' in body" });
      }
      logger.info(`[Bot] (PATCH) -> renameDiscordCategory => ID=${id}, newName="${newName}"`);

      // Der Bot erwartet, dass id = DiscordChannelId ist! (s. u.)
      await renameDiscordCategory(id, newName);

      return res.status(200).json({ ok: true });
    } catch (err) {
      logger.error("[Bot] renameDiscordCategory Error:", err);
      return res.status(500).json({ error: "Internal Bot Error" });
    }
  });

  /**
   * DELETE /discord/categories/:discordId
   * => Entfernt die Kategorie in Discord
   */
  app.delete("/discord/categories/:discordId", async (req, res) => {
    try {
      const discordId = req.params.discordId;
      if (!discordId) {
        return res.status(400).json({ error: "Missing 'discordId' in URL" });
      }
      logger.info(`[Bot] (DELETE) -> removeDiscordCategory => discordId=${discordId}`);

      await removeDiscordCategory(discordId);

      return res.status(200).json({ ok: true });
    } catch (err) {
      logger.error("[Bot] removeDiscordCategory Error:", err);
      return res.status(500).json({ error: "Internal Bot Error" });
    }
  });

  app.get("/discord/roles", async (req, res) => {
    try {
      const guildId = process.env.GUILD_ID;
      if (!guildId) {
        return res.status(400).json({ error: "GUILD_ID missing in .env" });
      }

      // Gilde aus dem Bot-Cache holen:
      const guild = client.guilds.cache.get(guildId);
      if (!guild) {
        return res.status(404).json({ error: `Guild ${guildId} not found` });
      }

      // Typisieren: "r: any" oder (besser) "r: Role" aus discord.js
      const roles = guild.roles.cache.map((r: any) => ({
        id: r.id,
        name: r.name,
        color: r.hexColor,
        position: r.position,
      }));

      return res.json({ roles });
    } catch (err) {
      logger.error("GET /discord/roles Error:", err);
      return res.status(500).json({ error: "Internal Bot Error" });
    }
  });

  // Server starten
  const port = process.env.BOT_HTTP_PORT || 3002;
  app.listen(port, () => {
    logger.info(`[Bot] HTTP-Server läuft auf Port ${port}`);
  });
}