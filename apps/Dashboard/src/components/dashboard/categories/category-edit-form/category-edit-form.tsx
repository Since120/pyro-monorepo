// apps/Dashboard/src/components/dashboard/categories/category-edit-form/category-edit-form.tsx
"use client";

import * as React from "react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, updateCategory } from "@/services/categories";
import { Box, Button, FormControlLabel, Radio, RadioGroup, Stack, Switch, Typography } from "@mui/material";

// Gemeinsame Subkomponenten
import { NameFieldSection } from "@/components/dashboard/categories/shared/NameFieldSection";
import { RoleSelectSection } from "@/components/dashboard/categories/shared/RoleSelectSection";
import { VisibilitySwitches } from "@/components/dashboard/categories/shared/VisibilitySwitches";

// Optional: Falls du sie noch nutzt
// import { getRoles } from "@/services/roles";

interface CategoryData {
	id: string;
	categoryType: string;
	name: string;
	tags: string[];
	isVisible: boolean;
	/** NEU: Falls dein DB-Model / API das hat */
	trackingActive?: boolean;
	sendSetup?: boolean;
}

// Nur als Dummy-Optionen
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

	// 1) Lokale States (aus DB / props)
	const [categoryType, setCategoryType] = useState(category.categoryType);
	const [name, setName] = useState(category.name);
	const [selectedRoleIds, setSelectedRoleIds] = useState<string[]>(category.tags);

	// Hier kommt der KNACKPUNKT: Wir wollen GENAUSO trackingActive + sendSetup
	// => Falls dein Backend das (noch) nicht hat, kannst du default false annehmen.
	const [isVisible, setIsVisible] = useState(category.isVisible);
	const [trackingActive, setTrackingActive] = useState(category.trackingActive ?? false);
	const [sendSetup, setSendSetup] = useState(category.sendSetup ?? false);

	// 2) Update => PATCH /categories/:id
	const handleSave = useCallback(async () => {
		try {
			await updateCategory(category.id, {
				// Was schickst du in DB?
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

	// 3) Delete => DELETE /categories/:id
	const handleDelete = useCallback(async () => {
		const confirmed = window.confirm("Wirklich löschen?");
		if (!confirmed) return;

		try {
			await deleteCategory(category.id);
			router.push("/dashboard/categories");
		} catch (err) {
			console.error("handleDelete error:", err);
			alert("Fehler beim Löschen: " + String(err));
		}
	}, [category.id, router]);

	// 4) Render
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

			{/* B) NameFieldSection */}
			<Stack spacing={2}>
				<NameFieldSection nameValue={name} onNameChange={(val) => setName(val)} maxLength={25} />
			</Stack>

			{/* C) Rollen */}
			<Stack spacing={2}>
				<RoleSelectSection selectedRoleIds={selectedRoleIds} onChange={(newIds) => setSelectedRoleIds(newIds)} />
			</Stack>

			{/* D) Sichtbarkeit => Alle 3 Switches (wie im Wizard) */}
			<Stack spacing={2}>
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
							// Falls trackingActive false => sendSetup resetten
							if (!partial.trackingActive) {
								setSendSetup(false);
							}
						}
						if (partial.sendSetup !== undefined) {
							setSendSetup(partial.sendSetup);
						}
					}}
				/>
			</Stack>

			{/* E) Footer-Buttons */}
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
