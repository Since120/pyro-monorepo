// apps/Bot/src/index.ts

import "dotenv/config";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import { z } from "zod";
import {
  Client,
  IntentsBitField,
  Channel,
  ChannelType,
  VoiceState,
  Interaction,
  ChatInputCommandInteraction,
} from "discord.js";
import fs from "fs";
import path from "path";
import axios from "axios";
import logger from "./services/logger";
import voiceStateUpdate from "./events/voiceState";
import { startBotHttpServer } from "./botHttpServer";

/**
 * An interface representing our Slash Commands.
 * Adjust fields if your commands have additional properties.
 */
interface SlashCommand {
  data: {
    name: string;
    // Optionally add e.g. description, options, etc.
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void> | void;
}

/**
 * Extend the Discord.js Client to hold a 'commands' Map.
 */
interface ExtendedClient extends Client {
  commands: Map<string, SlashCommand>;
}

/**
 * 1) Load and expand .env variables
 */
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

/**
 * 2) Validate critical environment variables via Zod
 */
const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "Missing DISCORD_TOKEN"),
  GUILD_ID: z.string().optional(),
  LOG_LEVEL: z.string().default("info"),
  API_URL: z.string().url().default("http://localhost:3004"),
  BOT_SERVICE_URL: z.string().url().optional(),
  BOT_HTTP_PORT: z.string().default("3002"),
});

const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  logger.error("[index.ts] Invalid or missing environment variables:", parsedEnv.error.format());
  process.exit(1);
}
const env = parsedEnv.data;

/**
 * 3) Create the Discord client at the top and export it
 */
export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildVoiceStates,
  ],
});

/**
 * 4) Transform 'client' into our ExtendedClient
 */
const extendedClient = client as ExtendedClient;
extendedClient.commands = new Map();

/**
 * If the bot or other modules need to know about channels deleted by the API
 */
export const ChannelsDeletedByApi = new Set<string>();

/**
 * channelDelete event -> checks if channel was deleted by the API or manually in Discord
 */
client.on("channelDelete", async (channel: Channel) => {
  if (ChannelsDeletedByApi.has(channel.id)) {
    ChannelsDeletedByApi.delete(channel.id);
    logger.info(`(channelDelete) => Category/Channel ${channel.id} deleted via API, ignoring...`);
    return;
  }
  if (channel.type === ChannelType.GuildCategory) {
    try {
      const apiUrl = env.API_URL;
      await axios.patch(`${apiUrl}/categories/discord-deleted`, {
        discordCategoryId: channel.id,
      });
      logger.info(`(channelDelete) => Marked Category=${channel.id} as deletedInDiscord`);
    } catch (err) {
      logger.warn("API call for categoryDelete failed:", err);
    }
  }
  // Potential voiceChannel logic, etc. could go here if needed
});

/**
 * Dynamically load slash commands from the "commands/slashCommands" folder.
 * This replaces the old require() calls with asynchronous imports.
 */
async function loadSlashCommands() {
  const commandsPath = path.join(__dirname, "commands", "slashCommands");
  if (!fs.existsSync(commandsPath)) {
    return;
  }
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts") || file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    // Dynamically import instead of require
    const commandModule = await import(filePath);
    if (commandModule.data && commandModule.execute) {
      const cmdName = commandModule.data.name;
      extendedClient.commands.set(cmdName, {
        data: commandModule.data,
        execute: commandModule.execute,
      });
      logger.info(`Slash Command loaded: ${cmdName}`);
    }
  }
}

/**
 * Start the bot logic inside an async IIFE, so we can await loadSlashCommands.
 */
(async function startBot() {
  // 5) Load slash commands
  await loadSlashCommands();

  // 6) Start HTTP server for bot routes
  startBotHttpServer();

  /**
   * 7) Handle interactionCreate event -> slash commands or other interactions
   */
  client.on("interactionCreate", async (interaction: Interaction): Promise<void> => {
    // 7.1) Slash Commands
    if (interaction.isChatInputCommand()) {
      const cmd = extendedClient.commands.get(interaction.commandName);
      if (!cmd) {
        await interaction.reply({ content: "Unbekannter Slash-Befehl!", ephemeral: true });
        return;
      }
      try {
        await cmd.execute(interaction);
      } catch (err) {
        logger.error("Slash Command Error:", err);
        if (!interaction.replied) {
          await interaction.reply({ content: "Fehler!", ephemeral: true });
        }
      }
      return;
    }
    // 7.2) If your Buttons/Modals are handled in "events/interactionCreate.ts",
    //      you can omit additional logic here. Just ensure "return;" eventually.
  });

  /**
   * 8) Listen to voiceStateUpdate events
   */
  client.on("voiceStateUpdate", (oldState: VoiceState, newState: VoiceState) => {
    voiceStateUpdate(oldState, newState);
  });

  /**
   * 9) Bot login
   */
  const token = env.DISCORD_TOKEN;
  if (!token) {
    logger.error("Error: DISCORD_TOKEN is missing in .env");
    process.exit(1);
  }
  await client.login(token);
  logger.info("Bot is online!");

  // 10) Import your 'interactionCreate' file last
  //     so "import { client } from '../index';" works as intended.
  await import("./events/interactionCreate");
})();
