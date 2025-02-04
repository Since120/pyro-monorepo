// apps\Bot\src\events\voiceState\handleSwitch.ts

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
 * Handles the SWITCH event (oldState.channelId != null, newState.channelId != null, but different).
 * This logic was previously in voiceStateUpdate under "USER SWITCHES CHANNEL".
 */
export async function handleSwitch(oldState: VoiceState, newState: VoiceState) {
  const userId = newState.member?.id || oldState.member?.id;
  if (!userId) {
    logger.debug("[handleSwitch] => No user found => returning");
    return;
  }

  const guild = newState.guild;
  const leftChannelId = oldState.channelId;
  const joinedChannelId = newState.channelId;

  // If either is null, we bail out to satisfy TS + handle unexpected states safely
  if (!leftChannelId) {
    logger.debug("[handleSwitch] => leftChannelId is null => returning");
    return;
  }
  if (!joinedChannelId) {
    logger.debug("[handleSwitch] => joinedChannelId is null => returning");
    return;
  }

  logger.debug(
    `[handleSwitch] => user ${userId} switching channel from ${leftChannelId} to ${joinedChannelId}`
  );

  // ------------------- TREAT OLD CHANNEL AS LEAVE -------------------
  try {
    setTimeout(async () => {
      logger.debug(`[handleSwitch:roleRemoveTimer] => checking user ${userId} after 10s`);
      try {
        const mem = await guild.members.fetch(userId);
        if (!mem.voice.channelId) {
          logger.debug(`=> user ${userId} not in voice => check dynamic (SWITCH)`);
          if (await isDynamicChannel(leftChannelId)) {
            const catData = await axios.get(`${env.API_URL}/dynamic-voice-channels/lookup`, {
              params: { discordChannelId: leftChannelId },
            });
            const catId = catData.data.categoryId;
            logger.debug(`=> remove role from cat=${catId} (SWITCH)`);
            await removeDvcRoleFromUser(userId, catId);
          }
        } else {
          logger.debug(`=> user ${userId} is in some voice => skip removing role (SWITCH)`);
        }
      } catch (err) {
        logger.warn("[handleSwitch:roleRemoveTimer] => error:", err);
      }
    }, 10_000);

    // dynamic channel cleanup if empty
    if (await isDynamicChannel(leftChannelId)) {
      logger.debug(
        `[handleSwitch] => old channel ${leftChannelId} dynamic => set delete timer 10s`
      );
      setTimeout(async () => {
        const ch = guild.channels.cache.get(leftChannelId);
        if (ch?.type === ChannelType.GuildVoice && ch.members.size === 0) {
          logger.debug(
            `=> old channel ${leftChannelId} is empty => removing from Discord (SWITCH)`
          );
          try {
            await axios.delete(`${env.BOT_SERVICE_URL}/discord/voice-channels/${leftChannelId}`);
            logger.info(
              `[handleSwitch:channelDeleteTimer] => DVC ${leftChannelId} removed in Discord`
            );

            // get catId
            let catId = "";
            try {
              const lu = await axios.get(`${env.API_URL}/dynamic-voice-channels/lookup`, {
                params: { discordChannelId: leftChannelId },
              });
              catId = lu.data.categoryId || "";
              logger.debug(`=> catIdForCheck=${catId} (SWITCH)`);
            } catch (err) {
              logger.warn("=> lookup => 404? =>", err);
            }

            // markDeleted => do not remove from DB yet
            logger.debug("=> markDeleted => set deletedInDiscord=true... (SWITCH)");
            try {
              await axios.patch(`${env.API_URL}/dynamic-voice-channels/mark-deleted`, {
                discordChannelId: leftChannelId,
              });
            } catch (delErr) {
              logger.warn("=> error markDeleted dvc:", delErr);
            }

            if (catId) {
              setTimeout(() => {
                logger.debug(`[handleSwitch:catCheckTimer] => final check cat=${catId}`);
                checkCategoryEmptyThenRemoveRoleAndDvc(guild, catId);
              }, 15_000);
            }
          } catch (err) {
            logger.error("[handleSwitch:channelDeleteTimer] => error removing channel:", err);
          }
        } else {
          logger.debug(
            `[handleSwitch:channelDeleteTimer] => old channel ${leftChannelId} not empty => skip`
          );
        }
      }, 10_000);
    }

    // /tracking/leave
    const zoneCategoryInfo = await fetchZoneOrDynamicInfo(leftChannelId);
    if (zoneCategoryInfo && zoneCategoryInfo.zoneId) {
      const catResp = await axios.get(`${env.API_URL}/categories/${zoneCategoryInfo.categoryId}`);
      const category = catResp.data;
      if (category && category.trackingActive) {
        if (userHasAllowedRole(oldState.member?.roles.cache, category.allowedRoles)) {
          await axios.post(`${env.API_URL}/tracking/leave`, {
            userId,
            zoneId: zoneCategoryInfo.zoneId,
          });
          logger.debug(`[handleSwitch] => userLeftZone => done (zone=${zoneCategoryInfo.zoneId})`);
        }
      }
    }
  } catch (err) {
    logger.warn("[handleSwitch] => error in leave-block:", err);
  }

  // ------------------- TREAT NEW CHANNEL AS JOIN -------------------
  try {
    logger.debug(
      `[handleSwitch] => user ${userId} joined channel=${joinedChannelId} (switch-case)`
    );

    const zoneCategoryInfo = await fetchZoneOrDynamicInfo(joinedChannelId);
    if (!zoneCategoryInfo || !zoneCategoryInfo.zoneId) {
      return;
    }

    const catResp = await axios.get(`${env.API_URL}/categories/${zoneCategoryInfo.categoryId}`);
    const category = catResp.data;
    if (!category || !category.trackingActive) {
      return;
    }

    if (!userHasAllowedRole(newState.member?.roles.cache, category.allowedRoles)) {
      return;
    }

    await axios.post(`${env.API_URL}/tracking/join`, {
      userId,
      zoneId: zoneCategoryInfo.zoneId,
      userRoles: newState.member?.roles.cache.map((r) => r.id) || [],
    });
    logger.debug(`[handleSwitch] => userJoinedZone => done (zone=${zoneCategoryInfo.zoneId})`);
  } catch (err) {
    logger.warn("[handleSwitch] => error in join-block:", err);
  }
}
