// apps/Dashboard/src/components/dashboard/categories/category-edit-form/category-edit-form.tsx
"use client";

import * as React from "react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryHard, getCategories, updateCategory } from "@/services/categories";
import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack, Switch, Typography } from "@mui/material";

import { NameFieldSection } from "@/components/dashboard/categories/shared/NameFieldSection";
import { RoleSelectSection } from "@/components/dashboard/categories/shared/RoleSelectSection";
import { VisibilitySwitches } from "@/components/dashboard/categories/shared/VisibilitySwitches";

interface CategoryData {
	id: string;
	categoryType: string;
	name: string;
	tags: string[];
	isVisible: boolean;
	trackingActive?: boolean;
	sendSetup?: boolean;
}

const categoryOptions = [
	{
		title: "Allianz Ebene",
		description: "Ein Zonenbereich für die Allianz eröffnen",
		value: "freelancers",
		disabled: false,
	},
	{
		title: "Organisation Ebene",
		description: "Eröffnet einen Zonenbereich für die Organisation",
		value: "contractors",
		disabled: false,
	},
	{
		title: "Sub Organisation Ebene",
		description: "Zonenbereich für die Suborganisation (Nicht Sichtbar für Nicht-Mitglieder)",
		value: "employees",
		disabled: false,
	},
] as const;

interface CategoryEditFormProps {
	category: CategoryData;
}

export function CategoryEditForm({ category }: CategoryEditFormProps) {
	const router = useRouter();

	// Lokale States – initialisiert mit den Props, die reinkommen
	const [categoryType, setCategoryType] = useState(category.categoryType);
	const [name, setName] = useState(category.name);
	const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(category.tags);

	const [isVisible, setIsVisible] = useState(category.isVisible);
	const [trackingActive, setTrackingActive] = useState(category.trackingActive ?? false);
	const [sendSetup, setSendSetup] = useState(category.sendSetup ?? false);

	// =========================================================
	// 1) useEffect => überschreibe State mit ECHTEM DB-Stand
	// =========================================================
	useEffect(() => {
		// Nur ausführen, wenn wir eine category.id haben
		if (!category.id) return;

		getCategories()
			.then((allCats) => {
				const freshCat = allCats.find((c: any) => c.id === category.id);
				if (!freshCat) {
					console.warn("Keine Kategorie mit ID=", category.id, "im Array gefunden!");
					return;
				}

				// Wichtig: Falls die DB z. B. trackingActive: true hat,
				// überschreiben wir JETZT die States:
				setCategoryType(freshCat.categoryType);
				setName(freshCat.name);
				setSelectedRoleIds(freshCat.allowedRoles ?? []); // oder freshCat.tags
				setIsVisible(freshCat.isVisible);
				setTrackingActive(freshCat.trackingActive ?? false);
				setSendSetup(freshCat.sendSetup ?? false);
			})
			.catch((err) => {
				console.error("Fehler beim Laden der Kategorien:", err);
			});
	}, [category.id]);
	// => Beim ersten Rendern wird getCategories() aufgerufen,
	// => Dann füllen wir die States mit dem "frischesten" DB-Stand.

	// =========================================================
	// 2) Patch => Update in DB
	// =========================================================
	const handleSave = useCallback(async () => {
		try {
			await updateCategory(category.id, {
				name,
				categoryType,
				isVisible,
				allowedRoles: selectedRoleIds,
				trackingActive,
				sendSetup,
			});
			router.push("/dashboard/categories");
		} catch (err) {
			console.error("handleSave error:", err);
			alert("Unerwarteter Fehler beim Update: " + String(err));
		}
	}, [category.id, name, categoryType, isVisible, selectedRoleIds, trackingActive, sendSetup, router]);

	// =========================================================
	// 3) Delete => DELETE /categories/:id
	// =========================================================
	const handleDelete = useCallback(async () => {
		const confirmed = window.confirm("Wirklich löschen?");
		if (!confirmed) return;

		try {
			await deleteCategoryHard(category.id);
			router.push("/dashboard/categories");
		} catch (err) {
			console.error("handleDelete error:", err);
			alert("Fehler beim Löschen: " + String(err));
		}
	}, [category.id, router]);

	// =========================================================
	// 4) Render UI
	// =========================================================
	return (
		<Stack spacing={4}>
			{/* A) Kategorie-Typ */}
			<Stack spacing={3}>
				<Typography variant="h6">Kategorie-Typ</Typography>
				<RadioGroup
					onChange={(e) => setCategoryType(e.target.value)}
					value={categoryType}
					sx={{
						"& .MuiFormControlLabel-root": {
							border: "1px solid var(--mui-palette-divider)",
							borderRadius: 1,
							gap: 2,
							p: 2,
							position: "relative",
							"&::before": {
								borderRadius: "inherit",
								bottom: 0,
								content: '" "',
								left: 0,
								pointerEvents: "none",
								position: "absolute",
								right: 0,
								top: 0,
							},
							"&.Mui-disabled": {
								bgcolor: "var(--mui-palette-background-level1)",
							},
						},
					}}
				>
					{categoryOptions.map((option) => (
						<FormControlLabel
							key={option.value}
							control={<Radio />}
							value={option.value}
							disabled={option.disabled}
							label={
								<div>
									<Typography variant="inherit">{option.title}</Typography>
									<Typography variant="body2" sx={{ color: "text.secondary" }}>
										{option.description}
									</Typography>
								</div>
							}
							sx={{
								...(option.value === categoryType && {
									"&::before": {
										boxShadow: "0 0 0 2px var(--mui-palette-primary-main)",
									},
								}),
							}}
						/>
					))}
				</RadioGroup>
			</Stack>
			{/* D) Sichtbarkeit => Alle 3 Switches */}
			<Stack spacing={2}>
				{/* Switches => Tracking immer */}
				<VisibilitySwitches
					isVisible={isVisible}
					trackingActive={trackingActive}
					sendSetup={sendSetup}
					onChange={(partial) => {
						if (partial.isVisible !== undefined) {
							setIsVisible(partial.isVisible);
						}
						if (partial.trackingActive !== undefined) {
							setTrackingActive(partial.trackingActive);
							if (!partial.trackingActive) {
								setSendSetup(false);
							}
						}
						if (partial.sendSetup !== undefined) {
							setSendSetup(partial.sendSetup);
						}
					}}
				/>

				{/* Rollen + KategorieSichtbarkeit erst bei trackingActive */}
				{trackingActive && (
					<RoleSelectSection selectedRoleIds={selectedRoleIds} onChange={(newIds) => setSelectedRoleIds(newIds)} />
				)}
			</Stack>

			{/* E) Footer Buttons */}
			<Stack direction="row" spacing={2} justifyContent="flex-end">
				<Button color="error" variant="outlined" onClick={handleDelete}>
					Löschen
				</Button>
				<Button variant="contained" onClick={handleSave}>
					Änderungen speichern
				</Button>
			</Stack>
		</Stack>
	);
}
