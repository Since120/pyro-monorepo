// apps/Bot/src/index.ts

import "dotenv/config";
import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import {
  Client,
  IntentsBitField,
  Collection,
  Interaction,
  VoiceState,
  StringSelectMenuInteraction,
  UserSelectMenuInteraction,
} from "discord.js";
import fs from "fs";
import path from "path";

import logger from "./services/logger";
import { ExtendedClient, BotCommand } from "./extendedClient";
import voiceStateUpdate from "./events/voiceStateUpdate";
import voiceStateUpdateNew from "./events/voiceStateUpdateNew";


// NEU: unser HTTP-Server, der API-Requests entgegen nimmt
import { startBotHttpServer } from "./botHttpServer";
import { registerDiscordEvents } from "./events"; // <--- unser "events/index.ts"
import axios from "axios";

export const ChannelsDeletedByApi = new Set<string>()
// 1) Bot-Client erstellen
export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildVoiceStates,
    // etc. je nach Bedarf ...
  ],
}) as ExtendedClient;

const myEnv = dotenv.config(); // Lädt deine .env
dotenvExpand.expand(myEnv);    // Erweitert Variablen wie ${POSTGRES_HOST} usw.

// 2) Slash Commands laden
client.commands = new Collection<string, BotCommand>();

const commandsPath = path.join(__dirname, "commands", "slashCommands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandModule = require(filePath);
  if (commandModule.data && commandModule.execute) {
    const cmdName = commandModule.data.name;
    client.commands.set(cmdName, {
      data: commandModule.data,
      execute: commandModule.execute,
    });
    logger.info(`Slash Command geladen: ${cmdName}`);
  }
}

// 3) HTTP-Server starten (NEU)
startBotHttpServer();

registerDiscordEvents(client);

// 4) Discord-Event: interactionCreate
client.on("interactionCreate", async (interaction: Interaction) => {
  // 4a) Slash Command
  if (interaction.isChatInputCommand()) {
    const { commandName } = interaction;
    const cmd = client.commands.get(commandName);
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
  // 4b) Button
  else if (interaction.isButton()) {
    const { handleButton } = require("./interaction_handlers/buttonInteractions");
    return handleButton(interaction);
  }
  // 4c) ModalSubmit
  else if (interaction.isModalSubmit()) {
    const { handleModal } = require("./interaction_handlers/modalInteractions");
    return handleModal(interaction);
  }
  // 4d) SelectMenu
  else if (interaction.isAnySelectMenu()) {
    const typedSelectMenu = interaction as StringSelectMenuInteraction | UserSelectMenuInteraction;
    const { handleSelectMenu } = require("./interaction_handlers/selectMenuInteractions");
    return handleSelectMenu(typedSelectMenu);
  }
});

// 5) VoiceStateUpdate
client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
  voiceStateUpdate(oldState, newState);
});

client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
  voiceStateUpdateNew(oldState, newState);
});


 // 5a) channelDelete => Wenn VoiceChannel in Discord manuell gelöscht wird,
 //     API benachrichtigen => patch voice-channels/discord-deleted
 client.on("channelDelete", async (channel) => {
   // Nur reagieren, wenn es ein Voice-Kanal ist (type=2 in Discord.js v14)
   if (channel.type === 2) { 
       // NEU: Prüfen, ob wir selbst diesen Kanal gelöscht haben
   if (ChannelsDeletedByApi.has(channel.id)) {
     ChannelsDeletedByApi.delete(channel.id); // wieder entfernen
     logger.info(`(channelDelete) => Kanal ${channel.id} wurde bewusst via API gelöscht. Ignoriere!`);
     return;
   }
     const discordChannelId = channel.id;
     const apiUrl = process.env.API_URL || "http://localhost:3000"; // passe ggf. an
     try {
       await axios.patch(`${apiUrl}/voice-channels/discord-deleted`, {
         discordChannelId
       });
       logger.info(`channelDelete => Mark VC=${discordChannelId} as deletedInDiscord`);
     } catch (err) {
       logger.warn("API call for channelDelete failed:", err);
     }
   }
 });



// 6) Bot-Login
const token = process.env.DISCORD_TOKEN;
if (!token) {
  logger.error("Fehler: Keine DISCORD_TOKEN in .env");
  process.exit(1);
}
client.login(token).then(() => {
  logger.info("Bot online!");
});
