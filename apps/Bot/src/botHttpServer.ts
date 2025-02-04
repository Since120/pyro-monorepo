// apps\Bot\src\botHttpServer.ts

import express from "express";
import logger from "./services/logger";
import { z } from "zod";

// Routers
import { categoriesRouter } from "./routes/categoriesRouter";
import rolesRouter from "./routes/rolesRouter";
import { voiceChannelsRouter } from "./routes/voiceChannelsRouter";
import { textChannelsRouter } from "./routes/textChannelsRouter";
import { messagesRouter } from "./routes/messagesRouter";

/**
 * Starts an Express server to handle HTTP endpoints for Discord category/roles/etc.
 */
export function startBotHttpServer() {
  // Validate BOT_HTTP_PORT from environment
  const portSchema = z.string().regex(/^\d+$/).transform(Number).default("3002");
  const parseResult = portSchema.safeParse(process.env.BOT_HTTP_PORT);
  const port = parseResult.success ? parseResult.data : 3002;

  const app = express();
  app.use(express.json());

  // Register routes
  app.use("/discord/categories", categoriesRouter);
  app.use("/discord/roles", rolesRouter);
  app.use("/discord/voice-channels", voiceChannelsRouter);
  app.use("/discord/text-channels", textChannelsRouter);
  app.use("/discord/messages", messagesRouter);

  // Start server
  app.listen(port, () => {
    logger.info(`[botHttpServer] HTTP server running on port ${port}`);
  });
}
