// apps/Bot/src/utils/waitingRoomHelper.ts

import { ButtonInteraction, GuildMember } from "discord.js";
import axios from "axios";
import logger from "../services/logger";
import { z } from "zod";
import { SetupChannels } from "pyro-prisma"; // <-- NEU

/**
 * Checks if a user is in the correct waiting room.
 * If forcedCategoryId is provided, we use it directly.
 * Otherwise, we load the category from the user's wizard session.
 */
export async function checkWaitingRoom(
  interaction: ButtonInteraction,
  forcedCategoryId?: string
): Promise<boolean> {
  const envSchema = z.object({ API_URL: z.string().url().min(1) });
  const envCheck = envSchema.safeParse(process.env);
  if (!envCheck.success) {
    logger.error("[checkWaitingRoom] Missing or invalid API_URL in environment.");
    await interaction.reply({
      content: "Fehler: API_URL not configured correctly in the bot.",
      ephemeral: true,
    });
    return false;
  }
  const apiUrl = envCheck.data.API_URL;

  let member = interaction.member as GuildMember;
  if (!member) {
    logger.warn("[checkWaitingRoom] GuildMember data not available.");
    await interaction.reply({
      content: "Fehler: Mitgliedsdaten nicht verfügbar.",
      ephemeral: true,
    });
    return false;
  }
  try {
    member = await interaction.guild!.members.fetch(member.id);
  } catch (error) {
    logger.error("[checkWaitingRoom] Error fetching guild member:", error);
  }

  if (!member.voice.channelId) {
    await interaction.reply({
      content: "Du musst zuerst einem Voice-Channel (Warteraum) beitreten!",
      ephemeral: true,
    });
    return false;
  }

  // 3) Determine effective categoryId
  let effectiveCategoryId = forcedCategoryId;
  if (!effectiveCategoryId) {
    try {
      const sessionResp = await axios.get(`${apiUrl}/wizard/${interaction.user.id}`);
      const wizardSession = sessionResp.data;
      if (!wizardSession || !wizardSession.categoryId) {
        await interaction.reply({
          content: "Fehler: Keine Kategorie in deiner Wizard-Session gefunden.",
          ephemeral: true,
        });
        return false;
      }
      effectiveCategoryId = wizardSession.categoryId;
    } catch (err) {
      logger.error("[checkWaitingRoom] Error loading wizard session:", err);
      await interaction.reply({
        content: "Fehler: Wizard-Session konnte nicht abgerufen werden.",
        ephemeral: true,
      });
      return false;
    }
  }

  // 4) Fetch setup data => SetupChannels
  let setupData: SetupChannels | null = null; // <-- kein any mehr
  try {
    const setupResp = await axios.get<SetupChannels>(`${apiUrl}/setup`, {
      params: { categoryId: effectiveCategoryId },
    });
    setupData = setupResp.data;
  } catch (err) {
    logger.error("[checkWaitingRoom] Error fetching setup data:", err);
    await interaction.reply({
      content: "Fehler: Setup-Daten konnten nicht abgerufen werden.",
      ephemeral: true,
    });
    return false;
  }

  if (!setupData || !setupData.voiceChannelId) {
    await interaction.reply({
      content: "Fehler: Für diese Kategorie wurde kein Warteraum eingerichtet.",
      ephemeral: true,
    });
    return false;
  }

  // 5) Check if user's voiceChannel matches
  if (member.voice.channelId !== setupData.voiceChannelId) {
    await interaction.reply({
      content: "Du bist nicht im richtigen Warteraum für dieses Setup.",
      ephemeral: true,
    });
    return false;
  }

  logger.debug("[checkWaitingRoom] User is in the correct waiting room.");
  return true;
}
