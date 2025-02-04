// apps\Bot\src\routes\categoriesRouter.ts

import { Router } from "express";
import logger from "../services/logger";
import {
  createDiscordCategory,
  renameDiscordCategory,
  removeDiscordCategory,
} from "../services/discordCategorySync";
import { z } from "zod";

export const categoriesRouter = Router();

/**
 * POST /discord/categories
 * Creates a new category in Discord.
 */
categoriesRouter.post("/", async (req, res) => {
  // Zod schema for the request body
  const createCategorySchema = z.object({
    name: z.string().min(1),
    isVisible: z.boolean().optional(),
    allowedRoles: z.array(z.string()).optional(),
  });

  const parseResult = createCategorySchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[categoriesRouter] POST => invalid request body for category creation.");
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { name, isVisible, allowedRoles } = parseResult.data;

  try {
    const discordChannelId = await createDiscordCategory(name, isVisible, allowedRoles);
    return res.json({ ok: true, discordChannelId });
  } catch (err) {
    logger.error("[categoriesRouter] createDiscordCategory error:", err);
    return res.status(500).json({ error: "Internal Bot Error" });
  }
});

/**
 * PATCH /discord/categories
 * Renames an existing category in Discord.
 * Body: { id, newName, isVisible?, allowedRoles? }
 */
categoriesRouter.patch("/", async (req, res) => {
  // Zod schema for the patch request
  const patchCategorySchema = z.object({
    id: z.string().min(1),
    newName: z.string().min(1),
    isVisible: z.boolean().optional(),
    allowedRoles: z.array(z.string()).optional(),
  });

  const parseResult = patchCategorySchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[categoriesRouter] PATCH => invalid request body for category update.");
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { id, newName, isVisible, allowedRoles } = parseResult.data;

  try {
    await renameDiscordCategory(id, newName, isVisible, allowedRoles);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[categoriesRouter] renameDiscordCategory error:", err);
    return res.status(500).json({ error: "Internal Bot Error" });
  }
});

/**
 * DELETE /discord/categories/:discordId
 * Deletes a category in Discord.
 */
categoriesRouter.delete("/:discordId", async (req, res) => {
  const discordId = req.params.discordId;
  if (!discordId) {
    return res.status(400).json({ error: "Missing 'discordId' in URL" });
  }

  try {
    await removeDiscordCategory(discordId);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[categoriesRouter] removeDiscordCategory error:", err);
    return res.status(500).json({ error: "Internal Bot Error" });
  }
});
