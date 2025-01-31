// apps/Bot/src/events/voiceStateUpdate.ts
import { VoiceState } from "discord.js";
import axios from "axios";
import logger from "../services/logger";

/**
 * NEUES voiceStateUpdate, das die 
 * /tracking/join + /tracking/leave Endpunkte anpingt.
 */
export default async function voiceStateUpdateNew(oldState: VoiceState, newState: VoiceState) {
  // 1) Prüfen, ob User einen VoiceChannel betritt
  const apiUrl = process.env.API_URL || "http://localhost:3004"; // oder 3000, je nachdem
  const userId = newState.member?.id;  // oder oldState.member?.id
  if (!userId) return;

  // 2) zoneId herausfinden
  //    => wie? Du hast in DB voiceChannel.discordChannelId => zoneId => zone
  //    => hier z.B. per axios GET /voice-channels?discordId=...
  //    => oder via /zones?filter=...
  //    => zur Demo: wir tun so, als könnten wir es resolven:

  const findZoneIdForChannel = async (discordChannelId: string) => {
    // Minimal-Demo: GET /voice-channels/lookup?discordChannelId=...
    try {
      const resp = await axios.get(`${apiUrl}/voice-channels/lookup`, {
        params: { discordChannelId },
      });
      // => { zoneId: '...' }
      return resp.data.zoneId as string | null;
    } catch (err) {
      logger.warn("channel -> zone lookup fail", err);
      return null;
    }
  };

  // 3) Jemand joined => newState.channelId != null, oldState.channelId == null
  if (!oldState.channelId && newState.channelId) {
    // user joins
    const zoneId = await findZoneIdForChannel(newState.channelId);
    if (!zoneId) {
      // Kein Mapping => skip
      return;
    }
    // userRoles => array of string IDs
    const roles = newState.member?.roles.cache.map(r => r.id) || [];

    // 4) ruf /tracking/join
    try {
      await axios.post(`${apiUrl}/tracking/join`, {
        userId,
        zoneId,
        userRoles: roles,
      });
      logger.info(`[voiceStateUpdateNew] userJoined => zone=${zoneId}, userId=${userId}`);
    } catch (err) {
      logger.error("tracking/join failed:", err);
    }
  }
  // 5) Jemand verlässt => oldState.channelId != null, newState.channelId == null
  else if (oldState.channelId && !newState.channelId) {
    // user leaves
    const zoneId = await findZoneIdForChannel(oldState.channelId);
    if (!zoneId) {
      return;
    }
    try {
      await axios.post(`${apiUrl}/tracking/leave`, {
        userId,
        zoneId,
      });
      logger.info(`[voiceStateUpdateNew] userLeft => zone=${zoneId}, userId=${userId}`);
    } catch (err) {
      logger.error("tracking/leave failed:", err);
    }
  }
}
