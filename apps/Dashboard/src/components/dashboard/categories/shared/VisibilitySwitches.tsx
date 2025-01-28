// apps/Dashboard/src/components/dashboard/categories/create-wizard/steps/CategoryDetailsStep/VisibilitySwitches.tsx
"use client";

import * as React from "react";
import { FormControlLabel, Stack, Switch, Typography } from "@mui/material";

interface VisibilitySwitchesProps {
	isVisible: boolean;
	trackingActive: boolean;
	sendSetup: boolean;
	onChange: (partial: { isVisible?: boolean; trackingActive?: boolean; sendSetup?: boolean }) => void;
}

export function VisibilitySwitches({ isVisible, trackingActive, sendSetup, onChange }: VisibilitySwitchesProps) {
	const handleVisibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ isVisible: e.target.checked });
	};
	const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ trackingActive: e.target.checked });
	};
	const handleSendSetupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ sendSetup: e.target.checked });
	};

	return (
		<Stack spacing={2}>
			<Typography variant="h6">Optionen</Typography>
			<Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
				<FormControlLabel
					control={<Switch checked={isVisible} onChange={handleVisibleChange} />}
					label="Kategorie Sichtbar?"
				/>
				<FormControlLabel
					control={<Switch checked={trackingActive} onChange={handleTrackingChange} />}
					label="Tracking aktivieren?"
				/>
				{trackingActive && (
					<FormControlLabel
						control={<Switch checked={sendSetup} onChange={handleSendSetupChange} />}
						label="Setup senden?"
					/>
				)}
			</Stack>
		</Stack>
	);
}
