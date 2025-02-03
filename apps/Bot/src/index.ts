// apps/Bot/src/index.ts

import "dotenv/config";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";

import { Client, IntentsBitField, Channel, ChannelType, VoiceState, Interaction } from "discord.js";

import logger from "./services/logger";
import fs from "fs";
import path from "path";
import axios from "axios";

// Dein voiceStateUpdate-Handler
import voiceStateUpdate from "./events/voiceStateUpdate";
// Dein HTTP-Server
import { startBotHttpServer } from "./botHttpServer";

// 1) dotenv laden
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

/** 
 * Hier definieren wir den client EXPLIZIT ganz oben.
 * UND exportieren ihn, damit "interactionCreate.ts" es importieren kann.
 */
export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

// Ggf. globale Sets hier:
export const ChannelsDeletedByApi = new Set<string>();

// Beispiel: channelDelete-Event
client.on("channelDelete", async (channel: Channel) => {
  if (ChannelsDeletedByApi.has(channel.id)) {
    ChannelsDeletedByApi.delete(channel.id);
    logger.info(`(channelDelete) => Kategorie/Channel ${channel.id} via API gelöscht, ignoriere...`);
    return;
  }
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
  // VoiceChannel-Logik, etc.
});

// 2) Optional: Slash-Commands laden
(client as any).commands = new Map();
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

// 3) HTTP-Server starten
startBotHttpServer();

// 4) Restliche Interactions (SlashCommands, etc.)
client.on("interactionCreate", async (interaction: Interaction) => {
  // Hier z.B. Slash Commands etc.
  if (interaction.isChatInputCommand()) {
    const cmd = (client as any).commands.get(interaction.commandName);
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
    }}
});

// 5) Voice-State-Update
client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
  voiceStateUpdate(oldState, newState);
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

// 7) GANZ WICHTIG:
// JETZT importieren wir DEIN interactionCreate-File
// => Dort wird "import { client } from '../index';" klappen,
//    weil wir es JETZT schon exportiert haben.
import "./events/interactionCreate";
