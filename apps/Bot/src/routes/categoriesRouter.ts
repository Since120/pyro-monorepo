// apps/Bot/src/routes/categoriesRouter.ts

import { Router } from "express";
import logger from "../services/logger";
import {
  createDiscordCategory,
  renameDiscordCategory,
  removeDiscordCategory,
} from "../services/discordCategorySync";

export const categoriesRouter = Router();

/**
 * POST /discord/categories
 * => Erstellt in Discord eine Kategorie
 */
categoriesRouter.post("/", async (req, res) => {
  try {
    const { name, isVisible, allowedRoles } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Missing 'name' in body" });
    }

    const discordChannelId = await createDiscordCategory(name, isVisible, allowedRoles);
    return res.json({ ok: true, discordChannelId });
  } catch (err) {
    logger.error("[Bot] createDiscordCategory Error:", err);
    return res.status(500).json({ error: "Internal Bot Error" });
  }
});

/**
 * PATCH /discord/categories
 * => Umbennen einer vorhandenen Kategorie
 * Body: { id, newName }
 */
categoriesRouter.patch("/", async (req, res) => {
  try {
    const { id, newName, isVisible, allowedRoles } = req.body;
    if (!id || !newName) {
      return res
        .status(400)
        .json({ error: "Missing 'id' or 'newName' in body" });
    }
    await renameDiscordCategory(id, newName, isVisible, allowedRoles);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[Bot] renameDiscordCategory Error:", err);
    return res.status(500).json({ error: "Internal Bot Error" });
  }
});

/**
 * DELETE /discord/categories/:discordId
 * => Löscht die Kategorie in Discord
 */
categoriesRouter.delete("/:discordId", async (req, res) => {
  try {
    const { discordId } = req.params;
    if (!discordId) {
      return res
        .status(400)
        .json({ error: "Missing 'discordId' in URL" });
    }
    await removeDiscordCategory(discordId);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[Bot] removeDiscordCategory Error:", err);
    return res.status(500).json({ error: "Internal Bot Error" });
  }
});
