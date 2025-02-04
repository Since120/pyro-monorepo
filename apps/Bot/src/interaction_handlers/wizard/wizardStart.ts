// apps\Bot\src\interaction_handlers\wizard\wizardStart.ts

import { ButtonInteraction } from "discord.js";
import axios from "axios";
import logger from "../../services/logger";
import { env } from "../../config";
import { z } from "zod";
import { checkWaitingRoomForcedCategory } from "./wizardHelpers";

/**
 * Zod schema for the "wizard:start" action.
 */
const wizardStartSchema = z.object({
  userId: z.string().min(1),
  categoryId: z.string().min(1),
});

export async function handleWizardStart(btnInteraction: ButtonInteraction) {
  // The customId format is "wizard:start:<categoryId>"
  // So we split by ":" and get the third part as categoryId
  const parts = btnInteraction.customId.split(":");
  const categoryId = parts[2] || "NO_CATEGORY_ID";
  const userId = btnInteraction.user.id;

  /**
   * Validate user & category
   */
  wizardStartSchema.parse({ userId, categoryId });

  logger.debug(`[wizard:start] user=${userId}, categoryId=${categoryId}`);

  // Ensure user is in the correct waiting room
  const isInWaitingRoom = await checkWaitingRoomForcedCategory(btnInteraction, categoryId);
  if (!isInWaitingRoom) {
    return;
  }

  // Initiate wizard session
  try {
    await axios.post(`${env.API_URL}/wizard/start`, {
      userId: btnInteraction.user.id,
      categoryId,
    });
  } catch (err) {
    logger.error("[wizard:start] Error updating wizardSession:", err);
    await btnInteraction.reply({
      content: "Fehler beim Wizard-Start",
      ephemeral: true,
    });
    return;
  }

  // Load category name
  let catName = categoryId;
  try {
    const resp = await axios.get(`${env.API_URL}/categories/${categoryId}`);
    if (resp.data && resp.data.name) {
      catName = resp.data.name;
    }
  } catch (err) {
    logger.warn("[wizard:start] Category could not be loaded:", err);
  }

  await btnInteraction.reply({
    content: `Willst du Tracking aktivieren?\n(Du bist in der Kategorie: ${catName})`,
    ephemeral: true,
    components: [
      {
        type: 1, // ActionRow
        components: [
          {
            type: 2,
            label: "Ja (Tracking)",
            style: 3, // SUCCESS
            customId: "wizard:tracking_yes",
          },
          {
            type: 2,
            label: "Nein (kein Tracking)",
            style: 4, // DANGER
            customId: "wizard:tracking_no",
          },
        ],
      },
    ],
  });
}
