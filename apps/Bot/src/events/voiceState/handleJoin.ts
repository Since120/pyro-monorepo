// apps\Bot\src\events\voiceState\handleJoin.ts

import { VoiceState } from "discord.js";
import logger from "../../services/logger";
import axios from "axios";
import { env } from "../../config";
import { fetchZoneOrDynamicInfo, userHasAllowedRole } from "./trackHelpers";

/**
 * Handles a pure JOIN event (oldState.channelId is null, newState.channelId is set).
 * This logic was previously in the big voiceStateUpdate function under "USER JOINS CHANNEL".
 */
export async function handleJoin(oldState: VoiceState, newState: VoiceState) {
  const userId = newState.member?.id;
  if (!userId) {
    logger.debug("[handleJoin] => No user found => returning");
    return;
  }

  //const guild = newState.guild;
  const joinedChannelId = newState.channelId;

  // If joinedChannelId is null for some reason, bail out
  if (!joinedChannelId) {
    logger.debug("[handleJoin] => joinedChannelId is null => returning");
    return;
  }

  logger.debug(`[handleJoin] => user ${userId} joined channel=${joinedChannelId}`);

  try {
    // 1) Check zone + category
    const zoneCategoryInfo = await fetchZoneOrDynamicInfo(joinedChannelId);
    if (!zoneCategoryInfo || !zoneCategoryInfo.zoneId) {
      // => no tracking
      return;
    }

    // 2) Check if tracking is active for this category
    const catResp = await axios.get(`${env.API_URL}/categories/${zoneCategoryInfo.categoryId}`);
    const category = catResp.data;
    if (!category || !category.trackingActive) {
      // => tracking is off
      return;
    }

    // 3) userHasAllowedRole => if user doesn't have the required role, skip
    if (!userHasAllowedRole(newState.member?.roles.cache, category.allowedRoles)) {
      return;
    }

    // => tracking/join
    await axios.post(`${env.API_URL}/tracking/join`, {
      userId,
      zoneId: zoneCategoryInfo.zoneId,
      userRoles: newState.member?.roles.cache.map((r) => r.id) || [],
    });

    logger.debug(`[handleJoin] => userJoinedZone => done (zone=${zoneCategoryInfo.zoneId})`);
  } catch (err) {
    logger.warn("[handleJoin] => tracking/join error:", err);
  }
}
