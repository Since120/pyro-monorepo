// Pfad: apps/Bot/src/events/voiceStateUpdate.ts

import { VoiceState, ChannelType } from "discord.js";
import axios from "axios";
import logger from "../services/logger";

const apiUrl = process.env.API_URL || "http://localhost:3004";
const botUrl = process.env.BOT_SERVICE_URL || "http://localhost:3002";

export default async function voiceStateUpdateNew(oldState: VoiceState, newState: VoiceState) {
  const userId = newState.member?.id || oldState.member?.id;
  if (!userId) {
    logger.debug("[voiceStateUpdate] => no user => return");
    return;
  }
  const guild = newState.guild;

  // =======================================================================
  // HILFSFUNKTIONEN
  // =======================================================================

  // 1) Check if channel is dynamic
  async function isDynamicChannel(chId: string): Promise<boolean> {
    try {
      const r = await axios.get(`${apiUrl}/dynamic-voice-channels/lookup`, {
        params: { discordChannelId: chId },
      });
      logger.debug(`[isDynamicChannel] => zoneId=${r.data.zoneId}, catId=${r.data.categoryId}`);
      return !!r.data.zoneId; // true, falls zoneId gefunden => dynamic
    } catch (err: any) {
      if (err.response?.status === 404) {
        logger.debug("[isDynamicChannel] => 404 => not dynamic");
        return false;
      }
      logger.warn("[isDynamicChannel] => error:", err);
      return false;
    }
  }

  // 2) removeDvcRoleFromUser
  async function removeDvcRoleFromUser(uid: string, catId: string) {
    logger.debug(`[removeDvcRoleFromUser] => user=${uid}, cat=${catId}`);
    // getAnyRole => NICHT gefiltert
    const resp = await axios.get(`${apiUrl}/dynamic-voice-channels/any-role`, {
      params: { categoryId: catId },
    });
    const roleId = resp.data?.roleId;
    if (!roleId) {
      logger.debug(" => no dvc-role => skip");
      return;
    }
    await axios.post(`${botUrl}/discord/roles/remove`, { userId: uid, roleId });
    logger.info(`[removeDvcRoleFromUser] => removed role ${roleId} from user ${uid} (cat=${catId})`);
  }

  // 3) checkCategoryEmptyThenRemoveRoleAndDvc
  async function checkCategoryEmptyThenRemoveRoleAndDvc(categoryId: string) {
    logger.debug(`[checkCategoryEmptyThenRemoveRoleAndDvc] => cat=${categoryId}`);

    // (A) load DVC from DB
    let dvcs: any[] = [];
    try {
      const dvResp = await axios.get(`${apiUrl}/dynamic-voice-channels`, {
        params: { categoryId },
      });
      dvcs = dvResp.data;
      logger.debug(` => found ${dvcs.length} DVC(s) in cat=${categoryId}`);
    } catch (err) {
      logger.warn("[checkCatEmpty] => error loading dvcs:", err);
      return;
    }

    // (B) any user in those DVCs?
    for (const dvc of dvcs) {
      logger.debug(` => dvc.id=${dvc.id}, discChanId=${dvc.discordChannelId}, deletedInDiscord=${dvc.deletedInDiscord}`);
      if (!dvc.discordChannelId) continue;
      const ch = guild.channels.cache.get(dvc.discordChannelId);
      if (ch?.type === ChannelType.GuildVoice && ch.members.size > 0) {
        logger.debug(" => found user => cat not empty => return");
        return;
      }
    }

    // (C) check waiting-room
    let setup: any;
    try {
      const st = await axios.get(`${apiUrl}/setup`, { params: { categoryId } });
      setup = st.data;
      logger.debug(` => setup voiceChannelId=${setup.voiceChannelId}`);
    } catch {}
    if (setup?.voiceChannelId) {
      const wr = guild.channels.cache.get(setup.voiceChannelId);
      if (wr?.type === ChannelType.GuildVoice && wr.members.size > 0) {
        logger.debug(" => waitingRoom is not empty => return");
        return;
      }
    }

    // => cat is truly empty => remove role, then leftover DVC
    logger.debug(" => cat empty => removing role & leftoverDVC in DB");
    try {
      const rr = await axios.get(`${apiUrl}/dynamic-voice-channels/any-role`, {
        params: { categoryId },
      });
      const foundRoleId = rr.data?.roleId;
      if (foundRoleId) {
        logger.debug(` => removing roleId=${foundRoleId}`);
        await axios.delete(`${botUrl}/discord/roles/${foundRoleId}`);
        logger.info(`[checkCategoryEmpty] => role ${foundRoleId} COMPLETELY removed (cat=${categoryId})`);
      } else {
        logger.debug(" => no role => skip remove");
      }
    } catch (err) {
      logger.warn("[checkCategoryEmpty] => error removing role:", err);
    }

    // (D) leftover dvc final remove or mark
    try {
      const reload = await axios.get(`${apiUrl}/dynamic-voice-channels`, { params: { categoryId } });
      for (const dd of reload.data) {
        if (dd.deletedInDiscord === false) {
          logger.debug(` => leftoverDVC => id=${dd.id} => mark as deletedInDiscord`);
          await axios
            .patch(`${apiUrl}/dynamic-voice-channels/mark-deleted`, {
              discordChannelId: dd.discordChannelId,
            })
            .catch((e) => logger.warn(" leftover dvc patch err:", e));
        }
      }

      // Hard-Delete alle, die jetzt `deletedInDiscord=true` haben
      logger.debug(` => Hard-Delete all DVC with deletedInDiscord=true in cat=${categoryId}`);
      await axios.delete(`${apiUrl}/dynamic-voice-channels/hard-delete`, {
        params: { categoryId },
      });

      logger.debug(" => leftover cleaned => done");
    } catch (err) {
      logger.warn(" => leftoverDvc => error:", err);
    }
    logger.debug("[checkCategoryEmpty] => finished cat cleanup => done");
  }

  // =======================================================================
  // (1) USER LEAVES CHANNEL (reiner LEAVE)
  // =======================================================================
  if (oldState.channelId && !newState.channelId) {
    logger.debug(`[voiceStateUpdate] => user ${userId} left channel=${oldState.channelId}`);
    const leftChannelId = oldState.channelId;

    // -------------------------------------------
    // (A) => remove dynamic role if needed
    // -------------------------------------------
    setTimeout(async () => {
      logger.debug(`[roleRemoveTimer] => checking user ${userId} after 10s`);
      try {
        const mem = await guild.members.fetch(userId);
        if (!mem.voice.channelId) {
          logger.debug(` => user ${userId} still not in voice => check dynamic`);
          if (await isDynamicChannel(leftChannelId)) {
            const catData = await axios.get(`${apiUrl}/dynamic-voice-channels/lookup`, {
              params: { discordChannelId: leftChannelId },
            });
            const catId = catData.data.categoryId;
            logger.debug(` => remove role from cat=${catId}`);
            await removeDvcRoleFromUser(userId, catId);
          }
        } else {
          logger.debug(` => user ${userId} re-joined voice => skip removing role`);
        }
      } catch (err) {
        logger.warn("[roleRemoveTimer] => error:", err);
      }
    }, 10_000);

    // -------------------------------------------
    // (B) => dynamic channel cleanup if empty
    // -------------------------------------------
    if (await isDynamicChannel(leftChannelId)) {
      logger.debug(`[voiceStateUpdate] => channel ${leftChannelId} dynamic => set delete timer 10s`);
      setTimeout(async () => {
        const ch = guild.channels.cache.get(leftChannelId);
        if (ch?.type === ChannelType.GuildVoice && ch.members.size === 0) {
          logger.debug(` => channel ${leftChannelId} is empty => removing from Discord`);
          try {
            await axios.delete(`${botUrl}/discord/voice-channels/${leftChannelId}`);
            logger.info(`[channelDeleteTimer] => DVC ${leftChannelId} removed in Discord`);

            // get catId
            let catId = "";
            try {
              const lu = await axios.get(`${apiUrl}/dynamic-voice-channels/lookup`, {
                params: { discordChannelId: leftChannelId },
              });
              catId = lu.data.categoryId || "";
              logger.debug(` => catIdForCheck=${catId}`);
            } catch (err) {
              logger.warn(" => lookup => 404? =>", err);
            }

            // markDeleted => do not remove from DB yet
            logger.debug(" => markDeleted => set deletedInDiscord=true...");
            try {
              await axios.patch(`${apiUrl}/dynamic-voice-channels/mark-deleted`, {
                discordChannelId: leftChannelId,
              });
            } catch (delErr) {
              logger.warn(" => error markDeleted dvc:", delErr);
            }

            if (catId) {
              setTimeout(() => {
                logger.debug(`[catCheckTimer] => final check cat=${catId}`);
                checkCategoryEmptyThenRemoveRoleAndDvc(catId);
              }, 15_000);
            }
          } catch (err) {
            logger.error("[channelDeleteTimer] => error removing channel:", err);
          }
        } else {
          logger.debug(`[channelDeleteTimer] => channel ${leftChannelId} not empty => skip`);
        }
      }, 10_000);
    }

    // -------------------------------------------
    // (C) => /tracking/leave, falls Category trackt + User getrackt
    // -------------------------------------------
    try {
      // 1) Zone + Category lookup => Normal oder dynamic
      const zoneCategoryInfo = await fetchZoneOrDynamicInfo(leftChannelId);
      if (!zoneCategoryInfo || !zoneCategoryInfo.zoneId) {
        // => kein Tracking
        return;
      }

      // 2) Category => check if trackingActive
      const catResp = await axios.get(`${apiUrl}/categories/${zoneCategoryInfo.categoryId}`);
      const category = catResp.data;
      if (!category || !category.trackingActive) {
        // => NICHT tracken
        return;
      }

      // 3) userGlobalStats => isTracked
      const gStats = await axios
        .get(`${apiUrl}/wizard/${userId}`)
        .then((r) => r.data)
        .catch(() => null);

      // Oder: if (!gStats?.isTracked) return;

      // Im einfachsten Fall checken wir nur "allowedRoles"
      if (!userHasAllowedRole(newState.member?.roles.cache, category.allowedRoles)) {
        return; // => user hat keine Rolle => kein Track
      }

      // => /tracking/leave
      await axios.post(`${apiUrl}/tracking/leave`, {
        userId,
        zoneId: zoneCategoryInfo.zoneId,
      });
      logger.debug(`[voiceStateUpdate] => userLeftZone => done (zone=${zoneCategoryInfo.zoneId})`);
    } catch (err) {
      logger.warn("[voiceStateUpdate] => tracking/leave error:", err);
    }
  }

  // =======================================================================
  // (2) USER JOINS CHANNEL (reiner JOIN)
  // =======================================================================
  if (!oldState.channelId && newState.channelId) {
    const joinedChannelId = newState.channelId;
    logger.debug(`[voiceStateUpdate] => user ${userId} joined channel=${joinedChannelId}`);

    // -------------------------------------------
    // => /tracking/join, falls Category trackt + User getrackt
    // -------------------------------------------
    try {
      // 1) Zone + Category
      const zoneCategoryInfo = await fetchZoneOrDynamicInfo(joinedChannelId);
      if (!zoneCategoryInfo || !zoneCategoryInfo.zoneId) {
        // => kein Tracking
        return;
      }

      // 2) category
      const catResp = await axios.get(`${apiUrl}/categories/${zoneCategoryInfo.categoryId}`);
      const category = catResp.data;
      if (!category || !category.trackingActive) {
        // => tracking off
        return;
      }

      // 3) userGlobalStats => isTracked
      if (!userHasAllowedRole(newState.member?.roles.cache, category.allowedRoles)) {
        return; // => user hat keine Rolle => skip tracking
      }

      // => /tracking/join
      await axios.post(`${apiUrl}/tracking/join`, {
        userId,
        zoneId: zoneCategoryInfo.zoneId,
        userRoles: newState.member?.roles.cache.map((r) => r.id) || [],
      });
      logger.debug(`[voiceStateUpdate] => userJoinedZone => done (zone=${zoneCategoryInfo.zoneId})`);
    } catch (err) {
      logger.warn("[voiceStateUpdate] => tracking/join error:", err);
    }
  }

  // =======================================================================
  // (3) USER SWITCHES CHANNEL (alt != null, neu != null, aber unterschiedlich)
  // =======================================================================
  if (
    oldState.channelId &&
    newState.channelId &&
    oldState.channelId !== newState.channelId
  ) {
    logger.debug(
      `[voiceStateUpdate] => user ${userId} switching channel from ${oldState.channelId} to ${newState.channelId}`,
    );

    // ---------------------- 3A) TREAT OLD CHANNEL AS "LEAVE" ----------------------
    try {
      // a1) remove dynamic role if needed (nach 10sek), dynamic cleanup, /tracking/leave ...
      const leftChannelId = oldState.channelId;

      // ---- Gleiche Logik wie in (1) ----
      setTimeout(async () => {
        logger.debug(`[roleRemoveTimer-SWITCH] => checking user ${userId} after 10s`);
        try {
          const mem = await guild.members.fetch(userId);
          // => Achtung: Der User ist ja jetzt in einem *anderen* Voice-Channel,
          // aber hier hast du "if (!mem.voice.channelId)" ...
          // => Ggf. ändert das sich (z. B. will man es unterdrücken?), 
          // aber wir lassen es "wie gehabt".
          if (!mem.voice.channelId) {
            logger.debug(` => user ${userId} not in voice => check dynamic (SWITCH)`);
            if (await isDynamicChannel(leftChannelId)) {
              const catData = await axios.get(`${apiUrl}/dynamic-voice-channels/lookup`, {
                params: { discordChannelId: leftChannelId },
              });
              const catId = catData.data.categoryId;
              logger.debug(` => remove role from cat=${catId} (SWITCH)`);
              await removeDvcRoleFromUser(userId, catId);
            }
          } else {
            logger.debug(` => user ${userId} is in some voice => skip removing role (SWITCH)`);
          }
        } catch (err) {
          logger.warn("[roleRemoveTimer-SWITCH] => error:", err);
        }
      }, 10_000);

      // b) dynamic channel cleanup if empty
      if (await isDynamicChannel(leftChannelId)) {
        logger.debug(`[voiceStateUpdate-SWITCH] => old channel ${leftChannelId} dynamic => set delete timer 10s`);
        setTimeout(async () => {
          const ch = guild.channels.cache.get(leftChannelId);
          if (ch?.type === ChannelType.GuildVoice && ch.members.size === 0) {
            logger.debug(` => old channel ${leftChannelId} is empty => removing from Discord (SWITCH)`);
            try {
              await axios.delete(`${botUrl}/discord/voice-channels/${leftChannelId}`);
              logger.info(`[channelDeleteTimer-SWITCH] => DVC ${leftChannelId} removed in Discord`);

              // get catId
              let catId = "";
              try {
                const lu = await axios.get(`${apiUrl}/dynamic-voice-channels/lookup`, {
                  params: { discordChannelId: leftChannelId },
                });
                catId = lu.data.categoryId || "";
                logger.debug(` => catIdForCheck=${catId} (SWITCH)`);
              } catch (err) {
                logger.warn(" => lookup => 404? =>", err);
              }

              // markDeleted => do not remove from DB yet
              logger.debug(" => markDeleted => set deletedInDiscord=true... (SWITCH)");
              try {
                await axios.patch(`${apiUrl}/dynamic-voice-channels/mark-deleted`, {
                  discordChannelId: leftChannelId,
                });
              } catch (delErr) {
                logger.warn(" => error markDeleted dvc:", delErr);
              }

              if (catId) {
                setTimeout(() => {
                  logger.debug(`[catCheckTimer-SWITCH] => final check cat=${catId}`);
                  checkCategoryEmptyThenRemoveRoleAndDvc(catId);
                }, 15_000);
              }
            } catch (err) {
              logger.error("[channelDeleteTimer-SWITCH] => error removing channel:", err);
            }
          } else {
            logger.debug(`[channelDeleteTimer-SWITCH] => old channel ${leftChannelId} not empty => skip`);
          }
        }, 10_000);
      }

      // c) /tracking/leave
      // => Gleiche Abfrage wie bei (C)
      const zoneCategoryInfo = await fetchZoneOrDynamicInfo(leftChannelId);
      if (zoneCategoryInfo && zoneCategoryInfo.zoneId) {
        const catResp = await axios.get(`${apiUrl}/categories/${zoneCategoryInfo.categoryId}`);
        const category = catResp.data;
        if (category && category.trackingActive) {
          // check userHasAllowedRole
          if (userHasAllowedRole(oldState.member?.roles.cache, category.allowedRoles)) {
            await axios.post(`${apiUrl}/tracking/leave`, {
              userId,
              zoneId: zoneCategoryInfo.zoneId,
            });
            logger.debug(
              `[voiceStateUpdate-SWITCH] => userLeftZone => done (zone=${zoneCategoryInfo.zoneId})`,
            );
          }
        }
      }
    } catch (err) {
      logger.warn("[voiceStateUpdate-SWITCH] => error in leave-block:", err);
    }

    // ---------------------- 3B) TREAT NEW CHANNEL AS "JOIN" ----------------------
    try {
      const joinedChannelId = newState.channelId;
      logger.debug(
        `[voiceStateUpdate-SWITCH] => user ${userId} joined channel=${joinedChannelId} (switch-case)`,
      );

      // => /tracking/join
      const zoneCategoryInfo = await fetchZoneOrDynamicInfo(joinedChannelId);
      if (!zoneCategoryInfo || !zoneCategoryInfo.zoneId) {
        // => kein Tracking
        return;
      }

      const catResp = await axios.get(`${apiUrl}/categories/${zoneCategoryInfo.categoryId}`);
      const category = catResp.data;
      if (!category || !category.trackingActive) {
        // => tracking off
        return;
      }

      if (!userHasAllowedRole(newState.member?.roles.cache, category.allowedRoles)) {
        // => user hat keine Rolle => skip tracking
        return;
      }

      await axios.post(`${apiUrl}/tracking/join`, {
        userId,
        zoneId: zoneCategoryInfo.zoneId,
        userRoles: newState.member?.roles.cache.map((r) => r.id) || [],
      });
      logger.debug(
        `[voiceStateUpdate-SWITCH] => userJoinedZone => done (zone=${zoneCategoryInfo.zoneId})`,
      );
    } catch (err) {
      logger.warn("[voiceStateUpdate-SWITCH] => error in join-block:", err);
    }
  }
}

// =======================================================================
// HILFSFUNKTION: zone/dynamic-lookup
// =======================================================================
async function fetchZoneOrDynamicInfo(discordChannelId: string): Promise<{ zoneId: string; categoryId: string } | null> {
  try {
    // 1) check dynamic
    const dvcResp = await axios.get(`${apiUrl}/dynamic-voice-channels/lookup`, {
      params: { discordChannelId },
    });
    // => success => { zoneId, categoryId }
    return dvcResp.data;
  } catch (err: any) {
    // => 404 => not dynamic => check normal voice-channels
    if (err.response?.status !== 404) {
      logger.warn("fetchZoneOrDynamicInfo => dynamic check error:", err);
    }
  }

  try {
    // 2) check normal
    const vcResp = await axios.get(`${apiUrl}/voice-channels/lookup`, {
      params: { discordChannelId },
    });
    return vcResp.data; // { zoneId: ..., categoryId: ... } => evtl. categoryId
  } catch (err: any) {
    if (err.response?.status === 404) {
      // => not found => no zone
      return null;
    }
    logger.warn("fetchZoneOrDynamicInfo => normal vc check error:", err);
    return null;
  }
}

// =======================================================================
// HILFSFUNKTION: userHasAllowedRole
// =======================================================================
function userHasAllowedRole(
  rolesCache: any /* Collection<string, Role> */ | undefined,
  allowedRoles: string[]
): boolean {
  if (!rolesCache || !allowedRoles || allowedRoles.length === 0) return false;
  // => Schnittmenge?
  for (const r of rolesCache.keys()) {
    if (allowedRoles.includes(r)) {
      return true;
    }
  }
  return false;
}
