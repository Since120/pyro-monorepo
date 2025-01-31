// apps/Bot/src/interaction_handlers/setupInteractions.ts
import { ButtonInteraction, Interaction } from 'discord.js';
import axios from 'axios';

/**
 * Du rufst diese Funktion aus `interactionCreate` auf, wenn `customId` mit "setup:" beginnt.
 */
export async function handleSetupInteraction(interaction: Interaction) {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith('setup:')) return;

  const subAction = interaction.customId.split(':')[1];
  if (subAction === 'start') {
    // Hier kommt dein API-Aufruf oder was du machen willst
    // z.B. "interaction.reply('Los gehts mit dem Setup!')"
    await interaction.reply({
      content: 'Du hast den Setup-Button geklickt. Weiter geht\'s!',
      ephemeral: true, // oder false
    });
  }
}
