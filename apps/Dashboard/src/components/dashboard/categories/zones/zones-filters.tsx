"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { bulkDeleteZones } from "@/services/zones";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useZonesSelection } from "./zones-selection-context";

export interface Filters {
	zoneKey?: string;
	name?: string;
}
export type SortDir = "asc" | "desc";

export interface ZonesFiltersProps {
	filters: Filters; // z. B. { zoneKey, name }
	sortDir: SortDir; // "asc" oder "desc"
	onZonesDeleted?: (deletedIds: string[]) => void; // <-- Neue Callback
}

export function ZonesFilters({
	filters,
	sortDir,
	onZonesDeleted, // <-- WICHTIG: Destructure / entpacken
}: ZonesFiltersProps) {
	const { zoneKey, name } = filters;
	const router = useRouter();
	const selection = useZonesSelection();

	// Hilfsfunktion zum URL-Update
	const updateSearchParams = React.useCallback(
		(newFilters: Filters, newSortDir: SortDir) => {
			const searchParams = new URLSearchParams();

			if (newFilters.zoneKey) {
				searchParams.set("zoneKey", newFilters.zoneKey);
			}
			if (newFilters.name) {
				searchParams.set("name", newFilters.name);
			}
			if (newSortDir === "asc") {
				searchParams.set("sortDir", "asc");
			}
			router.push(`?${searchParams.toString()}`);
		},
		[router]
	);

	const handleZoneKeyChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		updateSearchParams({ ...filters, zoneKey: ev.target.value }, sortDir);
	};
	const handleNameChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
		updateSearchParams({ ...filters, name: ev.target.value }, sortDir);
	};

	const handleSortChange = (ev: SelectChangeEvent) => {
		updateSearchParams(filters, ev.target.value as SortDir);
	};

	const hasFilters = !!(zoneKey || name);
	const handleClear = () => {
		updateSearchParams({}, sortDir);
	};

	// **Mehrfach-Löschung**
	const handleDeleteSelected = React.useCallback(async () => {
		if (!window.confirm("Möchtest du alle selektierten Zonen wirklich löschen?")) {
			return;
		}

		const idsToDelete = Array.from(selection.selected);
		if (idsToDelete.length === 0) {
			alert("Keine Zonen ausgewählt");
			return;
		}

		try {
			await bulkDeleteZones(idsToDelete);

			// Nach Erfolg rufen wir dein Parent-Callback auf, wenn vorhanden
			if (onZonesDeleted) {
				onZonesDeleted(idsToDelete);
			}
		} catch (err) {
			console.error("Mehrfach-Löschung error:", err);
		}
	}, [selection.selected, onZonesDeleted]);

	return (
		<>
			<Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ px: 3, py: 2, flexWrap: "wrap" }}>
				{/* LINKS: Filter-Felder */}
				<Stack direction="row" spacing={2} alignItems="center">
					<FormControl>
						<InputLabel>Zone Key</InputLabel>
						<OutlinedInput sx={{ width: 160 }} label="Zone Key" value={zoneKey ?? ""} onChange={handleZoneKeyChange} />
					</FormControl>

					<FormControl>
						<InputLabel>Name</InputLabel>
						<OutlinedInput sx={{ width: 160 }} label="Name" value={name ?? ""} onChange={handleNameChange} />
					</FormControl>

					{hasFilters && <Button onClick={handleClear}>Clear filters</Button>}
				</Stack>

				{/* RECHTS: (Selektion) + Sort */}
				<Stack direction="row" spacing={2} alignItems="flex-end">
					{/* Falls mindestens 1 Zeile ausgewählt => Delete-Button */}
					{selection.selectedAny && (
						<Stack direction="row" spacing={1.5} alignItems="center">
							<Typography color="text.secondary" variant="body2">
								{selection.selected.size} selected
							</Typography>
							<Button color="error" variant="contained" onClick={handleDeleteSelected}>
								Delete
							</Button>
						</Stack>
					)}

					{/* Sort */}
					<FormControl size="small">
						<InputLabel>Sort</InputLabel>
						<Select label="Sort" value={sortDir} onChange={handleSortChange} sx={{ width: 100 }}>
							<option value="desc">Desc</option>
							<option value="asc">Asc</option>
						</Select>
					</FormControl>
				</Stack>
			</Stack>

			<Divider />
		</>
	);
}
