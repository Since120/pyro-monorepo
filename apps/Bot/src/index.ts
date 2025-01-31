// apps/Bot/src/index.ts

import "dotenv/config";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import {
  Client,
  IntentsBitField,
  Collection,
  Interaction,
  VoiceState,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
  Channel,
  ChannelType,
} from "discord.js";
import fs from "fs";
import path from "path";
import axios from "axios";

import logger from "./services/logger";
import voiceStateUpdate from "./events/voiceStateUpdate";
import { startBotHttpServer } from "./botHttpServer";


// Merkt sich Voice-Kanäle, die wir selber per API löschen
export const ChannelsDeletedByApi = new Set<string>();

// 1) dotenv laden
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// 2) Discord-Client erstellen
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});


client.on("channelDelete", async (channel) => {
  // Prüfen ob Kanal vom Bot/der API selbst gelöscht wurde:
  if (ChannelsDeletedByApi.has(channel.id)) {
    ChannelsDeletedByApi.delete(channel.id);
    logger.info(`(channelDelete) => Kategorie ${channel.id} via API gelöscht, ignoriere...`);
    return;
  }

  // Falls es eine Kategorie ist => Patch an /categories/discord-deleted
  if (channel.type === ChannelType.GuildCategory) {
    try {
      const apiUrl = process.env.API_URL || "http://localhost:3004";
      await axios.patch(`${apiUrl}/categories/discord-deleted`, {
        discordCategoryId: channel.id,
      });
      logger.info(`channelDelete => Markiere Category=${channel.id} als deletedInDiscord`);
    } catch (err) {
      logger.warn("API call for categoryDelete failed:", err);
    }
  }

  // Sonst, wenn es ein Voice-Channel ist => die bestehende Logik
  if (channel.type === ChannelType.GuildVoice) {
    // ... Dein existierender Code
  }
  // Falls du TextChannels, etc. unterscheiden willst: ...
});


client.on("interactionCreate", async (interaction) => {
  // ...
  if (interaction.isButton()) {
    // (A) Wizard
    if (interaction.customId.startsWith("wizard:")) {
      const { handleWizardInteraction } = require("./interaction_handlers/wizardInteractions");
      return handleWizardInteraction(interaction);
    }
    // (B) Falls du noch andere Buttons hast, z.B. "voice_setting_..."
    //     hier abfragen ...
  }
});


// 3) Optional: Slash Command Collection
(client as any).commands = new Collection<string, any>();

// 3b) Falls du Slash-Commands laden willst (Ordner existiert?):
const commandsPath = path.join(__dirname, "commands", "slashCommands");
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = require(filePath);
    if (commandModule.data && commandModule.execute) {
      const cmdName = commandModule.data.name;
      (client as any).commands.set(cmdName, {
        data: commandModule.data,
        execute: commandModule.execute,
      });
      logger.info(`Slash Command geladen: ${cmdName}`);
    }
  }
}

// 4) HTTP-Server starten
startBotHttpServer();

// 5) Interactions (slash/modal/selectMenu) — Button-Handling separat in wizardInteractions
client.on("interactionCreate", async (interaction: Interaction) => {
  // 5a) Slash Commands
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;
    const cmd = (client as any).commands.get(commandName);
    if (!cmd) {
      return interaction.reply({ content: "Unbekannter Slash-Befehl!", ephemeral: true });
    }
    try {
      await cmd.execute(interaction);
    } catch (err) {
      logger.error("Slash Command Error:", err);
      if (!interaction.replied) {
        await interaction.reply({ content: "Fehler!", ephemeral: true });
      }
    }
  }
  // 5b) Button => (VERALTETER Code entfernt)
  // 5c) ModalSubmit
  else if (interaction.isModalSubmit()) {
    const { handleModal } = require("./interaction_handlers/modalInteractions");
    return handleModal(interaction);
  }
  // 5d) SelectMenu
  else if (interaction.isAnySelectMenu()) {
    const typedSelectMenu = interaction as StringSelectMenuInteraction | UserSelectMenuInteraction;
    const { handleSelectMenu } = require("./interaction_handlers/selectMenuInteractions");
    return handleSelectMenu(typedSelectMenu);
  }
});

// 6) VoiceStateUpdate
client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
  voiceStateUpdate(oldState, newState);
});

// 7) channelDelete => Falls VoiceChannel in Discord manuell gelöscht wird
client.on("channelDelete", async (channel: Channel) => {
  if (channel.type === ChannelType.GuildVoice) {
    if (ChannelsDeletedByApi.has(channel.id)) {
      ChannelsDeletedByApi.delete(channel.id);
      logger.info(`(channelDelete) => Kanal ${channel.id} via API gelöscht, ignoriere.`);
      return;
    }
    const discordChannelId = channel.id;
    const apiUrl = process.env.API_URL || "http://localhost:3000";
    try {
      await axios.patch(`${apiUrl}/voice-channels/discord-deleted`, {
        discordChannelId,
      });
      logger.info(`channelDelete => Mark VC=${discordChannelId} as deletedInDiscord`);
    } catch (err) {
      logger.warn("API call for channelDelete failed:", err);
    }
  }
});

// 8) Bot-Login
const token = process.env.DISCORD_TOKEN;
if (!token) {
  logger.error("Fehler: Keine DISCORD_TOKEN in .env");
  process.exit(1);
}
client.login(token).then(() => {
  logger.info("Bot online!");
});

export { client };
