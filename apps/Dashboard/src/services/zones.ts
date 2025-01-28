// apps/Dashboard/src/services/zones.ts

import { request } from "./http";

/** Liest alle Zonen => GET /zones */
export function getZones() {
	return request("zones");
}

/** Erstellt eine Zone => POST /zones */
export function createZone(payload: any) {
	return request("zones", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

/** Updated eine Zone => PATCH /zones/:id */
export function updateZone(zoneId: string, payload: any) {
	return request(`zones/${zoneId}`, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(payload),
	});
}

/** Löscht eine Zone => DELETE /zones/:id */
export function deleteZone(zoneId: string) {
	return request(`zones/${zoneId}`, {
		method: "DELETE",
	});
}

/**
 * Bulk-Löschung von Zonen => POST /zones/bulk-delete
 * (falls du das so in Nest.js implementiert hast)
 */
export function bulkDeleteZones(zoneIds: string[]) {
	return request("zones/bulk-delete", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ zoneIds }),
	});
}
