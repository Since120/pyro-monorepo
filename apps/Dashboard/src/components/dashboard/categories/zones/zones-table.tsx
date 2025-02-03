"use client";

import * as React from "react";
import Link from "next/link";
import { restoreVoiceChannel } from "@/services/voice-channels";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import Box from "@mui/material/Box";
// NEU: Wir importieren den FAB und ein Icon
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { NotePencil as NotePencilIcon } from "@phosphor-icons/react/dist/ssr/NotePencil";

import { DataTable } from "@/components/core/data-table";
import type { ColumnDef } from "@/components/core/data-table";

import type { ZoneResult } from "./types";
import { useZonesSelection } from "./zones-selection-context";

export interface ZonesTableProps {
	rows: ZoneResult[];
}

export function ZonesTable({ rows }: ZonesTableProps) {
	const { deselectAll, deselectOne, selectAll, selectOne, selected } = useZonesSelection();

	// Wiederherstellen-Handler
	const handleRestoreClick = React.useCallback(async (voiceChannelId?: string | null) => {
		if (!voiceChannelId) return;
		const confirmed = window.confirm("VoiceChannel wirklich wiederherstellen?");
		if (!confirmed) return;

		try {
			await restoreVoiceChannel(voiceChannelId);
			alert("VoiceChannel wurde wiederhergestellt. Seite wird neu geladen...");
			window.location.reload();
		} catch (err) {
			console.error("Fehler beim Wiederherstellen:", err);
			alert(String(err));
		}
	}, []);

	// Spaltendefinitionen
	const columns: ColumnDef<ZoneResult>[] = [
		{
			name: "Zonen Key",
			width: "100px",
			formatter: (row) => row.zoneKey,
		},
		{
			name: "Zonen Name",
			width: "150px",
			formatter: (row) => row.zoneName,
		},
		{
			name: "Minuten",
			width: "80px",
			formatter: (row) => row.minutesRequired,
		},
		{
			name: "Punkte",
			width: "80px",
			formatter: (row) => row.pointsGranted,
		},
		{
			name: "Gesamtzeit",
			width: "120px",
			formatter: (row) => {
				const hours = Math.floor(row.totalSecondsInZone / 3600);
				const minutes = Math.floor((row.totalSecondsInZone % 3600) / 60);
				return `${hours}h ${minutes}m`;
			},
		},
		{
			// Kategorie (fett & rot bei categoryDeletedInDiscord)
			name: "Kategorie",
			width: "250px",
			formatter: (row) => {
				const text = row.categoryName || "-";
				return (
					<Box
						sx={{
							color: row.categoryDeletedInDiscord ? "error.main" : "inherit",
							fontWeight: row.categoryDeletedInDiscord ? "bold" : "normal",
						}}
					>
						{row.categoryDeletedInDiscord ? `${text} (Gelöscht)` : text}
					</Box>
				);
			},
		},
		{
			name: "Zuletzt benutzt",
			width: "180px",
			formatter: (row) => {
				return row.lastUsage ? new Date(row.lastUsage).toLocaleString() : "-";
			},
		},
		{
			// Edit / Restore => Hier ersetzen wir den alten Button
			// durch einen MUI-FAB
			name: "Edit / Restore",
			hideName: true,
			width: "100px",
			align: "right",
			formatter: (row) => {
				if (row.voiceChannelDeletedInDiscord) {
					// Falls VoiceChannel gelöscht => FAB zum Wiederherstellen
					return (
						<Fab
							variant="extended"
							size="small"
							color="success"
							onClick={(e) => {
								e.stopPropagation();
								handleRestoreClick(row.voiceChannelId);
							}}
							sx={{ textTransform: "none" }} // optional: damit "Wiederherstellen" nicht uppercase wird
						>
							{/* 
                NavigationIcon links - 
                du kannst auch ein anderes Icon importieren,
                z.B. "RestartAlt" oder "Restore" etc.
              */}
							<RestoreFromTrashIcon sx={{ mr: 1 }} />
							Wiederherstellen
						</Fab>
					);
				}
				// Normaler Zustand => Edit-Icon
				return (
					<IconButton component={Link} href={`/dashboard/categories/zones/edit/${row.id}`}>
						<NotePencilIcon />
					</IconButton>
				);
			},
		},
	];

	return (
		<>
			<DataTable<ZoneResult>
				columns={columns}
				rows={rows}
				selectable
				selected={selected}
				onSelectAll={selectAll}
				onDeselectAll={deselectAll}
				onSelectOne={(_, row) => selectOne(row.id)}
				onDeselectOne={(_, row) => deselectOne(row.id)}
				rowStyle={(row) => {
					// Falls zone gelöscht => komplette Zeile rot
					if (row.voiceChannelDeletedInDiscord) {
						return { backgroundColor: "rgba(255, 0, 0, 0.08)" };
					}
					return {};
				}}
			/>

			{rows.length === 0 && (
				<Box sx={{ p: 3 }}>
					<Typography color="text.secondary" sx={{ textAlign: "center" }} variant="body2">
						Keine Zone gefunden
					</Typography>
				</Box>
			)}
		</>
	);
}
