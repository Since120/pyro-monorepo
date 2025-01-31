// Pfad: apps/Bot/src/events/interactionCreate.ts
import { Interaction } from 'discord.js';
import { client } from '../index';
import { handleWizardInteraction } from '../interaction_handlers/wizardInteractions'; // Unser Wizard-Handler


client.on("interactionCreate", async (interaction) => {
  // ... vorhandener Code, z.B. SlashCommands, etc.

  if (interaction.isButton()) {
    if (interaction.customId.startsWith("wizard:")) {
      const { handleWizardInteraction } = require("./interaction_handlers/wizardInteractions");
      return handleWizardInteraction(interaction);
    }
  }
});
