// apps\Bot\src\events\voiceState\handleLeave.ts

import { VoiceState, ChannelType } from "discord.js";
import logger from "../../services/logger";
import axios from "axios";
import { env } from "../../config";
import {
  isDynamicChannel,
  removeDvcRoleFromUser,
  checkCategoryEmptyThenRemoveRoleAndDvc,
} from "./dynamicCleanup";
import { fetchZoneOrDynamicInfo, userHasAllowedRole } from "./trackHelpers";

/**
 * Handles a pure LEAVE event (oldState.channelId is set, newState.channelId is null).
 * This logic was previously in the big voiceStateUpdate function under "USER LEAVES CHANNEL".
 */
export async function handleLeave(oldState: VoiceState, newState: VoiceState) {
  const userId = oldState.member?.id;
  if (!userId) {
    logger.debug("[handleLeave] => No user found => returning");
    return;
  }

  const guild = oldState.guild;
  const leftChannelId = oldState.channelId;

  // If for some reason leftChannelId is null, we can't proceed.
  if (!leftChannelId) {
    logger.debug("[handleLeave] => leftChannelId is null => returning");
    return;
  }

  logger.debug(`[handleLeave] => user ${userId} left channel=${leftChannelId}`);

  // (A) => remove dynamic role if needed (after 10s)
  setTimeout(async () => {
    logger.debug(`[handleLeave:roleRemoveTimer] => checking user ${userId} after 10s`);
    try {
      const mem = await guild.members.fetch(userId);
      if (!mem.voice.channelId) {
        logger.debug(`=> user ${userId} is still not in voice => check dynamic`);
        if (await isDynamicChannel(leftChannelId)) {
          const catData = await axios.get(`${env.API_URL}/dynamic-voice-channels/lookup`, {
            params: { discordChannelId: leftChannelId },
          });
          const catId = catData.data.categoryId;
          logger.debug(`=> remove role from cat=${catId}`);
          await removeDvcRoleFromUser(userId, catId);
        }
      } else {
        logger.debug(`=> user ${userId} re-joined voice => skip removing role`);
      }
    } catch (err) {
      logger.warn("[handleLeave:roleRemoveTimer] => error:", err);
    }
  }, 10_000);

  // (B) => dynamic channel cleanup if empty
  if (await isDynamicChannel(leftChannelId)) {
    logger.debug(`[handleLeave] => channel ${leftChannelId} is dynamic => set delete timer 10s`);
    setTimeout(async () => {
      const ch = guild.channels.cache.get(leftChannelId);
      if (ch?.type === ChannelType.GuildVoice && ch.members.size === 0) {
        logger.debug(`=> channel ${leftChannelId} is empty => removing from Discord`);
        try {
          await axios.delete(`${env.BOT_SERVICE_URL}/discord/voice-channels/${leftChannelId}`);
          logger.info(
            `[handleLeave:channelDeleteTimer] => DVC ${leftChannelId} removed in Discord`
          );

          // get catId
          let catId = "";
          try {
            const lu = await axios.get(`${env.API_URL}/dynamic-voice-channels/lookup`, {
              params: { discordChannelId: leftChannelId },
            });
            catId = lu.data.categoryId || "";
            logger.debug(`=> catIdForCheck=${catId}`);
          } catch (err) {
            logger.warn("=> lookup => 404? =>", err);
          }

          // markDeleted => do not remove from DB yet
          logger.debug("=> markDeleted => set deletedInDiscord=true...");
          try {
            await axios.patch(`${env.API_URL}/dynamic-voice-channels/mark-deleted`, {
              discordChannelId: leftChannelId,
            });
          } catch (delErr) {
            logger.warn("=> error markDeleted dvc:", delErr);
          }

          if (catId) {
            setTimeout(() => {
              logger.debug(`[handleLeave:catCheckTimer] => final check cat=${catId}`);
              checkCategoryEmptyThenRemoveRoleAndDvc(guild, catId);
            }, 15_000);
          }
        } catch (err) {
          logger.error("[handleLeave:channelDeleteTimer] => error removing channel:", err);
        }
      } else {
        logger.debug(
          `[handleLeave:channelDeleteTimer] => channel ${leftChannelId} not empty => skip`
        );
      }
    }, 10_000);
  }

  // (C) => /tracking/leave
  try {
    const zoneCategoryInfo = await fetchZoneOrDynamicInfo(leftChannelId);
    if (!zoneCategoryInfo || !zoneCategoryInfo.zoneId) {
      return; // => no tracking
    }

    // check if tracking is active
    const catResp = await axios.get(`${env.API_URL}/categories/${zoneCategoryInfo.categoryId}`);
    const category = catResp.data;
    if (!category || !category.trackingActive) {
      return; // => not tracking
    }

    // check userHasAllowedRole
    if (!userHasAllowedRole(newState.member?.roles.cache, category.allowedRoles)) {
      return;
    }

    // => /tracking/leave
    await axios.post(`${env.API_URL}/tracking/leave`, {
      userId,
      zoneId: zoneCategoryInfo.zoneId,
    });
    logger.debug(`[handleLeave] => userLeftZone => done (zone=${zoneCategoryInfo.zoneId})`);
  } catch (err) {
    logger.warn("[handleLeave] => tracking/leave error:", err);
  }
}
