import { ButtonInteraction, GuildMember } from "discord.js";
import axios from "axios";

const apiUrl = process.env.API_URL || "http://localhost:3004";

/**
 * Prüft, ob der User im korrekten Warteraum ist.
 * Wir können (optional) eine `forcedCategoryId` übergeben.
 * - Wenn vorhanden, nehmen wir diese.
 * - Wenn nicht, versuchen wir, die categoryId aus der Wizard-Session zu holen.
 */
export async function checkWaitingRoom(
  interaction: ButtonInteraction,
  forcedCategoryId?: string
): Promise<boolean> {
  // 1) Member-Objekt laden
  let member = interaction.member as GuildMember;
  if (!member) {
    await interaction.reply({
      content: "Fehler: Mitgliedsdaten nicht verfügbar.",
      ephemeral: true,
    });
    return false;
  }
  // Stimme die Member-Daten ab (um aktuellen Voice-Status zu haben)
  try {
    member = await interaction.guild!.members.fetch(member.id);
  } catch (error) {
    console.error("Fehler beim fetch(member):", error);
  }

  // 2) Prüfen, ob der User überhaupt in einem Voice-Channel ist
  if (!member.voice.channelId) {
    await interaction.reply({
      content: "Du musst zuerst einem Voice-Channel (Warteraum) beitreten!",
      ephemeral: true,
    });
    return false;
  }

  // 3) Echte CategoryId ermitteln
  let effectiveCategoryId = forcedCategoryId;
  if (!effectiveCategoryId) {
    // Wenn nichts reinkam, holen wir die Wizard-Session
    // (Evtl. brauchst du das nicht mehr, wenn du IMMER forcedCategoryId nutzt.)
    try {
      const sessionResp = await axios.get(`${apiUrl}/wizard/${interaction.user.id}`);
      const wizardSession = sessionResp.data;
      if (!wizardSession || !wizardSession.categoryId) {
        await interaction.reply({
          content: "Fehler: Keine Kategorie in deiner Wizard-Session gefunden.",
          ephemeral: true,
        });
        return false;
      }
      effectiveCategoryId = wizardSession.categoryId;
    } catch (err) {
      console.error("Fehler beim Abrufen der Wizard-Session:", err);
      await interaction.reply({
        content: "Fehler: Wizard-Session konnte nicht abgerufen werden.",
        ephemeral: true,
      });
      return false;
    }
  }

  // 4) Setup-Daten (für diese Kategorie) laden => /setup?categoryId=...
  //    Da du nur EINEN Setup pro Kategorie hast, reicht das Query param.
  let setupData: any;
  try {
    const setupResp = await axios.get(`${apiUrl}/setup`, {
      params: { categoryId: effectiveCategoryId },
    });
    setupData = setupResp.data;
  } catch (err) {
    console.error("Fehler beim Abrufen der Setup-Daten:", err);
    await interaction.reply({
      content: "Fehler: Setup-Daten konnten nicht abgerufen werden.",
      ephemeral: true,
    });
    return false;
  }

  // Prüfen, ob wir ein voiceChannelId erhalten haben
  if (!setupData || !setupData.voiceChannelId) {
    await interaction.reply({
      content: "Fehler: Für diese Kategorie wurde kein Warteraum eingerichtet.",
      ephemeral: true,
    });
    return false;
  }

  // 5) Check: Stimmt der VoiceChannel des Users mit dem Warteraum-Channel überein?
  if (member.voice.channelId !== setupData.voiceChannelId) {
    await interaction.reply({
      content: "Du bist nicht im richtigen Warteraum für dieses Setup.",
      ephemeral: true,
    });
    return false;
  }

  // => alles passt
  return true;
}
