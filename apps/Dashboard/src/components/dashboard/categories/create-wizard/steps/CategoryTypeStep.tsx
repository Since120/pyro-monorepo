// apps/Dashboard/src/components/dashboard/categories/create-wizard/steps/CategoryTypeStep.tsx
"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";

interface CategoryTypeStepProps {
	value: string;
	onChange: (newVal: string) => void;
	onNext?: () => void;
	onBack?: () => void;
}

/** Dummy-Optionen, nur zur Veranschaulichung */
const categoryOptions = [
	{
		title: "Allianz Ebene",
		description: "Ein Zonenbereich für die Allianz eröffnen",
		value: "freelancers",
		disabled: false,
	},
	{
		title: "Orgaisation Ebene",
		description: "Eröffnet einen Kategorie Zonenbereich für die Organisation",
		value: "contractors",
		disabled: false,
	},
	{
		title: "Sub Organisation Ebene",
		description: "Eröffnet einen Kategorie Zonenbereich für die Suborganisation",
		value: "employees",
		disabled: false,
	},
] as const;

export function CategoryTypeStep({ value, onChange, onNext, onBack }: CategoryTypeStepProps): React.JSX.Element {
	// Wir leiten Änderungen an den Eltern-State weiter
	const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	return (
		<Stack spacing={3}>
			<div>
				<Typography variant="h6">Für welchen Type möchtest Du eine neue Kategorie eröffnen?</Typography>
			</div>

			<RadioGroup
				onChange={handleCategoryChange}
				value={value}
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
								<Typography
									variant="inherit"
									sx={{
										color: option.disabled ? "var(--mui-palette-action-disabled)" : "var(--mui-palette-text-primary)",
									}}
								>
									{option.title}
								</Typography>
								<Typography
									variant="body2"
									sx={{
										color: option.disabled ? "var(--mui-palette-action-disabled)" : "var(--mui-palette-text-secondary)",
									}}
								>
									{option.description}
								</Typography>
							</div>
						}
						sx={{
							...(option.value === value && {
								"&::before": {
									boxShadow: "0 0 0 2px var(--mui-palette-primary-main)",
								},
							}),
						}}
					/>
				))}
			</RadioGroup>

			{/* Buttons (forward/back) */}
			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button variant="contained" endIcon={<ArrowRightIcon />} onClick={onNext}>
					Nächster Schritt
				</Button>
			</Box>
		</Stack>
	);
}
