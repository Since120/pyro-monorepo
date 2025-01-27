"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";

// Dies ist unser finales Objekt aus dem Wizard
interface CategoryFormData {
	categoryType: string;
	name: string;
	tags: string[];
	isVisible: boolean;
}

interface CategoryPreviewProps {
	formData: CategoryFormData;
}

export function CategoryPreview({ formData }: CategoryPreviewProps): React.JSX.Element {
	const router = useRouter();
	// 2) State für alle Rollen -> {id, name}
	const [allRoles, setAllRoles] = useState<{ id: string; name: string }[]>([]);

	// Final speichern => POST /api/categories
	const handleFinish = React.useCallback(async () => {
		try {
			const baseUrl = process.env.NEXT_PUBLIC_API_URL; // Lade URL aus .env
			const response = await fetch(`${baseUrl}/categories`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					// Wir schicken das, was du in Prisma brauchst
					name: formData.name,
					categoryType: formData.categoryType,
					isVisible: formData.isVisible,
					allowedRoles: formData.tags,
				}),
			});
			if (!response.ok) {
				const errData = await response.json();
				alert(`Fehler beim Erstellen: ${errData.error ?? response.statusText}`);
				return;
			}
			const created = await response.json();
			router.push("/dashboard/categories");
		} catch (err) {
			console.error("handleFinish error:", err);
			alert("Unerwarteter Fehler: " + String(err));
		}
	}, [formData, router]);

	// 3) useEffect zum Laden aller Rollen (via Nest-API)
	useEffect(() => {
		// Du könntest z.B. per env "NEXT_PUBLIC_API_URL" -> fetch("http://localhost:3004/roles")
		// oder fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`)
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`)
			.then((res) => res.json())
			.then((data) => {
				// { roles: [ {id, name}, ... ] }
				setAllRoles(data.roles || []);
			})
			.catch((err) => {
				console.error("Fehler beim Laden der Rollen:", err);
			});
	}, []);

	return (
		<Stack spacing={2}>
			{/* Grünes Icon */}
			<Avatar
				sx={{
					"--Icon-fontSize": "var(--icon-fontSize-lg)",
					bgcolor: "var(--mui-palette-success-main)",
					color: "var(--mui-palette-success-contrastText)",
				}}
			>
				<CheckIcon fontSize="var(--Icon-fontSize)" />
			</Avatar>

			<div>
				<Typography variant="h6">All Done!</Typography>
				<Typography variant="body2" color="text.secondary">
					Hier eine Vorschau der erstellten Kategorie
				</Typography>
			</div>

			{/* Beispiel-Card als "Erfolgsmeldung" */}
			<Card variant="outlined">
				<Stack
					direction="row"
					sx={{
						alignItems: "center",
						flexWrap: "wrap",
						justifyContent: "space-between",
						px: 2,
						py: 1.5,
					}}
				>
					<div>
						{/* Echte Daten aus formData */}
						<Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
							{formData.name || "Kein Name"}
						</Typography>
						<Typography variant="caption" color="text.secondary" display="block">
							Type: {formData.categoryType}
						</Typography>

						{/* 4) Hier ID => Name Mapping */}
						<Typography variant="caption" color="text.secondary" display="block">
							{/* IDs -> Name */}
							Access:{" "}
							{formData.tags
								.map((roleId) => {
									const found = allRoles.find((r) => r.id === roleId);
									return found ? found.name : `Unbekannte ID: ${roleId}`;
								})
								.join(", ")}
						</Typography>
						<Typography variant="caption" color="text.secondary" display="block">
							Sichtbar: {formData.isVisible ? "Ja" : "Nein"}
						</Typography>
					</div>

					<Stack direction="row" spacing={2} alignItems="center">
						<Typography color="text.secondary" variant="caption">
							Erfolgreich erstellt
						</Typography>
						<Button size="small" onClick={handleFinish}>
							Kategorie anlegen
						</Button>
					</Stack>
				</Stack>
			</Card>
		</Stack>
	);
}
