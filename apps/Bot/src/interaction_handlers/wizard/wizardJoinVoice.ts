// apps\Bot\src\interaction_handlers\wizard\wizardJoinVoice.ts

import { ButtonInteraction } from "discord.js";
import axios from "axios"; // <-- AxiosError entfernt
import logger from "../../services/logger";
import { env } from "../../config";
import { checkDefaultWaitingRoom } from "./wizardHelpers";
import { z } from "zod";

/**
 * Schema for join-voice action.
 */
const wizardJoinVoiceSchema = z.object({
  userId: z.string().min(1),
});

export async function handleWizardJoinVoice(btnInteraction: ButtonInteraction) {
  logger.debug("[wizard:join_voice] invoked.");

  if (!(await checkDefaultWaitingRoom(btnInteraction))) {
    return;
  }

  await btnInteraction.deferReply({ ephemeral: true });

  try {
    wizardJoinVoiceSchema.parse({ userId: btnInteraction.user.id });

    const sessionResp = await axios.get(`${env.API_URL}/wizard/${btnInteraction.user.id}`);
    const wizardSession = sessionResp.data;

    if (!wizardSession || !wizardSession.categoryId) {
      await btnInteraction.editReply({
        content: "Fehler: Keine Kategorie in deiner Wizard-Session gefunden.",
      });
      return;
    }

    const checkResp = await axios.get(`${env.API_URL}/dynamic-voice-channels/any-role`, {
      params: { categoryId: wizardSession.categoryId },
    });
    const foundRoleId = checkResp.data?.roleId;

    if (!foundRoleId) {
      await btnInteraction.editReply({
        content:
          "Es existiert kein bestehender DVC mit einer Rolle – eventuell wurde noch keiner erstellt?",
      });
      return;
    }

    await axios.post(`${env.BOT_SERVICE_URL}/discord/roles/assign`, {
      userId: btnInteraction.user.id,
      roleId: foundRoleId,
    });

    await btnInteraction.editReply({
      content: "Du hast nun die Rolle erhalten und kannst bestehenden VoiceChannels beitreten!",
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      logger.error("[wizard:join_voice] Error:", err.response?.status, err.response?.data);
    } else {
      logger.error("[wizard:join_voice] Error:", err);
    }

    await btnInteraction.editReply({
      content: "Fehler beim 'Beitreten': " + String(err),
    });
  }
}
