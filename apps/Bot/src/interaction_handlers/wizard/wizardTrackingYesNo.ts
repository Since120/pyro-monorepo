// apps\Bot\src\interaction_handlers\wizard\wizardTrackingYesNo.ts

import { ButtonInteraction } from "discord.js";
import axios from "axios";
import logger from "../../services/logger";
import { env } from "../../config";
import { checkDefaultWaitingRoom, tryAssignRole } from "./wizardHelpers";
import { z } from "zod";

/**
 * Zod schema for tracking steps.
 */
const wizardTrackingSchema = z.object({
  userId: z.string().min(1),
  trackingActive: z.boolean(),
});

/**
 * Handling "wizard:tracking_yes".
 */
export async function handleWizardTrackingYes(btnInteraction: ButtonInteraction) {
  logger.debug("[wizard:tracking_yes] invoked.");

  if (!(await checkDefaultWaitingRoom(btnInteraction))) {
    return;
  }

  await btnInteraction.deferReply({ ephemeral: true });

  try {
    // Mark tracking as active
    wizardTrackingSchema.parse({
      userId: btnInteraction.user.id,
      trackingActive: true,
    });

    await axios.post(`${env.API_URL}/wizard/step`, {
      userId: btnInteraction.user.id,
      trackingActive: true,
    });

    const resp = await axios.post(`${env.API_URL}/wizard/after-tracking`, {
      userId: btnInteraction.user.id,
    });
    const data = resp.data;

    // If a category is present, try to assign role
    if (data.categoryId) {
      tryAssignRole(btnInteraction.user.id, data.categoryId);
    }

    const rowComponents = [];
    if (data.enableCreate) {
      rowComponents.push({
        type: 2,
        label: "Voice erstellen",
        style: 1,
        customId: "wizard:create_voice",
      });
    }
    if (data.enableJoin) {
      rowComponents.push({
        type: 2,
        label: "Beitreten",
        style: 1,
        customId: "wizard:join_voice",
      });
    }

    await btnInteraction.editReply({
      content: data.text,
      components: rowComponents.length > 0 ? [{ type: 1, components: rowComponents }] : [],
    });
  } catch (err) {
    logger.error("[wizard:tracking_yes] Error enabling tracking or after-tracking step:", err);
    await btnInteraction.editReply({
      content: "Fehler beim Tracking-Aktivieren oder after-tracking-Schritt",
    });
  }
}

/**
 * Handling "wizard:tracking_no".
 */
export async function handleWizardTrackingNo(btnInteraction: ButtonInteraction) {
  logger.debug("[wizard:tracking_no] invoked.");

  if (!(await checkDefaultWaitingRoom(btnInteraction))) {
    return;
  }

  await btnInteraction.deferReply({ ephemeral: true });

  try {
    // Mark tracking as inactive
    wizardTrackingSchema.parse({
      userId: btnInteraction.user.id,
      trackingActive: false,
    });

    await axios.post(`${env.API_URL}/wizard/step`, {
      userId: btnInteraction.user.id,
      trackingActive: false,
    });

    const resp = await axios.post(`${env.API_URL}/wizard/after-tracking`, {
      userId: btnInteraction.user.id,
    });
    const data = resp.data;

    const rowComponents = [];
    if (data.enableCreate) {
      rowComponents.push({
        type: 2,
        label: "Voice erstellen",
        style: 1,
        customId: "wizard:create_voice",
      });
    }
    if (data.enableJoin) {
      rowComponents.push({
        type: 2,
        label: "Beitreten",
        style: 1,
        customId: "wizard:join_voice",
      });
    }

    await btnInteraction.editReply({
      content: data.text,
      components: rowComponents.length > 0 ? [{ type: 1, components: rowComponents }] : [],
    });
  } catch (err) {
    logger.error("[wizard:tracking_no] Error disabling tracking or after-tracking step:", err);
    await btnInteraction.editReply({
      content: "Fehler beim Tracking-Deaktivieren oder after-tracking-Schritt",
    });
  }
}
