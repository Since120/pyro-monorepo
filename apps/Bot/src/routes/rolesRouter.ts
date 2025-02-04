// apps/Bot/src/routes/rolesRouter.ts

import { Router } from "express";
import { DiscordAPIError } from "discord.js"; // <-- Neu für Error-Handling
import logger from "../services/logger";
import { client } from "../index";
import { z } from "zod";

export const rolesRouter = Router();

/**
 * GET /discord/roles
 * Returns all roles in the guild.
 */
rolesRouter.get("/", async (req, res) => {
  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      logger.error("[rolesRouter] GUILD_ID missing in .env");
      return res.status(400).json({ error: "GUILD_ID missing in .env" });
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      logger.warn(`[rolesRouter] Guild ${guildId} not found`);
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    const roles = guild.roles.cache.map((r) => ({
      id: r.id,
      name: r.name,
      color: r.hexColor,
      position: r.position,
    }));
    logger.info(`[rolesRouter] Found ${roles.length} roles in guild ${guildId}`);
    return res.json({ roles });
  } catch (err) {
    logger.error("[rolesRouter] GET /discord/roles error:", err);
    return res.status(500).json({ error: "Internal Bot Error" });
  }
});

/**
 * POST /discord/roles/assign
 * Assigns a role to a user.
 */
rolesRouter.post("/assign", async (req, res) => {
  const assignRoleSchema = z.object({
    userId: z.string().min(1),
    roleId: z.string().min(1),
  });

  const parseResult = assignRoleSchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[rolesRouter] POST /assign => invalid request body.");
    return res.status(400).json({ error: "Missing userId or roleId" });
  }
  const { userId, roleId } = parseResult.data;

  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      return res.status(400).json({ error: "GUILD_ID missing in .env" });
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const role = await guild.roles.fetch(roleId);
    if (!role) {
      return res.status(404).json({ error: "Role not found" });
    }
    const member = await guild.members.fetch(userId);
    if (!member) {
      return res.status(404).json({ error: "User not found in guild" });
    }

    // Verwenden wir (err: unknown) und einen Type-Check
    await member.roles.add(role).catch((err: unknown) => {
      // Hier kommt oft eine DiscordAPIError bei "Unknown Role"
      if (err instanceof DiscordAPIError && err.code === 10011) {
        // 10011 = 'Unknown Role' error code
        logger.warn("[rolesRouter] Unknown Role - ignoring error 10011");
        return;
      }
      throw err;
    });

    logger.info(`[rolesRouter] Assigned role ${roleId} to user ${userId}`);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[rolesRouter] POST /assign => Error:", err);
    return res.status(500).json({ error: "Failed to assign role" });
  }
});

/**
 * POST /discord/roles/remove
 * Removes a role from a user.
 */
rolesRouter.post("/remove", async (req, res) => {
  const removeRoleSchema = z.object({
    userId: z.string().min(1),
    roleId: z.string().min(1),
  });

  const parseResult = removeRoleSchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[rolesRouter] POST /remove => invalid request body.");
    return res.status(400).json({ error: "Missing userId or roleId" });
  }
  const { userId, roleId } = parseResult.data;

  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      return res.status(400).json({ error: "GUILD_ID missing in .env" });
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: "Guild not found" });
    }
    const member = await guild.members.fetch(userId);
    if (!member) {
      return res.status(404).json({ error: "User not found in guild" });
    }

    await member.roles.remove(roleId).catch((err: unknown) => {
      // Falls 'remove' ebenfalls "Unknown Role" wirft, code=10011 => abfangen:
      if (err instanceof DiscordAPIError && err.code === 10011) {
        logger.warn("[rolesRouter] Unknown Role - ignoring error code=10011 on remove");
        return;
      }
      throw err;
    });

    logger.info(`[rolesRouter] Removed role ${roleId} from user ${userId}`);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[rolesRouter] POST /remove => Error:", err);
    return res.status(500).json({ error: "Failed to remove role" });
  }
});

/**
 * POST /discord/roles/create-dvc-role
 * Creates a new role for DynamicVoiceChannel usage.
 */
rolesRouter.post("/create-dvc-role", async (req, res) => {
  const createDvcRoleSchema = z.object({
    roleName: z.string().min(1),
  });
  const parseResult = createDvcRoleSchema.safeParse(req.body);
  if (!parseResult.success) {
    logger.warn("[rolesRouter] POST /create-dvc-role => invalid request body.");
    return res.status(400).json({ error: "Missing or invalid roleName" });
  }

  const { roleName } = parseResult.data;
  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      return res.status(400).json({ error: "GUILD_ID missing in .env" });
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    const newRole = await guild.roles.create({
      name: roleName,
      reason: "Main role for DynamicVoiceChannel",
    });
    logger.info(`[rolesRouter] Created DVC role ${newRole.id} with name=${roleName}`);
    return res.json({ ok: true, roleId: newRole.id });
  } catch (err) {
    logger.error("[rolesRouter] POST /create-dvc-role => Error:", err);
    return res.status(500).json({ error: "Failed to create main DVC role" });
  }
});

/**
 * DELETE /discord/roles/:roleId
 * Completely removes a role from the guild.
 */
rolesRouter.delete("/:roleId", async (req, res) => {
  const roleId = req.params.roleId;
  if (!roleId) {
    return res.status(400).json({ error: "Missing roleId" });
  }

  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) {
      return res.status(400).json({ error: "GUILD_ID missing in .env" });
    }
    const guild = client.guilds.cache.get(guildId);
    if (!guild) {
      return res.status(404).json({ error: `Guild ${guildId} not found` });
    }

    const role = await guild.roles.fetch(roleId);
    if (!role) {
      return res.status(404).json({ error: `Role ${roleId} not found in guild` });
    }
    await role.delete("remove DVC role completely");
    logger.info(`[rolesRouter] Deleted role=${roleId}`);
    return res.json({ ok: true });
  } catch (err) {
    logger.error("[rolesRouter] DELETE /:roleId => Error:", err);
    return res.status(500).json({ error: "Bot error deleting role" });
  }
});

export default rolesRouter;
