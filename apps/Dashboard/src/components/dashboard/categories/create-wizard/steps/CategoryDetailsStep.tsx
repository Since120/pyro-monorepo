// apps/Dashboard/src/components/dashboard/categories/create-wizard/steps/CategoryDetailsStep.tsx
"use client";

import * as React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";

import { NameFieldSection } from "../../shared/NameFieldSection";
import { RoleSelectSection } from "../../shared/RoleSelectSection";
import { VisibilitySwitches } from "../../shared/VisibilitySwitches";

interface CategoryDetailsStepProps {
	name: string;
	tags: string[];
	isVisible: boolean;
	trackingActive: boolean;
	sendSetup: boolean;
	onChange: (
		partial: Partial<{
			name: string;
			tags: string[];
			isVisible: boolean;
			trackingActive: boolean;
			sendSetup: boolean;
		}>
	) => void;
	onNext?: () => void;
	onBack?: () => void;
}

export function CategoryDetailsStep({
	name,
	tags,
	isVisible,
	trackingActive,
	sendSetup,
	onChange,
	onNext,
	onBack,
}: CategoryDetailsStepProps) {
	// Handler: Name
	const handleNameChange = (newVal: string) => {
		onChange({ name: newVal });
	};

	// Handler: Roles
	const handleRoleIdsChange = (newIds: string[]) => {
		onChange({ tags: newIds });
	};

	// Handler: Switches
	const handleVisibilityChange = (partial: { isVisible?: boolean; trackingActive?: boolean; sendSetup?: boolean }) => {
		onChange(partial);
	};

	return (
		    <Stack spacing={4}>
      {/* 1) Oberer Block: Name */}
      <Stack spacing={3}>
        <div>
          <Typography variant="h6">Kategorie Details</Typography>
        </div>
        {/* Name-Feld */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          alignItems={{ xs: "stretch", sm: "flex-end" }}
        >
          <NameFieldSection nameValue={name} onNameChange={handleNameChange} />
        </Stack>
      </Stack>

      {/* 2) Tracking-Switches => Tracking immer sichtbar */}
      <VisibilitySwitches
        isVisible={isVisible}
        trackingActive={trackingActive}
        sendSetup={sendSetup}
        onChange={handleVisibilityChange}
      />

      {/* 3) Rollen => erst wenn trackingActive=true */}
      {trackingActive && (
        <Stack spacing={3}>
          <RoleSelectSection selectedRoleIds={tags} onChange={handleRoleIdsChange} />
        </Stack>
      )}

      {/* 4) Buttons */}
      <Stack direction="row" spacing={2} justifyContent="flex-end" alignItems="center">
        <Button color="secondary" startIcon={<ArrowLeftIcon />} onClick={onBack}>
          Back
        </Button>
        <Button variant="contained" endIcon={<ArrowRightIcon />} onClick={onNext}>
          Weiter
        </Button>
      </Stack>
    </Stack>
   );
 }