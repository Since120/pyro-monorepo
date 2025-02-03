// KOMPLETTE DATEI: apps/Dashboard/src/components/dashboard/categories/zones/zones-page-client.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "@/services/categories";
import { getZones } from "@/services/zones";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { ZoneResult } from "./types";
import { ZonesFilters } from "./zones-filters";
import { ZonesPagination } from "./zones-pagination";
import { ZonesSelectionProvider } from "./zones-selection-context";
import { ZonesTable } from "./zones-table";

/**
 * Exakt wie früher:
 * Named Export: "ZonesPageClient".
 * => Deine categories-view.tsx kann weiterhin
 *    import { ZonesPageClient } from "./zones-page-client";
 * verwenden.
 */
export function ZonesPageClient() {
	const router = useRouter();
	const [zones, setZones] = React.useState<ZoneResult[]>([]);
	const [loading, setLoading] = React.useState<boolean>(true);
	const [error, setError] = React.useState<string | null>(null);

	// Such-Parameter aus der URL (optional)
	const searchParams = useSearchParams();
	const zoneKeyParam = searchParams?.get("zoneKey") ?? "";
	const nameParam = searchParams?.get("name") ?? "";
	const sortDir = (searchParams?.get("sortDir") as "asc" | "desc") ?? "desc";

	// 1) Zonen laden
	React.useEffect(() => {
		async function fetchZones() {
			try {
				setLoading(true);
				setError(null);

				const data = await getZones();

				// WICHTIG: voiceChannels ins Mapping übernehmen
				const mapped: ZoneResult[] = data.map((z: any) => ({
					id: z.id,
					zoneKey: z.zoneKey,
					zoneName: z.zoneName,
					minutesRequired: z.minutesRequired,
					pointsGranted: z.pointsGranted,
					totalSecondsInZone: z.totalSecondsInZone ?? 0,
					lastUsage: z.lastUsage ? new Date(z.lastUsage) : null,
					categoryName: z.category ? z.category.name : null,
					categoryDeletedInDiscord: z.category ? z.category.deletedInDiscord : false,

					// NEU: Wenn du nur einen VoiceChannel pro Zone hast
					voiceChannelId: z.voiceChannels && z.voiceChannels.length > 0 ? z.voiceChannels[0].id : null,
					voiceChannelDeletedInDiscord:
						z.voiceChannels && z.voiceChannels.length > 0 ? z.voiceChannels[0].deletedInDiscord : false,
				}));

				setZones(mapped);
			} catch (err: any) {
				console.error("fetchZones error:", err);
				setError(err.message ?? "Unknown error");
			} finally {
				setLoading(false);
			}
		}

		fetchZones();
	}, []);

	// 2) Für Mehrfach-Löschung => Zonen local aus State entfernen
	const handleZonesDeleted = React.useCallback((deletedIds: string[]) => {
		setZones((prev) => prev.filter((z) => !deletedIds.includes(z.id)));
	}, []);

	// 3) Filter & Sort (Clientseitig)
	const filtered = React.useMemo(() => {
		return zones.filter((z) => {
			if (zoneKeyParam && !z.zoneKey.toLowerCase().includes(zoneKeyParam.toLowerCase())) {
				return false;
			}
			if (nameParam && !z.zoneName.toLowerCase().includes(nameParam.toLowerCase())) {
				return false;
			}
			return true;
		});
	}, [zones, zoneKeyParam, nameParam]);

	const sorted = React.useMemo(() => {
		if (sortDir === "asc") {
			return [...filtered].sort((a, b) => a.zoneName.localeCompare(b.zoneName));
		}
		return [...filtered].sort((a, b) => b.zoneName.localeCompare(a.zoneName));
	}, [filtered, sortDir]);

	// 4) NEUE ZONE ANLEGEN => Vorher checken, ob mind. 1 Kategorie existiert
	const handleCreateZone = React.useCallback(async () => {
		try {
			const catData = await getCategories();

			// Prüfen, ob catData.length > 0
			if (!Array.isArray(catData) || catData.length === 0) {
				alert("Keine Kategorie vorhanden! Lege zuerst eine Kategorie an, bevor du eine Zone erstellst.");
				return;
			}

			// Wenn mind. eine Category da ist => zum Create-Form
			router.push("/dashboard/categories/zones/create");
		} catch (err: any) {
			console.error("handleCreateZone error:", err);
			alert("Fehler beim Prüfen der Kategorien: " + (err.message ?? String(err)));
		}
	}, [router]);

	// 5) Render
	return (
		<Box sx={{ maxWidth: "100%", mx: "auto", width: "100%" }}>
			<Stack spacing={4}>
				{/* Überschrift + Button */}
				<Stack
					direction={{ xs: "column", sm: "row" }}
					spacing={3}
					sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
				>
					<Typography variant="h4">Zonen Übersicht</Typography>
					{/* HIER: handleCreateZone statt Link */}
					<Button variant="contained" onClick={handleCreateZone}>
						Neue Zone anlegen
					</Button>
				</Stack>

				<ZonesSelectionProvider zones={sorted}>
					<Card>
						{/* Filter-Bereich */}
						<ZonesFilters
							filters={{ zoneKey: zoneKeyParam, name: nameParam }}
							sortDir={sortDir}
							onZonesDeleted={handleZonesDeleted}
						/>
						<Divider />

						{/* Lade-/Fehler-Zustand */}
						{loading && (
							<Typography color="text.secondary" variant="body2" sx={{ p: 2 }}>
								Loading...
							</Typography>
						)}
						{error && (
							<Typography color="error" variant="body2" sx={{ p: 2 }}>
								{error}
							</Typography>
						)}
						{!loading && !error && <ZonesTable rows={sorted} />}

						<Divider />
						<ZonesPagination count={sorted.length} page={0} />
					</Card>
				</ZonesSelectionProvider>
			</Stack>
		</Box>
	);
}
