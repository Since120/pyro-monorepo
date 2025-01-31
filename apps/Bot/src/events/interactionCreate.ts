// apps/Bot/src/events/interactionCreate.ts

import { Interaction } from 'discord.js';
import { client } from '../index';  
// ↑ Stell sicher, dass dies der richtige Pfad ist, also "../index" existiert!
//   Falls dein Bot-Einstieg woanders ist, passe den Pfad an.
import { handleSetupInteraction } from '../interaction_handlers/setupInteractions';

client.on('interactionCreate', async (interaction: Interaction) => {
  if (interaction.isChatInputCommand()) {
    // Hier kannst du Slash-Commands etc. abfangen
    // ...
  } else if (interaction.isButton()) {
    // Beispiel: du willst alle Buttons abfangen, die mit "setup:" beginnen
    if (interaction.customId.startsWith('setup:')) {
      await handleSetupInteraction(interaction);
    }
  }
});
