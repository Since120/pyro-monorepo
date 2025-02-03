// Pfad: apps/Bot/src/interaction_handlers/wizardSelectMenuInteractions.ts

import { StringSelectMenuInteraction, GuildMember } from "discord.js";
import axios from "axios";
import logger from "../services/logger";

// API-Endpunkte (zentrale Geschäftslogik) laufen auf Port 3004
const apiUrl = process.env.API_URL || "http://localhost:3004";
// Bot-Endpunkte (z.B. zum Rollen-Management, Channel-Erstellung) laufen auf Port 3002
const botUrl = process.env.BOT_SERVICE_URL || "http://localhost:3002";

export async function handleWizardSelectMenu(interaction: StringSelectMenuInteraction) {
  if (interaction.customId !== "wizard:select_zone") return;

  // Wir deferen die Antwort, damit wir später mit editReply antworten können.
  await interaction.deferReply({ ephemeral: true });

  // Der ausgewählte Zone-Wert
  const chosenZoneId = interaction.values[0];
  logger.info(`[handleWizardSelectMenu] userId=${interaction.user.id}, zoneId=${chosenZoneId}`);

  try {
    // 1) API-Aufruf: Zone zuweisen, VoiceChannel erstellen und DVC-Datensatz aktualisieren.
    const resp = await axios.patch(`${apiUrl}/dynamic-voice-channels/assign-zone`, {
      userId: interaction.user.id,
      zoneId: chosenZoneId,
    });
    const updatedDVC = resp.data; // Erwartet: { id, zoneId, discordChannelId, … }
    logger.info(`[handleWizardSelectMenu] assigned zone => dvc.id=${updatedDVC.id}, zoneId=${updatedDVC.zoneId}`);

    // 2) Verschiebe den User in den neu erstellten VoiceChannel.
    const member = interaction.member as GuildMember | null;
    if (member && member.voice && member.voice.channelId) {
      try {
        await member.voice.setChannel(updatedDVC.discordChannelId);
        logger.info(`[handleWizardSelectMenu] Moved user ${interaction.user.id} to channel ${updatedDVC.discordChannelId}`);
      } catch (moveErr) {
        logger.error(`[handleWizardSelectMenu] Failed to move user:`, moveErr);
        // Optional: Bei einem Fehler hier könnte man den User zusätzlich informieren.
      }
    } else {
      logger.warn(`[handleWizardSelectMenu] Voice state of user ${interaction.user.id} not available; user konnte nicht verschoben werden.`);
    }

    // 3) Sende eine abschließende Bestätigung.
    await interaction.editReply({
      content: "Setup abgeschlossen – du wurdest in den neuen VoiceChannel verschoben.",
      components: [] // Keine weiteren Buttons
    });
  } catch (err) {
    logger.error(`[handleWizardSelectMenu] => DB error`, err);
    // Da wir bereits deferReply aufgerufen haben, verwenden wir reply nicht direkt,
    // sondern editReply, um die Fehlernachricht zu senden.
    await interaction.editReply({
      content: "Fehler beim Setzen der Zone!",
    });
  }
}
