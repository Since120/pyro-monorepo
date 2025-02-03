import {
  Interaction,
  ButtonInteraction,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
} from "discord.js";
import axios from "axios";
import logger from "../services/logger";

// Wir nutzen das API_URL, um Wizard-Session oder Setup etc. zu laden
const apiUrl = process.env.API_URL || "http://localhost:3004";
const botUrl = process.env.BOT_SERVICE_URL || "http://localhost:3002";

// ======================================================================
// NEUE HELPER-FUNKTION, um zu prüfen, ob der User in "dem" Warteraum
// der Kategorie sitzt, die im Button enthalten ist.
// ======================================================================
async function checkWaitingRoomForcedCategory(
  btnInteraction: ButtonInteraction,
  forcedCategoryId: string
): Promise<boolean> {
  // 1) Prüfen, ob User in Voice
  const member = btnInteraction.member;
  if (!member || !("voice" in member) || !member.voice.channelId) {
    await btnInteraction.reply({
      content: "Du musst zuerst einem Voice-Channel beitreten – dem Warteraum!",
      ephemeral: true,
    });
    return false;
  }
  // 2) Setup-Daten für die Kategorie laden
  let setupData: any;
  try {
    const setupResp = await axios.get(`${apiUrl}/setup`, {
      params: { categoryId: forcedCategoryId },
    });
    setupData = setupResp.data;
  } catch (err) {
    await btnInteraction.reply({
      content: "Fehler: Setup-Daten konnten nicht abgerufen werden.",
      ephemeral: true,
    });
    return false;
  }
  if (!setupData || !setupData.voiceChannelId) {
    await btnInteraction.reply({
      content: "Fehler: Für diese Kategorie wurde kein Warteraum eingerichtet.",
      ephemeral: true,
    });
    return false;
  }
  // 3) Vergleiche VoiceChannel
  if (member.voice.channelId !== setupData.voiceChannelId) {
    await btnInteraction.reply({
      content: "Du musst zuerst in den richtigen Warteraum-VoiceChannel dieser Kategorie gehen!",
      ephemeral: true,
    });
    return false;
  }
  return true;
}

// ======================================================================
// HAUPT-FUNKTION
// ======================================================================
export async function handleWizardInteraction(interaction: Interaction) {
  if (!interaction.isButton()) return;
  const btnInteraction = interaction as ButtonInteraction;
  const { customId } = btnInteraction;

  // A) "wizard:start:<categoryId>"
  if (customId.startsWith("wizard:start")) {
    // 1) CategoryId aus dem Button ziehen
    const parts = customId.split(":"); // z.B. ["wizard", "start", "CAT123"]
    const categoryId = parts[2] || "NO_CATEGORY_ID";

    // 2) Prüfe, ob der User im korrekten Warteraum ist
    const isInWaitingRoom = await checkWaitingRoomForcedCategory(btnInteraction, categoryId);
    if (!isInWaitingRoom) return; // => Abbruch

    // 3) Wizard-Session auf diese Kategorie setzen
    try {
      await axios.post(`${apiUrl}/wizard/start`, {
        userId: btnInteraction.user.id,
        categoryId,
      });
    } catch (err) {
      logger.error("wizard:start => error updating wizardSession:", err);
      await btnInteraction.reply({
        content: "Fehler beim Wizard-Start",
        ephemeral: true,
      });
      return;
    }

    // 4) Nun die berühmte Frage: "Willst du Tracking aktivieren?"
    let catName = categoryId;
    try {
      const resp = await axios.get(`${apiUrl}/categories/${categoryId}`);
      if (resp.data && resp.data.name) {
        catName = resp.data.name;
      }
    } catch (err) {
      logger.warn("Kategorie konnte nicht geladen werden:", err);
    }

    await btnInteraction.reply({
      content: `Willst du Tracking aktivieren?\n(Du bist in der Kategorie: ${catName})`,
      ephemeral: true,
      components: [
        {
          type: 1, // ActionRow
          components: [
            {
              type: 2,
              label: "Ja (Tracking)",
              style: 3, // SUCCESS
              customId: "wizard:tracking_yes",
            },
            {
              type: 2,
              label: "Nein (kein Tracking)",
              style: 4, // DANGER
              customId: "wizard:tracking_no",
            },
          ],
        },
      ],
    });
  }

  // B) "wizard:tracking_yes"
  else if (customId === "wizard:tracking_yes") {
    // => Wir holen die categoryId aus der Wizard-Session
    // => Prüfen: Ist user im richtigen Warteraum? (Nur bei Bedarf.)
    if (!(await checkDefaultWaitingRoom(btnInteraction))) return;

    await btnInteraction.deferReply({ ephemeral: true });
    try {
      // 1) Tracking aktiv
      await axios.post(`${apiUrl}/wizard/step`, {
        userId: btnInteraction.user.id,
        trackingActive: true,
      });
      // 2) afterTracking => API
      const resp = await axios.post(`${apiUrl}/wizard/after-tracking`, {
        userId: btnInteraction.user.id,
      });
      const data = resp.data; 
      
      // 3) Ggf. Rolle zuweisen
      if (data.categoryId) {
        tryAssignRole(btnInteraction.user.id, data.categoryId);
      }

      // 4) Buttons (create, join)
      const rowComponents = [];
      if (data.enableCreate) {
        rowComponents.push({
          type: 2,
          label: "Voice erstellen",
          style: 1,
          customId: "wizard:create_voice",
        });
      }
      if (data.enableJoin) {
        rowComponents.push({
          type: 2,
          label: "Beitreten",
          style: 1,
          customId: "wizard:join_voice",
        });
      }
      await btnInteraction.editReply({
        content: data.text,
        components: rowComponents.length > 0 ? [{ type: 1, components: rowComponents }] : [],
      });
    } catch (err) {
      logger.error("wizard:tracking_yes -> Error:", err);
      await btnInteraction.editReply({
        content: "Fehler beim Tracking-Aktivieren oder after-tracking-Schritt",
      });
    }
  }

  // C) "wizard:tracking_no"
  else if (customId === "wizard:tracking_no") {
    if (!(await checkDefaultWaitingRoom(btnInteraction))) return;
    await btnInteraction.deferReply({ ephemeral: true });
    try {
      await axios.post(`${apiUrl}/wizard/step`, {
        userId: btnInteraction.user.id,
        trackingActive: false,
      });
      const resp = await axios.post(`${apiUrl}/wizard/after-tracking`, {
        userId: btnInteraction.user.id,
      });
      const data = resp.data;

      const rowComponents = [];
      if (data.enableCreate) {
        rowComponents.push({
          type: 2,
          label: "Voice erstellen",
          style: 1,
          customId: "wizard:create_voice",
        });
      }
      if (data.enableJoin) {
        rowComponents.push({
          type: 2,
          label: "Beitreten",
          style: 1,
          customId: "wizard:join_voice",
        });
      }
      await btnInteraction.editReply({
        content: data.text,
        components: rowComponents.length > 0 ? [{ type: 1, components: rowComponents }] : [],
      });
    } catch (err) {
      logger.error("wizard:tracking_no -> Error:", err);
      await btnInteraction.editReply({
        content: "Fehler beim Tracking-Deaktivieren oder after-tracking-Schritt",
      });
    }
  }

  // D) "wizard:create_voice" => ...
  else if (customId === "wizard:create_voice") {
    if (!(await checkDefaultWaitingRoom(btnInteraction))) return;
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
      await btnInteraction.showModal(modal);
    } catch (err) {
      logger.error("wizard:create_voice -> Error:", err);
      if (!btnInteraction.deferred && !btnInteraction.replied) {
        await btnInteraction.reply({
          content: "Fehler beim Öffnen des Modals.",
          ephemeral: true,
        });
      }
    }
  }

  // E) "wizard:join_voice"
  else if (customId === "wizard:join_voice") {
    if (!(await checkDefaultWaitingRoom(btnInteraction))) return;
    await btnInteraction.deferReply({ ephemeral: true });
    try {
      // 1) Wizard-Session => categoryId
      const sessionResp = await axios.get(`${apiUrl}/wizard/${btnInteraction.user.id}`);
      const wizardSession = sessionResp.data;
      if (!wizardSession || !wizardSession.categoryId) {
        return await btnInteraction.editReply({
          content: "Fehler: Keine Kategorie in deiner Wizard-Session gefunden.",
        });
      }
      // 2) Rolle?
      const checkResp = await axios.get(`${apiUrl}/dynamic-voice-channels/any-role`, {
        params: { categoryId: wizardSession.categoryId },
      });
      const foundRoleId = checkResp.data?.roleId;
      if (!foundRoleId) {
        await btnInteraction.editReply({
          content:
            "Es existiert kein bestehender DVC mit einer Rolle – eventuell wurde noch keiner erstellt?",
        });
        return;
      }
      // 3) Rolle dem User geben
      await axios.post(`${botUrl}/discord/roles/assign`, {
        userId: btnInteraction.user.id,
        roleId: foundRoleId,
      });
      await btnInteraction.editReply({
        content: "Du hast nun die Rolle erhalten und kannst bestehenden VoiceChannels beitreten!",
      });
    } catch (err: any) {
      if (err.response) {
        logger.error("wizard:join_voice -> Error:", err.response.status, err.response.data);
      } else {
        logger.error("wizard:join_voice -> Error:", err);
      }
      await btnInteraction.editReply({
        content: "Fehler beim 'Beitreten': " + String(err),
      });
    }
  }
}

// ======================================================================
// Hilfs-Funktionen, um Rolle zuweisen
// ======================================================================
async function tryAssignRole(userId: string, categoryId: string) {
  try {
    const checkResp = await axios.get(`${apiUrl}/dynamic-voice-channels/any-role`, {
      params: { categoryId },
    });
    const foundRoleId = checkResp.data?.roleId;
    if (foundRoleId) {
      await axios.post(`${botUrl}/discord/roles/assign`, {
        userId,
        roleId: foundRoleId,
      });
    }
  } catch (err: any) {
    logger.warn("Failed to assign role after trackingYes:", err);
  }
}

// ======================================================================
// "alte" Warteschlangenprüfung, die WizardSession.categoryId nutzt
// => Nur sinnvoll, wenn userId dort schon die richtige categoryId drin hat
// ======================================================================
async function checkDefaultWaitingRoom(btnInteraction: ButtonInteraction): Promise<boolean> {
  // Genauso wie du es hattest, 
  // wir wollen nur sicherstellen, dass der User in 
  // wizardSession-Kategorie ist.
  // (Man könnte es auch weglassen, 
  //   weil wir ja am Start schon geprüft haben)
  const member = btnInteraction.member;
  if (!member || !("voice" in member) || !member.voice.channelId) {
    await btnInteraction.reply({
      content: "Du musst zuerst einem Voice-Channel beitreten – dem Warteraum!",
      ephemeral: true,
    });
    return false;
  }
  let wizardSession;
  try {
    const sessionResp = await axios.get(`${apiUrl}/wizard/${btnInteraction.user.id}`);
    wizardSession = sessionResp.data;
  } catch (err) {
    await btnInteraction.reply({
      content: "Fehler: Wizard-Session konnte nicht abgerufen werden.",
      ephemeral: true,
    });
    return false;
  }
  if (!wizardSession || !wizardSession.categoryId) {
    await btnInteraction.reply({
      content: "Fehler: Keine Kategorie in deiner Wizard-Session gefunden.",
      ephemeral: true,
    });
    return false;
  }
  let setupData;
  try {
    const setupResp = await axios.get(`${apiUrl}/setup`, {
      params: { categoryId: wizardSession.categoryId },
    });
    setupData = setupResp.data;
  } catch (err) {
    await btnInteraction.reply({
      content: "Fehler: Setup-Daten konnten nicht abgerufen werden.",
      ephemeral: true,
    });
    return false;
  }
  if (!setupData || !setupData.voiceChannelId) {
    await btnInteraction.reply({
      content: "Fehler: Für diese Kategorie wurde kein Warteraum eingerichtet.",
      ephemeral: true,
    });
    return false;
  }
  if (member.voice.channelId !== setupData.voiceChannelId) {
    await btnInteraction.reply({
      content: "Du musst zuerst in den Warteraum eintreten, um das Setup zu bedienen.",
      ephemeral: true,
    });
    return false;
  }
  return true;
}
