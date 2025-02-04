// apps\Bot\src\interaction_handlers\setupInteractions.ts

import { ButtonInteraction, Interaction } from "discord.js";
import axios from "axios";
import logger from "../services/logger";
import { checkWaitingRoom } from "../utils/waitingRoomHelper";
import { z } from "zod";

/**
 * Setup interactions are triggered by buttons with customId starting with "setup:".
 * We validate the input, confirm the user is in the correct waiting room,
 * and optionally set up a WizardSession for further steps.
 */
export async function handleSetupInteraction(interaction: Interaction) {
  // Only proceed if it's a Button
  if (!interaction.isButton()) {
    return;
  }

  // Check if the customId starts with "setup:"
  if (!interaction.customId.startsWith("setup:")) {
    return;
  }

  /**
   * Example of a customId: "setup:start:<categoryId>"
   * We split by ":" and expect parts: ["setup","start","<categoryId>"]
   */
  const parts = interaction.customId.split(":");

  // Zod schema for subAction and categoryId
  const setupActionSchema = z.object({
    subAction: z.string().min(1),
    categoryId: z.string().min(1),
  });

  // Attempt to parse subAction and categoryId using the schema
  const parsed = setupActionSchema.safeParse({
    subAction: parts[1],
    categoryId: parts[2],
  });

  // If parsing fails, log a warning and return
  if (!parsed.success) {
    logger.warn(`[handleSetupInteraction] Invalid setup customId => ${interaction.customId}`);
    return;
  }

  const { subAction, categoryId } = parsed.data;
  logger.info(
    `[handleSetupInteraction] subAction=${subAction}, categoryId=${categoryId}, userId=${interaction.user.id}`
  );

  // Check if the user is in the correct waiting room
  const inWaitingRoom = await checkWaitingRoom(interaction as ButtonInteraction, categoryId);
  if (!inWaitingRoom) {
    logger.warn(
      "[handleSetupInteraction] User is not in the correct waiting room. Aborting setup."
    );
    return;
  }

  // Optional: Set wizard session to the correct category for subsequent steps
  const apiUrl = process.env.API_URL || "http://localhost:3004";
  try {
    await axios.post(`${apiUrl}/wizard/start`, {
      userId: interaction.user.id,
      categoryId,
    });
    logger.debug("[handleSetupInteraction] Wizard session set successfully.");
  } catch (err) {
    logger.warn("[handleSetupInteraction] Could not update wizard session:", err);
  }

  // Handle the specific subAction
  if (subAction === "start") {
    await (interaction as ButtonInteraction).reply({
      content: "Du hast den Setup-Button geklickt. Weiter geht's!",
      ephemeral: true,
    });
    logger.info("[handleSetupInteraction] Setup start button clicked => responded to user.");
  }

  // Additional subActions (e.g. "stop", etc.) could be handled with further if/else logic
}
