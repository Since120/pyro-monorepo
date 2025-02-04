// apps\Bot\src\interaction_handlers\wizard\index.ts

import { Interaction, ButtonInteraction } from "discord.js";
import logger from "../../services/logger";
import { handleWizardStart } from "./wizardStart";
import { handleWizardTrackingYes, handleWizardTrackingNo } from "./wizardTrackingYesNo";
import { handleWizardCreateVoice } from "./wizardCreateVoice";
import { handleWizardJoinVoice } from "./wizardJoinVoice";

/**
 * Main entry point for all "wizard:*" button interactions.
 */
export async function handleWizardInteraction(interaction: Interaction): Promise<void> {
  // Return early if it's not a button
  if (!interaction.isButton()) {
    return;
  }

  const btnInteraction = interaction as ButtonInteraction;
  const { customId } = btnInteraction;

  // Dispatch by customId
  if (customId.startsWith("wizard:start")) {
    await handleWizardStart(btnInteraction);
    return;
  } else if (customId === "wizard:tracking_yes") {
    await handleWizardTrackingYes(btnInteraction);
    return;
  } else if (customId === "wizard:tracking_no") {
    await handleWizardTrackingNo(btnInteraction);
    return;
  } else if (customId === "wizard:create_voice") {
    await handleWizardCreateVoice(btnInteraction);
    return;
  } else if (customId === "wizard:join_voice") {
    await handleWizardJoinVoice(btnInteraction);
    return;
  }

  // If no wizard action matched, just return.
  logger.debug("[handleWizardInteraction] No matching wizard action for customId=" + customId);
  return;
}
