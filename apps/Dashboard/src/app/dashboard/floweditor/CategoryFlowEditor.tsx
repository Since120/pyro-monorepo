"use client";

// In CRA ist "use client" nicht zwingend nötig,
// aber schadet nicht, falls du später Next.js-ähnliches nutzen willst
import React, { useEffect, useState } from "react";
import { ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Divider,
	IconButton,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from "@mui/material";

type StepType = "askTracking" | "zoneSelection" | "dynamicChannel" | "askChannelName";

interface FlowStep {
	id: string;
	stepType: StepType;
	config: any;
}

interface CategoryFlowEditorProps {
	categoryId?: string;
}

const CategoryFlowEditor: React.FC<CategoryFlowEditorProps> = ({ categoryId }) => {
	const [steps, setSteps] = useState<FlowStep[]>([]);

	// Optional: Beim Mount Daten laden, z. B. via fetch(...)
	// Falls du das nur als Demo brauchst, kannst du's leer lassen
	useEffect(() => {
		console.log("CategoryFlowEditor mounted. categoryId=", categoryId);
		// Hier könntest du fetch("/api/categories/" + categoryId + "/flow") etc.
	}, [categoryId]);

	// Step hinzufügen
	const handleAddStep = () => {
		const newStep: FlowStep = {
			id: Math.random().toString(36).substr(2, 9),
			stepType: "askTracking",
			config: {},
		};
		setSteps((prev) => [...prev, newStep]);
	};

	// Step entfernen
	const handleRemoveStep = (index: number) => {
		setSteps((prev) => prev.filter((_, i) => i !== index));
	};

	// Step hoch/runter
	const handleMoveStep = (index: number, direction: number) => {
		const newIndex = index + direction;
		if (newIndex < 0 || newIndex >= steps.length) return;
		const updated = [...steps];
		const tmp = updated[index];
		updated[index] = updated[newIndex];
		updated[newIndex] = tmp;
		setSteps(updated);
	};

	// StepType ändern => config resetten
	const handleChangeStepType = (index: number, newType: StepType) => {
		setSteps((prev) => {
			const updated = [...prev];
			updated[index] = { ...updated[index], stepType: newType, config: {} };
			return updated;
		});
	};

	// config ändern
	const handleConfigChange = (index: number, key: string, value: any) => {
		setSteps((prev) => {
			const updated = [...prev];
			updated[index] = {
				...updated[index],
				config: { ...updated[index].config, [key]: value },
			};
			return updated;
		});
	};

	// Speichern => momentan nur alert()
	const handleSave = async () => {
		alert("Speichere Steps:\n" + JSON.stringify(steps, null, 2));
		// Hier könntest du fetch(...) an dein Backend schicken
	};

	return (
		<Box sx={{ p: 2 }}>
			<Stack direction="row" spacing={2} mb={2}>
				<Button variant="contained" onClick={handleAddStep}>
					+ Add Step
				</Button>
				<Button variant="outlined" onClick={handleSave}>
					Save
				</Button>
			</Stack>

			{steps.map((step, index) => (
				<Card key={step.id} sx={{ mb: 2 }}>
					<CardHeader
						title={
							<Stack direction="row" alignItems="center" justifyContent="space-between">
								<Typography variant="subtitle1">
									Step #{index + 1} - {step.stepType}
								</Typography>
								<Box>
									<IconButton onClick={() => handleMoveStep(index, -1)} disabled={index === 0}>
										<ArrowUpward />
									</IconButton>
									<IconButton onClick={() => handleMoveStep(index, 1)} disabled={index === steps.length - 1}>
										<ArrowDownward />
									</IconButton>
									<IconButton onClick={() => handleRemoveStep(index)}>
										<Delete />
									</IconButton>
								</Box>
							</Stack>
						}
					/>
					<Divider />
					<CardContent>
						{/* StepType-Select */}
						<Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center">
							<Select
								value={step.stepType}
								onChange={(e) => handleChangeStepType(index, e.target.value as StepType)}
								sx={{ width: 200 }}
							>
								<MenuItem value="askTracking">AskTracking</MenuItem>
								<MenuItem value="zoneSelection">ZoneSelection</MenuItem>
								<MenuItem value="dynamicChannel">DynamicChannel</MenuItem>
								<MenuItem value="askChannelName">AskChannelName</MenuItem>
							</Select>
							<Typography variant="body2" color="text.secondary">
								{step.stepType}
							</Typography>
						</Stack>

						{/* Config-Felder je nach stepType */}
						{step.stepType === "askTracking" && (
							<TextField
								label="Frage-Text"
								variant="outlined"
								value={step.config.question ?? ""}
								onChange={(e) => handleConfigChange(index, "question", e.target.value)}
								sx={{ mb: 2 }}
							/>
						)}

						{step.stepType === "zoneSelection" && (
							<TextField
								label="ZoneType"
								variant="outlined"
								value={step.config.zoneType ?? ""}
								onChange={(e) => handleConfigChange(index, "zoneType", e.target.value)}
								sx={{ mb: 2 }}
								helperText="z. B. 'Mining', 'Chill', etc."
							/>
						)}

						{step.stepType === "dynamicChannel" && (
							<TextField
								label="MaxUserCount"
								type="number"
								variant="outlined"
								value={step.config.maxUserCount ?? 0}
								onChange={(e) => handleConfigChange(index, "maxUserCount", Number(e.target.value))}
								sx={{ mb: 2 }}
							/>
						)}

						{step.stepType === "askChannelName" && (
							<TextField
								label="Prompt"
								variant="outlined"
								value={step.config.prompt ?? ""}
								onChange={(e) => handleConfigChange(index, "prompt", e.target.value)}
								sx={{ mb: 2 }}
							/>
						)}
					</CardContent>
				</Card>
			))}
		</Box>
	);
};

export default CategoryFlowEditor;
