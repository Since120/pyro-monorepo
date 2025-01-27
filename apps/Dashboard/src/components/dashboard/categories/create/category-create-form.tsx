"use client";

import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepContent from "@mui/material/StepContent";
import type { StepIconProps } from "@mui/material/StepIcon";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { Check as CheckIcon } from "@phosphor-icons/react/dist/ssr/Check";

import { CategoryDetailsStep } from "./category-details-step";
// WICHTIG: CategoryDescriptionStep haben wir entfernt
import { CategoryPreview } from "./category-preview";
import { CategoryTypeStep } from "./category-type-step";
// 1) Interface importieren
import type { CategoryFormData } from "./types";

/** Eigenes StepIcon (Kästchen mit Check) */
function WizardStepIcon({ active, completed, icon }: StepIconProps): React.JSX.Element {
	const highlight = active || completed;
	return (
		<Avatar
			sx={{
				...(highlight && {
					bgcolor: "var(--mui-palette-primary-main)",
					color: "var(--mui-palette-primary-contrastText)",
				}),
			}}
			variant="rounded"
		>
			{completed ? <CheckIcon /> : icon}
		</Avatar>
	);
}

/**
 * Wizard-Form, 2 Schritte + Preview-Screen.
 */
export function CategoryCreateForm(): React.JSX.Element {
	// Step-Index
	const [activeStep, setActiveStep] = React.useState<number>(0);

	// Ob wir fertig sind => Preview
	const [isComplete, setIsComplete] = React.useState<boolean>(false);

	// 2) Form-State => minimal erweitert
	const [formData, setFormData] = React.useState<CategoryFormData>({
		categoryType: "freelancers", // Startwert
		name: "",
		tags: [],
		isVisible: true,

		// NEU:
		trackingActive: false,
		sendSetup: false,
	});

	// Schritt vor
	const handleNext = React.useCallback(() => {
		setActiveStep((prev) => prev + 1);
	}, []);

	// Schritt zurück
	const handleBack = React.useCallback(() => {
		setActiveStep((prev) => prev - 1);
	}, []);

	// Letzter Schritt => fertig => zeige Preview
	const handleComplete = React.useCallback(() => {
		setIsComplete(true);
	}, []);

	// Steps-Array
	const steps = React.useMemo(() => {
		return [
			{
				label: "Kategorie Typ",
				content: (
					<CategoryTypeStep
						value={formData.categoryType}
						onChange={(newVal) => {
							setFormData((prev) => ({ ...prev, categoryType: newVal }));
						}}
						onNext={handleNext}
						onBack={handleBack}
					/>
				),
			},
			{
				label: "Details",
				content: (
					<CategoryDetailsStep
						name={formData.name}
						tags={formData.tags}
						isVisible={formData.isVisible}
						// NEU: Tracking + Setup
						trackingActive={formData.trackingActive}
						sendSetup={formData.sendSetup}
						onChange={(partial) => {
							// partial kann { name?, tags?, isVisible?, trackingActive?, sendSetup? }
							setFormData((prev) => ({ ...prev, ...partial }));
						}}
						onNext={handleComplete}
						onBack={handleBack}
					/>
				),
			},
		];
	}, [formData, handleNext, handleBack, handleComplete]);

	if (isComplete) {
		return <CategoryPreview formData={formData} />;
	}

	return (
		<Stepper
			activeStep={activeStep}
			orientation="vertical"
			sx={{
				"& .MuiStepConnector-root": { ml: "19px" },
				"& .MuiStepConnector-line": {
					borderLeft: "2px solid var(--mui-palette-divider)",
				},
				"& .MuiStepLabel-iconContainer": { paddingRight: "16px" },
				"& .MuiStepContent-root": {
					borderLeft: "2px solid var(--mui-palette-divider)",
					ml: "19px",
				},
				"& .MuiStep-root:last-of-type .MuiStepContent-root": {
					borderColor: "transparent",
				},
			}}
		>
			{steps.map((step) => (
				<Step key={step.label}>
					<StepLabel StepIconComponent={WizardStepIcon}>
						<Typography variant="overline">{step.label}</Typography>
					</StepLabel>
					<StepContent>
						<Box sx={{ px: 2, py: 3 }}>{step.content}</Box>
					</StepContent>
				</Step>
			))}
		</Stepper>
	);
}
