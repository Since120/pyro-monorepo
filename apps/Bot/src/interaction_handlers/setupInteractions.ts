import { ButtonInteraction, Interaction } from "discord.js";
import axios from "axios";
import { checkWaitingRoom } from "../utils/waitingRoomHelper";

const apiUrl = process.env.API_URL || "http://localhost:3004";

/**
 * Wird aufgerufen, wenn ein Button-Interaction mit customId "setup:..." ausgelöst wird.
 */
export async function handleSetupInteraction(interaction: Interaction) {
  // 1) Nur Button-Interaction relevant
  if (!interaction.isButton()) return;

  // 2) Prüfen, ob die customId mit "setup:" beginnt
  if (!interaction.customId.startsWith("setup:")) return;

  // 3) Beispiel: "setup:start:<categoryId>"
  //    Wir splitten in ["setup","start","<categoryId>"]
  const parts = interaction.customId.split(":");
  // parts[0] = "setup"
  // parts[1] = "start" (oder was anderes, falls du mehr Sub-Actions hast)
  // parts[2] = <categoryId> (sehr wichtig!)
  const subAction = parts[1];
  const categoryIdFromButton = parts[2];

  // Falls was fehlt, abbrechen
  if (!subAction || !categoryIdFromButton) {
    console.log("Setup-Button ohne gültige Kategorie geklickt:", interaction.customId);
    return;
  }

  // 4) Prüfen, ob der User wirklich im richtigen Warteraum der jeweiligen Kategorie sitzt
  const inWaitingRoom = await checkWaitingRoom(interaction as ButtonInteraction, categoryIdFromButton);
  if (!inWaitingRoom) {
    console.log("Setup abgebrochen: User nicht im korrekten Warteraum.");
    return;
  }

  // 5) (Optional) Wizard-Session auf die richtige Kategorie setzen,
  //    damit nachfolgende Steps dieselbe categoryId verwenden.
  try {
    await axios.post(`${apiUrl}/wizard/start`, {
      userId: interaction.user.id,
      categoryId: categoryIdFromButton,
    });
  } catch (err) {
    console.warn("WizardSession konnte nicht aktualisiert werden:", err);
  }

  // 6) Jetzt je nach subAction handeln
  if (subAction === "start") {
    // Beispiel-Antwort:
    await (interaction as ButtonInteraction).reply({
      content: "Du hast den Setup-Button geklickt. Weiter geht's!",
      ephemeral: true,
    });
  }

  // Falls du weitere Aktionen hast (z.B. "setup:stop:<catId>" o.ä.),
  // könntest du hier if/else ergänzen.
}
