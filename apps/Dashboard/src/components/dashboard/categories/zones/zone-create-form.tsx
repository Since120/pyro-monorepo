// apps/Dashboard/src/components/dashboard/categories/zones/zone-create-form.tsx
"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCategories } from "@/services/categories"; // Pfad ggf. anpassen
import { createZone } from "@/services/zones";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

interface CategoryOption {
	id: string;
	name: string;
}

export function ZoneCreateForm() {
	const router = useRouter();

	// 1) Kategorieliste laden
	const [categories, setCategories] = useState<CategoryOption[]>([]);
	const [categoryId, setCategoryId] = useState("");

	// 2) Pflichtfelder
	const [zoneKey, setZoneKey] = useState("");
	const [zoneName, setZoneName] = useState("");
	const [minutesRequired, setMinutesRequired] = useState<number>(60);
	const [pointsGranted, setPointsGranted] = useState<number>(1);

	// Fehlerzustände
	const [errorCategory, setErrorCategory] = useState("");
	const [errorZoneKey, setErrorZoneKey] = useState("");
	const [errorZoneName, setErrorZoneName] = useState("");
	const [errorMinutes, setErrorMinutes] = useState("");
	const [errorPoints, setErrorPoints] = useState("");

	// 3) Beim Mount => Kategorien von NestJS holen (z. B. http://localhost:3004/categories)
	useEffect(() => {
		async function loadCategories() {
			try {
				const data = await getCategories();
				const mapped = data.map((cat: any) => ({ id: cat.id, name: cat.name }));
				setCategories(mapped);
			} catch (err) {
				console.error("loadCategories error:", err);
			}
		}
		loadCategories();
	}, []);

	// 4) Speichern + Validierung
	const handleSave = useCallback(async () => {
		// Reset
		setErrorCategory("");
		setErrorZoneKey("");
		setErrorZoneName("");
		setErrorMinutes("");
		setErrorPoints("");

		let isValid = true;

		if (!categoryId) {
			setErrorCategory("Bitte eine Kategorie auswählen");
			isValid = false;
		}
		if (!zoneKey.trim()) {
			setErrorZoneKey("Zone Key ist erforderlich");
			isValid = false;
		}
		if (!zoneName.trim()) {
			setErrorZoneName("Zonen-Name ist erforderlich");
			isValid = false;
		}
		if (minutesRequired <= 0) {
			setErrorMinutes("Minuten > 0 erforderlich");
			isValid = false;
		}
		if (pointsGranted <= 0) {
			setErrorPoints("Punkte > 0 erforderlich");
			isValid = false;
		}

		if (!isValid) return;

		// POST zur NestJS-API
		try {
			await createZone({ categoryId, zoneKey, zoneName, minutesRequired, pointsGranted });
			// Erfolg => zurück zur Liste
			router.push("/dashboard/categories");
		} catch (error) {
			console.error("handleSave error:", error);
			alert(`Unerwarteter Fehler: ${String(error)}`);
		}
	}, [categoryId, zoneKey, zoneName, minutesRequired, pointsGranted, router]);

	return (
		<Stack spacing={2}>
			{/* Kategorie-Dropdown */}
			<TextField
				select
				required
				label="Kategorie"
				value={categoryId}
				onChange={(e) => setCategoryId(e.target.value)}
				helperText={errorCategory || "Wähle eine Kategorie (Pflichtfeld)"}
				error={!!errorCategory}
			>
				<MenuItem value="">
					<em>Keine Auswahl</em>
				</MenuItem>
				{categories.map((cat) => (
					<MenuItem key={cat.id} value={cat.id}>
						{cat.name}
					</MenuItem>
				))}
			</TextField>

			<TextField
				required
				label="Zone Key"
				value={zoneKey}
				onChange={(e) => setZoneKey(e.target.value)}
				error={!!errorZoneKey}
				helperText={errorZoneKey}
			/>
			<TextField
				required
				label="Zone Name"
				value={zoneName}
				onChange={(e) => setZoneName(e.target.value)}
				error={!!errorZoneName}
				helperText={errorZoneName}
			/>
			<TextField
				required
				label="Benötigte Minuten"
				type="number"
				value={minutesRequired}
				onChange={(e) => setMinutesRequired(Number(e.target.value))}
				error={!!errorMinutes}
				helperText={errorMinutes}
			/>
			<TextField
				required
				label="Punkte"
				type="number"
				value={pointsGranted}
				onChange={(e) => setPointsGranted(Number(e.target.value))}
				error={!!errorPoints}
				helperText={errorPoints}
			/>

			<Button variant="contained" onClick={handleSave}>
				Speichern
			</Button>
		</Stack>
	);
}
