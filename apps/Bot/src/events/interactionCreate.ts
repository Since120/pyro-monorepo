// apps/Bot/src/events/interactionCreate.ts

import { client } from "../index";
import { Interaction } from "discord.js";
import logger from "../services/logger";
import { handleWizardInteraction } from "../interaction_handlers/wizardInteractions";
import { handleSetupInteraction } from "../interaction_handlers/setupInteractions";

// NEU:
import { handleVoiceNameModal } from "../interaction_handlers/wizardModalInteractions";
import { handleWizardSelectMenu } from "../interaction_handlers/wizardSelectMenuInteractions";

logger.info("[events/interactionCreate] => Datei geladen => Registriere Buttons...");

client.on("interactionCreate", async (interaction: Interaction) => {
  // 1) Button
  if (interaction.isButton()) {
    logger.info(`[interactionCreate] => Button, customId=${interaction.customId}`);

    if (interaction.customId.startsWith("wizard:")) {
      return handleWizardInteraction(interaction);
    } else if (interaction.customId.startsWith("setup:")) {
      return handleSetupInteraction(interaction);
    }
  }
  // 2) Modal
  else if (interaction.isModalSubmit()) {
    logger.info(`[interactionCreate] => ModalSubmit, customId=${interaction.customId}`);

    if (interaction.customId === "wizard:modal_voice_name") {
      // => user hat voiceName eingegeben
      return handleVoiceNameModal(interaction);
    }
  }
  // 3) SelectMenu
  else if (interaction.isStringSelectMenu()) {
    logger.info(`[interactionCreate] => StringSelectMenu, customId=${interaction.customId}`);

    if (interaction.customId === "wizard:select_zone") {
      return handleWizardSelectMenu(interaction);
    }
  }
});
