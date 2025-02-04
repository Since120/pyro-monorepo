import axios from "axios";
import logger from "../../services/logger";
import { env } from "../../config";
import { Collection, Role } from "discord.js";

/**
 * Attempts to determine if the channel is a dynamic channel or a normal voice-channel,
 * then returns zoneId/categoryId if found.
 */
export async function fetchZoneOrDynamicInfo(
  discordChannelId: string
): Promise<{ zoneId: string; categoryId: string } | null> {
  try {
    // 1) dynamic check
    const dvcResp = await axios.get(`${env.API_URL}/dynamic-voice-channels/lookup`, {
      params: { discordChannelId },
    });
    return dvcResp.data;
  } catch (err: unknown) {
    // wir checken, ob es ein AxiosError ist:
    if (axios.isAxiosError(err)) {
      if (err.response?.status !== 404) {
        logger.warn("fetchZoneOrDynamicInfo => dynamic check error:", err);
      }
    } else {
      logger.warn("fetchZoneOrDynamicInfo => unknown error (dynamic check):", err);
    }
  }

  try {
    // 2) normal voice-channel check
    const vcResp = await axios.get(`${env.API_URL}/voice-channels/lookup`, {
      params: { discordChannelId },
    });
    return vcResp.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 404) {
        return null;
      }
      logger.warn("fetchZoneOrDynamicInfo => normal vc check error:", err);
      return null;
    } else {
      logger.warn("fetchZoneOrDynamicInfo => unknown error (vc check):", err);
      return null;
    }
  }
}

/**
 * Checks if user has at least one of the allowed roles.
 */
export function userHasAllowedRole(
  rolesCache: Collection<string, Role> | undefined,
  allowedRoles: string[]
): boolean {
  if (!rolesCache || !allowedRoles || allowedRoles.length === 0) return false;
  for (const r of rolesCache.keys()) {
    if (allowedRoles.includes(r)) {
      return true;
    }
  }
  return false;
}
