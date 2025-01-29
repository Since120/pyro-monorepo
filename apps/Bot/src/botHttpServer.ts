// apps/Bot/src/botHttpServer.ts

import express from "express";
import logger from "./services/logger";

// Unsere neuen Router-Dateien
import { categoriesRouter } from "./routes/categoriesRouter";
import { rolesRouter } from "./routes/rolesRouter";
import { voiceChannelsRouter } from "./routes/voiceChannelsRouter";

export function startBotHttpServer() {
  const app = express();
  app.use(express.json());

  // Mounting der alten Routen (Kategorien) und neuen (VoiceChannels, Roles)
  // => Pfade bleiben dieselben: /discord/categories, /discord/roles, /discord/voice-channels
  app.use("/discord/categories", categoriesRouter);
  app.use("/discord/roles", rolesRouter);
  app.use("/discord/voice-channels", voiceChannelsRouter);

  // Server starten
  const port = process.env.BOT_HTTP_PORT || 3002;
  app.listen(port, () => {
    logger.info(`[Bot] HTTP-Server läuft auf Port ${port}`);
  });
}