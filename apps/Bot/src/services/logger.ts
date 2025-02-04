// apps\Bot\src\services\logger.ts

import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, colorize } = format;

/**
 * Defines a custom format for Winston logger.
 */
const myFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

/**
 * Creates and exports the logger instance used throughout the bot.
 */
const logger = createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), colorize(), myFormat),
  transports: [
    new transports.Console(),
    // optionally add more transports here (e.g. File)
  ],
});

export default logger;
