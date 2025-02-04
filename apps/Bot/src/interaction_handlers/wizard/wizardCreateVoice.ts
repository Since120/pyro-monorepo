// apps\Bot\src\interaction_handlers\wizard\wizardCreateVoice.ts

import {
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import logger from "../../services/logger";
import { checkDefaultWaitingRoom } from "./wizardHelpers";

/**
 * Handles "wizard:create_voice"
 */
export async function handleWizardCreateVoice(interaction: ButtonInteraction): Promise<void> {
  logger.debug("[handleWizardCreateVoice] Handling wizard:create_voice...");

  // Make sure user is in the correct waiting room
  const ok = await checkDefaultWaitingRoom(interaction);
  if (!ok) {
    logger.debug("[handleWizardCreateVoice] checkDefaultWaitingRoom failed => return");
    return;
  }

  try {
    const modal = new ModalBuilder()
      .setCustomId("wizard:modal_voice_name")
      .setTitle("VoiceChannel erstellen");

    const nameInput = new TextInputBuilder()
      .setCustomId("voiceName")
      .setLabel("Name des neuen Channels")
      .setStyle(TextInputStyle.Short)
      .setMinLength(2)
      .setMaxLength(50)
      .setRequired(true);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput);
    modal.addComponents(row);

    await interaction.showModal(modal);
    logger.debug("[handleWizardCreateVoice] Modal displayed to user.");
  } catch (err) {
    logger.error("[handleWizardCreateVoice] Error:", err);
    if (!interaction.deferred && !interaction.replied) {
      await interaction.reply({
        content: "Fehler beim Öffnen des Modals.",
        ephemeral: true,
      });
    }
  }
}
