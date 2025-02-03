// apps/Bot/src/interaction_handlers/wizardModalInteractions.ts
import {
  ModalSubmitInteraction,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import axios from "axios";
import logger from "../services/logger";

const apiUrl = process.env.API_URL || "http://localhost:3004";

/**
 * Handle "wizard:modal_voice_name" -> user has input a channel name
 */
export async function handleVoiceNameModal(interaction: ModalSubmitInteraction) {
  const userId = interaction.user.id;
  const voiceName = interaction.fields.getTextInputValue("voiceName");

  logger.info(`[handleVoiceNameModal] userId=${userId}, voiceName=${voiceName}`);

  // 1) categoryId aus WizardSession
  let categoryId: string | null = null;
  try {
    // /wizard/:userId => z. B. { userId, categoryId, ... }
    const resp = await axios.get(`${apiUrl}/wizard/${userId}`);
    const session = resp.data; 
    categoryId = session?.categoryId ?? null;
    if (!categoryId) {
      throw new Error(`WizardSession hat keine categoryId!`);
    }
  } catch (err) {
    logger.warn("[handleVoiceNameModal] Konnte wizardSession nicht laden:", err);
    await interaction.reply({
      content: "Fehler: Wizard-Session nicht gefunden oder keine categoryId.",
      ephemeral: true,
    });
    return;
  }

  // 2) DynamicVoiceChannel => POST /dynamic-voice-channels
  let dvc: any;
  try {
    const createResp = await axios.post(`${apiUrl}/dynamic-voice-channels`, {
      userId,
      categoryId,
      customName: voiceName,
    });
    dvc = createResp.data; // { id, customName, categoryId, ...}
    logger.info(
      `[handleVoiceNameModal] dynamicVoiceChannel created => id=${dvc.id}, customName=${dvc.customName}`
    );
  } catch (err) {
    logger.error("[handleVoiceNameModal] => createDvc error:", err);
    await interaction.reply({
      content: "Fehler beim Anlegen des Dynamischen VoiceChannels.",
      ephemeral: true,
    });
    return;
  }

  // 3) Zone-Liste => GET /zones?categoryId=...
  let zoneOptions: Array<{ label: string; value: string }> = [];
  try {
    // Du brauchst in /zones => findAll(...) => if (categoryId) => filter
    const zonesResp = await axios.get(`${apiUrl}/zones`, {
      params: { categoryId },
    });
    const zonesData = zonesResp.data; // z. B. array of { id, zoneName, ... }

    zoneOptions = zonesData.map((z: any) => ({
      label: z.zoneName,
      value: z.id,
    }));
  } catch (err) {
    logger.warn("[handleVoiceNameModal] Konnte Zonen nicht laden:", err);
  }
  if (zoneOptions.length === 0) {
    zoneOptions = [
      { label: "Keine Zone gefunden", value: "NO_ZONE" },
    ];
  }

  // 4) SelectMenu
  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId("wizard:select_zone") // => handleWizardSelectMenu
    .setPlaceholder("Wähle eine Zone...")
    .addOptions(
      ...zoneOptions.map((opt) =>
        new StringSelectMenuOptionBuilder()
          .setLabel(opt.label)
          .setValue(opt.value),
      )
    );

  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu);

  // 5) Antwort
  await interaction.reply({
    content: `VoiceChannel-Name: **${voiceName}**\nBitte wähle nun eine Zone:`,
    ephemeral: true,
    components: [row],
  });
}
