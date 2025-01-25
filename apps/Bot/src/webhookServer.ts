import express from "express";
import logger from "./services/logger";
import { createDiscordCategory, updateDiscordCategory, deleteDiscordCategory } from "./services/discordCategorySync";

export function startWebhookServer() {
  const app = express();
  app.use(express.json());

  app.post("/webhooks/categories", async (req, res) => {
    const { event, data } = req.body;
    logger.info(`Webhook erhalten: event=${event}, data=${JSON.stringify(data)}`);

    if (event === "category_created") {
      // => Discord-Kategorie anlegen:
      await createDiscordCategory(data.id, data.name);

    } else if (event === "category_updated") {
      // => rename
      await updateDiscordCategory(data.id, data.name);

    } else if (event === "category_deleted") {
      // => delete
      await deleteDiscordCategory(data.id);

    } else {
      logger.warn(`Unbekanntes Event: ${event}`);
    }

    return res.status(200).json({ ok: true });
  });

  const port = process.env.BOT_WEBHOOK_PORT || "3002";
  app.listen(port, () => {
    logger.info(`✅ Webhook-Server läuft auf Port ${port} ...`);
  });
}
