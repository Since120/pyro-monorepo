import { request } from "./http";

/** PATCH /voice-channels/restore/:id => VoiceChannel wiederherstellen */
export function restoreVoiceChannel(voiceChannelId: string) {
	return request(`voice-channels/restore/${voiceChannelId}`, {
		method: "PATCH",
	});
}
