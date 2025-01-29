// apps/Bot/src/routes/rolesRouter.ts

import { Router } from "express";
import logger from "../services/logger";
import { client } from "../index";

export const rolesRouter = Router();

/**
 * GET /discord/roles
 * => Liefert alle Rollen
 */
rolesRouter.get("/", async (req, res) => {
  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      return res
        .status(400)
        .json({ error: "GUILD_ID missing in .env" });
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res
        .status(404)
        .json({ error: `Guild ${guildId} not found` });
    }

    const roles = guild.roles.cache.map((r: any) => ({
      id: r.id,
      name: r.name,
      color: r.hexColor,
      position: r.position,
    }));
    return res.json({ roles });
  } catch (err) {
    logger.error("GET /discord/roles Error:", err);
    return res
      .status(500)
      .json({ error: "Internal Bot Error" });
  }
});
