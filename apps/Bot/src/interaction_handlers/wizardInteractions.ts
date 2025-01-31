// apps/Bot/src/interaction_handlers/wizardInteractions.ts


import { Interaction, ButtonInteraction } from 'discord.js';
import axios from 'axios';
import logger from '../services/logger';

const apiUrl = process.env.API_URL || 'http://localhost:3004';

export async function handleWizardInteraction(interaction: Interaction) {
  if (!interaction.isButton()) return;
  const { customId } = interaction as ButtonInteraction;

  // wizard:start:catId => extrahieren
  if (customId.startsWith('wizard:start')) {
    const parts = customId.split(':'); // z.B. ['wizard','start','CAT_123']
    const categoryId = parts[2] || 'NO_CATEGORY_ID';

    // 1) /wizard/start
    try {
      await axios.post(`${apiUrl}/wizard/start`, {
        userId: interaction.user.id,
        categoryId,
      });

      await interaction.reply({
        content: `Willst du Tracking aktivieren?\n(Deine Kategorie: ${categoryId})`,
        ephemeral: true,
        components: [
          {
            type: 1, // ActionRow
            components: [
              {
                type: 2, // Button
                label: 'Ja (Tracking)',
                style: 3, // SUCCESS
                customId: 'wizard:tracking_yes',
              },
              {
                type: 2,
                label: 'Nein (kein Tracking)',
                style: 4, // DANGER
                customId: 'wizard:tracking_no',
              },
            ],
          },
        ],
      });
    } catch (err) {
      logger.error('wizard:start => error:', err);
      await interaction.reply({ content: 'Fehler beim Wizard-Start', ephemeral: true });
    }
  }

  // wizard:tracking_yes => DB => trackingActive=true
  else if (customId === 'wizard:tracking_yes') {
    try {
      await axios.post(`${apiUrl}/wizard/step`, {
        userId: interaction.user.id,
        trackingActive: true,
      });
      // optional: finish
      await axios.patch(`${apiUrl}/wizard/finish`, { userId: interaction.user.id });
      await interaction.reply({
        content: 'Tracking ist aktiviert! Setup abgeschlossen.',
        ephemeral: true,
      });
    } catch (err) {
      logger.error('wizard:tracking_yes => error:', err);
      await interaction.reply({ content: 'Fehler beim Tracking-Aktivieren', ephemeral: true });
    }
  }

  // wizard:tracking_no => DB => trackingActive=false
  else if (customId === 'wizard:tracking_no') {
    try {
      await axios.post(`${apiUrl}/wizard/step`, {
        userId: interaction.user.id,
        trackingActive: false,
      });
      // optional: finish
      await axios.patch(`${apiUrl}/wizard/finish`, { userId: interaction.user.id });
      await interaction.reply({
        content: 'Kein Tracking gewählt! Setup abgeschlossen.',
        ephemeral: true,
      });
    } catch (err) {
      logger.error('wizard:tracking_no => error:', err);
      await interaction.reply({ content: 'Fehler beim Tracking-Deaktivieren', ephemeral: true });
    }
  }
}
