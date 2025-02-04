// apps\Bot\src\events\voiceState\index.ts

import { VoiceState } from "discord.js";
import logger from "../../services/logger";
import { handleLeave } from "./handleLeave";
import { handleJoin } from "./handleJoin";
import { handleSwitch } from "./handleSwitch";

/**
 * Main entry point for voiceStateUpdate events.
 * Decides if it's a leave, join, or switch and delegates accordingly.
 */
export default async function voiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  // Determine userId or exit if not found
  const userId = newState.member?.id || oldState.member?.id;
  if (!userId) {
    logger.debug("[voiceStateUpdate] => No user found => returning");
    return;
  }

  // Distinguish: leave, join, or switch
  if (oldState.channelId && !newState.channelId) {
    // Pure leave
    await handleLeave(oldState, newState);
  } else if (!oldState.channelId && newState.channelId) {
    // Pure join
    await handleJoin(oldState, newState);
  } else if (
    oldState.channelId &&
    newState.channelId &&
    oldState.channelId !== newState.channelId
  ) {
    // Switch
    await handleSwitch(oldState, newState);
  }
}
