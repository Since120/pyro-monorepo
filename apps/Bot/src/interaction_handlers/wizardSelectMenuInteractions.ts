// apps\Bot\src\interaction_handlers\wizardSelectMenuInteractions.ts

import { StringSelectMenuInteraction, GuildMember } from "discord.js";
import axios from "axios";
import logger from "../services/logger";
import { z } from "zod";

/**
 * Handles wizard's select menu interactions when a user chooses a specific zone.
 */
const apiUrl = process.env.API_URL || "http://localhost:3004";
//const botUrl = process.env.BOT_SERVICE_URL || "http://localhost:3002";

export async function handleWizardSelectMenu(interaction: StringSelectMenuInteraction) {
  // We only proceed if the customId is "wizard:select_zone"
  if (interaction.customId !== "wizard:select_zone") {
    return;
  }

  // Defer the reply so we can edit it later
  await interaction.deferReply({ ephemeral: true });

  // We expect exactly one selected value for the zone
  const chosenZoneId = interaction.values[0];

  // Validate the chosen zoneId with Zod
  const zoneIdSchema = z.string().min(1);
  const parseResult = zoneIdSchema.safeParse(chosenZoneId);

  if (!parseResult.success) {
    logger.warn("[handleWizardSelectMenu] Invalid zoneId selected => aborting.");
    await interaction.editReply({ content: "Invalid Zone selected." });
    return;
  }

  logger.info(`[handleWizardSelectMenu] userId=${interaction.user.id}, zoneId=${parseResult.data}`);

  try {
    // 1) Assign the zone to the DVC in the API
    const resp = await axios.patch(`${apiUrl}/dynamic-voice-channels/assign-zone`, {
      userId: interaction.user.id,
      zoneId: parseResult.data,
    });
    const updatedDVC = resp.data;
    logger.info(
      `[handleWizardSelectMenu] Zone assigned => dvc.id=${updatedDVC.id}, zoneId=${updatedDVC.zoneId}`
    );

    // 2) Attempt to move user to the newly created voice channel
    const member = interaction.member as GuildMember | null;
    if (member?.voice?.channelId) {
      try {
        await member.voice.setChannel(updatedDVC.discordChannelId);
        logger.info(
          `[handleWizardSelectMenu] Moved user=${interaction.user.id} to channel=${updatedDVC.discordChannelId}`
        );
      } catch (moveErr) {
        logger.error("[handleWizardSelectMenu] Failed to move user:", moveErr);
      }
    } else {
      logger.warn(
        `[handleWizardSelectMenu] Voice state not available for user=${interaction.user.id}; cannot move user.`
      );
    }

    // 3) Send final confirmation
    await interaction.editReply({
      content: "Setup completed. You have been moved to the new voice channel.",
      components: [],
    });
  } catch (err) {
    logger.error("[handleWizardSelectMenu] Error assigning zone or moving user:", err);
    await interaction.editReply({
      content: "An error occurred while setting the zone. Please try again.",
    });
  }
}
