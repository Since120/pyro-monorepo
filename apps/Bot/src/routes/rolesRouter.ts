// Pfad: apps/Bot/src/routes/rolesRouter.ts
import { Router } from "express";
import logger from "../services/logger";
import { client } from "../index";

export const rolesRouter = Router();

/**
 * GET /discord/roles
 * Liefert alle Rollen
 */
rolesRouter.get("/", async (req, res) => {
  try {
    const guildId = process.env.GUILD_ID;
    if (!guildId) return res.status(400).json({ error: "GUILD_ID missing in .env" });
    const guild = client.guilds.cache.get(guildId);
    if (!guild) return res.status(404).json({ error: `Guild ${guildId} not found` });
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

/**
 * POST /discord/roles/assign
 * Weist einem User eine Rolle zu, nachdem überprüft wurde, ob sie existiert.
 */
rolesRouter.post("/assign", async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    if (!userId || !roleId) return res.status(400).json({ error: "Missing userId or roleId" });
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) return res.status(404).json({ error: "Guild not found" });
    // Stelle sicher, dass die Rolle existiert
    const role = await guild.roles.fetch(roleId);
    if (!role) return res.status(404).json({ error: "Role not found" });
    const member = await guild.members.fetch(userId);
    if (!member) return res.status(404).json({ error: "User not found in guild" });
    await member.roles.add(role).catch((err: any) => {
      // Falls Discord meldet, dass die Rolle unbekannt ist, ignoriere den Fehler.
      if (err.code === 10011) {
        logger.warn("[roles/assign] Unknown Role – Fehler ignoriert.");
        return;
      }
      throw err;
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[roles/assign] =>", err);
    return res.status(500).json({ error: "Failed to assign role" });
  }
});

/**
 * POST /discord/roles/remove
 * Entfernt einem User eine Rolle – falls die Rolle nicht mehr existiert, wird der Fehler ignoriert.
 */
rolesRouter.post("/remove", async (req, res) => {
  try {
    const { userId, roleId } = req.body;
    if (!userId || !roleId) return res.status(400).json({ error: "Missing userId or roleId" });
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) return res.status(404).json({ error: "Guild not found" });
    const member = await guild.members.fetch(userId);
    if (!member) return res.status(404).json({ error: "User not found in guild" });
    await member.roles.remove(roleId).catch((err: any) => {
      if (err.response && err.response.status === 404) {
        logger.warn("[roles/remove] Unknown Role – Fehler ignoriert.");
        return;
      }
      throw err;
    });
    return res.json({ ok: true });
  } catch (err) {
    console.error("[roles/remove] =>", err);
    return res.status(500).json({ error: "Failed to remove role" });
  }
});

/**
 * POST /discord/roles/create-dvc-role
 * Erzeugt eine neue dynamische Rolle.
 */
rolesRouter.post("/create-dvc-role", async (req, res) => {
  try {
    const { roleName } = req.body;
    if (!roleName) return res.status(400).json({ error: "Missing roleName" });
    const guildId = process.env.GUILD_ID;
    const guild = client.guilds.cache.get(guildId!);
    if (!guild) return res.status(404).json({ error: `Guild ${guildId} not found` });
    const newRole = await guild.roles.create({
      name: roleName,
      reason: "Hauptrolle für DynamicVoiceChannel",
    });
    return res.json({ ok: true, roleId: newRole.id });
  } catch (err) {
    console.error("[create-dvc-role] =>", err);
    return res.status(500).json({ error: "Failed to create main DVC role" });
  }
});

rolesRouter.delete("/:roleId", async (req, res) => {
  const { roleId } = req.params;
  if (!roleId) {
    return res.status(400).json({ error: "Missing roleId" });
  }
  const guildId = process.env.GUILD_ID;
  const guild = client.guilds.cache.get(guildId!);
  if (!guild) {
    return res.status(404).json({ error: `Guild ${guildId} not found` });
  }
  try {
    const role = await guild.roles.fetch(roleId);
    if (!role) {
      return res.status(404).json({ error: `Role ${roleId} not found in guild` });
    }
    await role.delete("remove DVC role completely");
    return res.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete role:", err);
    return res.status(500).json({ error: "Bot error deleting role" });
  }
});

export default rolesRouter;
