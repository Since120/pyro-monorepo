import { Guild, ChannelType } from "discord.js";
import axios from "axios";
import logger from "../../services/logger";
import { env } from "../../config";
import { DynamicVoiceChannel } from "pyro-prisma";

// 1) Neue Interfaces
interface DvcLookupResponse {
  zoneId: string | null;
  categoryId: string | null;
}

interface DvcAnyRoleResponse {
  roleId: string | null;
}

interface SetupResponse {
  voiceChannelId?: string;
}

// (A) isDynamicChannel
export async function isDynamicChannel(discordChannelId: string): Promise<boolean> {
  try {
    const resp = await axios.get<DvcLookupResponse>(
      `${env.API_URL}/dynamic-voice-channels/lookup`,
      {
        params: { discordChannelId },
      }
    );
    logger.debug(
      `[isDynamicChannel] zoneId=${resp.data.zoneId}, categoryId=${resp.data.categoryId}`
    );
    return !!resp.data.zoneId;
  } catch (err: unknown) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      logger.debug("[isDynamicChannel] => 404 => not dynamic");
      return false;
    }
    logger.warn("[isDynamicChannel] => error:", err);
    return false;
  }
}

// (B) removeDvcRoleFromUser
export async function removeDvcRoleFromUser(userId: string, catId: string) {
  logger.debug(`[removeDvcRoleFromUser] => user=${userId}, cat=${catId}`);
  const resp = await axios.get<DvcAnyRoleResponse>(
    `${env.API_URL}/dynamic-voice-channels/any-role`,
    {
      params: { categoryId: catId },
    }
  );
  const roleId = resp.data?.roleId;
  if (!roleId) {
    logger.debug("No DVC role found => skip");
    return;
  }
  await axios.post(`${env.BOT_SERVICE_URL}/discord/roles/remove`, { userId, roleId });
  logger.info(
    `[removeDvcRoleFromUser] => removed role ${roleId} from user ${userId} (cat=${catId})`
  );
}

// (C) checkCategoryEmptyThenRemoveRoleAndDvc
export async function checkCategoryEmptyThenRemoveRoleAndDvc(guild: Guild, categoryId: string) {
  logger.debug(`[checkCategoryEmptyThenRemoveRoleAndDvc] => cat=${categoryId}`);

  // 1) Load DVC array
  let dvcs: DynamicVoiceChannel[] = [];
  try {
    const dvResp = await axios.get<DynamicVoiceChannel[]>(`${env.API_URL}/dynamic-voice-channels`, {
      params: { categoryId },
    });
    dvcs = dvResp.data;
    logger.debug(`Found ${dvcs.length} DVC(s) in cat=${categoryId}`);
  } catch (err) {
    logger.warn("[checkCategoryEmpty] => error loading dvcs:", err);
    return;
  }

  // 2) Check if any user is in these channels
  for (const dvc of dvcs) {
    logger.debug(
      `DVC.id=${dvc.id}, discordChanId=${dvc.discordChannelId}, deletedInDiscord=${dvc.deletedInDiscord}`
    );
    if (!dvc.discordChannelId) continue;
    const ch = guild.channels.cache.get(dvc.discordChannelId);
    if (ch?.type === ChannelType.GuildVoice && ch.members.size > 0) {
      logger.debug("Found a user => category is not empty => return");
      return;
    }
  }

  // 3) check waiting-room
  let setup: SetupResponse | undefined;
  try {
    const st = await axios.get<SetupResponse>(`${env.API_URL}/setup`, {
      params: { categoryId },
    });
    setup = st.data;
    logger.debug(`Setup voiceChannelId=${setup.voiceChannelId}`);
  } catch {
    // no action needed
  }
  if (setup?.voiceChannelId) {
    const wr = guild.channels.cache.get(setup.voiceChannelId);
    if (wr?.type === ChannelType.GuildVoice && wr.members.size > 0) {
      logger.debug("Waiting room is not empty => return");
      return;
    }
  }

  // 4) remove role & leftover DVC
  logger.debug("Category is empty => removing role & leftover DVC in DB");
  try {
    const rr = await axios.get<DvcAnyRoleResponse>(
      `${env.API_URL}/dynamic-voice-channels/any-role`,
      {
        params: { categoryId },
      }
    );
    const foundRoleId = rr.data?.roleId;
    if (foundRoleId) {
      logger.debug(`Removing roleId=${foundRoleId}`);
      await axios.delete(`${env.BOT_SERVICE_URL}/discord/roles/${foundRoleId}`);
      logger.info(
        `[checkCategoryEmptyThenRemoveRoleAndDvc] => role ${foundRoleId} COMPLETELY removed (cat=${categoryId})`
      );
    } else {
      logger.debug("No role => skip remove");
    }
  } catch (err) {
    logger.warn("[checkCategoryEmpty] => error removing role:", err);
  }

  // 5) leftover dvc final remove or mark
  try {
    const reload = await axios.get<DynamicVoiceChannel[]>(`${env.API_URL}/dynamic-voice-channels`, {
      params: { categoryId },
    });
    for (const dd of reload.data) {
      if (dd.deletedInDiscord === false) {
        logger.debug(`LeftoverDVC => id=${dd.id} => mark as deletedInDiscord`);
        await axios
          .patch(`${env.API_URL}/dynamic-voice-channels/mark-deleted`, {
            discordChannelId: dd.discordChannelId,
          })
          .catch((e) => logger.warn("Leftover DVC patch error:", e));
      }
    }
    logger.debug(`Hard-delete all DVC with deletedInDiscord=true in cat=${categoryId}`);
    await axios.delete(`${env.API_URL}/dynamic-voice-channels/hard-delete`, {
      params: { categoryId },
    });

    logger.debug("Leftover cleaned => done");
  } catch (err) {
    logger.warn("LeftoverDVC => error:", err);
  }

  logger.debug("[checkCategoryEmptyThenRemoveRoleAndDvc] => finished cat cleanup => done");
}
