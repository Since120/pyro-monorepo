// KOMPLETTE Datei: apps/Bot/src/events/index.ts

import { ExtendedClient } from "../extendedClient";
import { channelDeleteHandler } from "./channelDeleteHandler";

export function registerDiscordEvents(client: ExtendedClient) {
  // channelDelete
  client.on("channelDelete", channelDeleteHandler);

  // Weitere Events bei Bedarf...
}
