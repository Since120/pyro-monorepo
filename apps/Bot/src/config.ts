// apps\Bot\src\config.ts

import * as dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { z } from "zod";
import logger from "./services/logger";

/**
 * First, we load and expand .env variables
 */
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

/**
 * Use Zod to strictly validate all required environment variables.
 * Adjust the defaults if needed.
 */
const envSchema = z.object({
  DISCORD_TOKEN: z.string().min(1, "Missing DISCORD_TOKEN"),
  GUILD_ID: z.string().min(1, "Missing GUILD_ID"),
  LOG_LEVEL: z.string().default("info"),
  API_URL: z.string().url().default("http://localhost:3004"),
  BOT_SERVICE_URL: z.string().url().default("http://localhost:3002"),
  BOT_HTTP_PORT: z.string().default("3002"),

  // Example for optional database URL:
  DATABASE_URL: z.string().optional(),

  // Optional NextAuth secrets, if needed:
  NEXTAUTH_SECRET: z.string().optional(),
  CLIENT_ID: z.string().optional(),
  CLIENT_SECRET: z.string().optional(),
});

/**
 * Perform the validation:
 */
const parsedEnv = envSchema.safeParse(process.env);
if (!parsedEnv.success) {
  logger.error("Invalid or missing environment variables:", parsedEnv.error.format());
  process.exit(1);
}

/**
 * Export the validated environment variables.
 * You can import `env` in other files to access them.
 */
export const env = parsedEnv.data;
