// apps\Bot\src\interaction_handlers\wizardModalInteractions.ts

import {
  ModalSubmitInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import axios from "axios";
import logger from "../services/logger";
import { z } from "zod";
import { DynamicVoiceChannel, Zone } from "pyro-prisma"; // <--- NEU

/**
 * Handles the modal where user enters the desired voice channel name ("wizard:modal_voice_name").
 */
const apiUrl = process.env.API_URL || "http://localhost:3004";

export async function handleVoiceNameModal(interaction: ModalSubmitInteraction) {
  // 1) Extract userId and voiceName from the modal
  const userId = interaction.user.id;
  const voiceName = interaction.fields.getTextInputValue("voiceName");

  // 2) Validate userId and voiceName with Zod
  const modalSchema = z.object({
    userId: z.string().min(1),
    voiceName: z.string().min(2).max(50),
  });

  const parseResult = modalSchema.safeParse({ userId, voiceName });
  if (!parseResult.success) {
    logger.warn("[handleVoiceNameModal] Invalid data from modal => aborting.");
    await interaction.reply({
      content: "Invalid input for channel creation.",
      ephemeral: true,
    });
    return;
  }

  logger.info(
    `[handleVoiceNameModal] userId=${parseResult.data.userId}, voiceName=${parseResult.data.voiceName}`
  );

  // 3) Retrieve categoryId from the user's wizard session
  let categoryId: string | null = null;
  try {
    const resp = await axios.get(`${apiUrl}/wizard/${userId}`);
    const session = resp.data;
    categoryId = session?.categoryId ?? null;

    if (!categoryId) {
      throw new Error("WizardSession is missing categoryId!");
    }
    logger.debug(`[handleVoiceNameModal] Fetched categoryId=${categoryId} from wizard session.`);
  } catch (err) {
    logger.warn("[handleVoiceNameModal] Could not load wizard session:", err);
    await interaction.reply({
      content: "Error: Wizard session not found or no categoryId present.",
      ephemeral: true,
    });
    return;
  }

  // 4) Create the dynamic voice channel via the API => returns a DynamicVoiceChannel
  let dvc: DynamicVoiceChannel; // <-- KEIN any
  try {
    const createResp = await axios.post<DynamicVoiceChannel>(`${apiUrl}/dynamic-voice-channels`, {
      userId,
      categoryId,
      customName: voiceName,
    });
    dvc = createResp.data;
    logger.info(
      `[handleVoiceNameModal] Dynamic voice channel created => id=${dvc.id}, customName=${dvc.customName}`
    );
  } catch (err) {
    logger.error("[handleVoiceNameModal] Failed to create dynamic voice channel:", err);
    await interaction.reply({
      content: "An error occurred while creating the dynamic voice channel.",
      ephemeral: true,
    });
    return;
  }

  // 5) Retrieve all zones for the chosen category => returns Zone[]
  let zoneOptions: Array<{ label: string; value: string }> = [];
  try {
    // if your /zones endpoint returns an array of full Prisma Zone objects
    const zonesResp = await axios.get<Zone[]>(`${apiUrl}/zones`, {
      params: { categoryId },
    });
    const zonesData = zonesResp.data;
    // zonesData ist jetzt Zone[]
    zoneOptions = zonesData.map((z) => ({
      label: z.zoneName,
      value: z.id,
    }));
    logger.debug(
      `[handleVoiceNameModal] Found ${zoneOptions.length} zones for categoryId=${categoryId}.`
    );
  } catch (err) {
    logger.warn("[handleVoiceNameModal] Could not load zones:", err);
  }

  // 6) Fallback option if no zones found
  if (zoneOptions.length === 0) {
    zoneOptions = [{ label: "No zones found", value: "NO_ZONE" }];
  }

  // 7) Build the select menu for zone selection
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("wizard:select_zone")
    .setPlaceholder("Select a Zone...")
    .addOptions(
      ...zoneOptions.map((opt) =>
        new StringSelectMenuOptionBuilder().setLabel(opt.label).setValue(opt.value)
      )
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  // 8) Present the user with a dropdown to pick the zone
  await interaction.reply({
    content: `Voice channel name: **${voiceName}**\nPlease select a zone below:`,
    ephemeral: true,
    components: [row],
  });
  logger.info("[handleVoiceNameModal] Prompted user to select a zone.");
}
