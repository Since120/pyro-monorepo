// apps/Bot/src/interaction_handlers/wizard/wizardHelpers.ts

import { ButtonInteraction } from "discord.js";
import axios from "axios";
import logger from "../../services/logger";
import { env } from "../../config";
import { z } from "zod";
import { SetupChannels } from "pyro-prisma";

/**
 * Schema for forcedCategory check via Zod.
 */
const forcedCategorySchema = z.object({
  forcedCategoryId: z.string().min(1),
});

/**
 * Schema for default waiting room check (requires userId + categoryId).
 */
const waitingRoomSchema = z.object({
  userId: z.string().min(1),
  categoryId: z.string().min(1),
});

/**
 * Checks if the user is in the forced waiting room (from the category in the button).
 */
export async function checkWaitingRoomForcedCategory(
  btnInteraction: ButtonInteraction,
  forcedCategoryId: string
): Promise<boolean> {
  // Zod-Check
  forcedCategorySchema.parse({ forcedCategoryId });

  const member = btnInteraction.member;
  if (!member || !("voice" in member) || !member.voice.channelId) {
    await btnInteraction.reply({
      content: "Du musst zuerst einem Voice-Channel beitreten – dem Warteraum!",
      ephemeral: true,
    });
    return false;
  }

  let setupData: SetupChannels | null = null;
  try {
    // ACHTUNG: wir nutzen forcedCategoryId, nicht wizardSession
    const setupResp = await axios.get<SetupChannels>(`${env.API_URL}/setup`, {
      params: { categoryId: forcedCategoryId },
    });
    setupData = setupResp.data;
  } catch (err) {
    logger.error("[checkWaitingRoomForcedCategory] Error fetching setup data:", err);
    await btnInteraction.reply({
      content: "Fehler: Setup-Daten konnten nicht abgerufen werden.",
      ephemeral: true,
    });
    return false;
  }

  if (!setupData || !setupData.voiceChannelId) {
    await btnInteraction.reply({
      content: "Fehler: Für diese Kategorie wurde kein Warteraum eingerichtet.",
      ephemeral: true,
    });
    return false;
  }

  if (member.voice.channelId !== setupData.voiceChannelId) {
    await btnInteraction.reply({
      content: "Du musst zuerst in den richtigen Warteraum-VoiceChannel dieser Kategorie gehen!",
      ephemeral: true,
    });
    return false;
  }

  return true;
}

/**
 * Checks if the user is in the waiting room defined by the wizardSession.categoryId
 */
export async function checkDefaultWaitingRoom(btnInteraction: ButtonInteraction): Promise<boolean> {
  const member = btnInteraction.member;
  if (!member || !("voice" in member) || !member.voice.channelId) {
    await btnInteraction.reply({
      content: "Du musst zuerst einem Voice-Channel beitreten – dem Warteraum!",
      ephemeral: true,
    });
    return false;
  }

  let wizardSession;
  try {
    const sessionResp = await axios.get(`${env.API_URL}/wizard/${btnInteraction.user.id}`);
    wizardSession = sessionResp.data;
  } catch (err) {
    logger.error("[checkDefaultWaitingRoom] Error fetching wizard session:", err);
    await btnInteraction.reply({
      content: "Fehler: Wizard-Session konnte nicht abgerufen werden.",
      ephemeral: true,
    });
    return false;
  }

  if (!wizardSession || !wizardSession.categoryId) {
    await btnInteraction.reply({
      content: "Fehler: Keine Kategorie in deiner Wizard-Session gefunden.",
      ephemeral: true,
    });
    return false;
  }

  // Validate user + category with Zod
  waitingRoomSchema.parse({
    userId: btnInteraction.user.id,
    categoryId: wizardSession.categoryId,
  });

  let setupData: SetupChannels | null = null;
  try {
    // Hier nutzen wir wizardSession.categoryId
    const setupResp = await axios.get<SetupChannels>(`${env.API_URL}/setup`, {
      params: { categoryId: wizardSession.categoryId },
    });
    setupData = setupResp.data;
  } catch (err) {
    logger.error("[checkDefaultWaitingRoom] Error fetching setup data:", err);
    await btnInteraction.reply({
      content: "Fehler: Setup-Daten konnten nicht abgerufen werden.",
      ephemeral: true,
    });
    return false;
  }

  if (!setupData || !setupData.voiceChannelId) {
    await btnInteraction.reply({
      content: "Fehler: Für diese Kategorie wurde kein Warteraum eingerichtet.",
      ephemeral: true,
    });
    return false;
  }

  if (member.voice.channelId !== setupData.voiceChannelId) {
    await btnInteraction.reply({
      content: "Du musst zuerst in den Warteraum eintreten, um das Setup zu bedienen.",
      ephemeral: true,
    });
    return false;
  }

  return true;
}

/**
 * Attempts to assign a dynamic voice role to the user, if one exists for this category.
 */
export async function tryAssignRole(userId: string, categoryId: string) {
  logger.debug(`[tryAssignRole] userId=${userId}, categoryId=${categoryId}`);

  try {
    const checkResp = await axios.get(`${env.BOT_SERVICE_URL}/dynamic-voice-channels/any-role`, {
      params: { categoryId },
    });
    const foundRoleId = checkResp.data?.roleId;
    if (foundRoleId) {
      await axios.post(`${env.BOT_SERVICE_URL}/discord/roles/assign`, {
        userId,
        roleId: foundRoleId,
      });
      logger.info(`[tryAssignRole] Assigned role ${foundRoleId} to user ${userId}.`);
    } else {
      logger.debug("[tryAssignRole] No dynamic role found => skip assignment.");
    }
  } catch (err) {
    logger.warn("[tryAssignRole] Failed to assign role after trackingYes:", err);
  }
}
