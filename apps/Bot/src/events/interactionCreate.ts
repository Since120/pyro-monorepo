// apps\Bot\src\events\interactionCreate.ts

import { client } from "../index";
import { Interaction } from "discord.js";
import logger from "../services/logger";
import { z } from "zod";
import { handleWizardInteraction } from "../interaction_handlers/wizard";
import { handleSetupInteraction } from "../interaction_handlers/setupInteractions";
import { handleVoiceNameModal } from "../interaction_handlers/wizardModalInteractions";
import { handleWizardSelectMenu } from "../interaction_handlers/wizardSelectMenuInteractions";

/**
 * Sets up the event listener for all interaction types.
 * Handles Buttons, Modal submissions, and Select Menus.
 */
logger.info("[interactionCreate] => File loaded => Registering interaction handlers...");

client.on("interactionCreate", async (interaction: Interaction) => {
  // 1) Button
  if (interaction.isButton()) {
    // Validate customId with Zod
    const customIdSchema = z.string().min(1);
    const validCustomId = customIdSchema.safeParse(interaction.customId);
    if (!validCustomId.success) {
      logger.warn("[interactionCreate] Button interaction with invalid customId => ignoring.");
      return;
    }

    logger.info(`[interactionCreate] Button => customId=${validCustomId.data}`);

    if (validCustomId.data.startsWith("wizard:")) {
      return handleWizardInteraction(interaction);
    } else if (validCustomId.data.startsWith("setup:")) {
      return handleSetupInteraction(interaction);
    }
  }
  // 2) Modal
  else if (interaction.isModalSubmit()) {
    const customIdSchema = z.string().min(1);
    const validCustomId = customIdSchema.safeParse(interaction.customId);
    if (!validCustomId.success) {
      logger.warn("[interactionCreate] Modal interaction with invalid customId => ignoring.");
      return;
    }

    logger.info(`[interactionCreate] ModalSubmit => customId=${validCustomId.data}`);

    if (validCustomId.data === "wizard:modal_voice_name") {
      return handleVoiceNameModal(interaction);
    }
  }
  // 3) SelectMenu
  else if (interaction.isStringSelectMenu()) {
    const customIdSchema = z.string().min(1);
    const validCustomId = customIdSchema.safeParse(interaction.customId);
    if (!validCustomId.success) {
      logger.warn("[interactionCreate] SelectMenu interaction with invalid customId => ignoring.");
      return;
    }

    logger.info(`[interactionCreate] StringSelectMenu => customId=${validCustomId.data}`);

    if (validCustomId.data === "wizard:select_zone") {
      return handleWizardSelectMenu(interaction);
    }
  }
});
