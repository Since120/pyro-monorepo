// apps/Dashboard/src/components/dashboard/categories/create-wizard/steps/CategoryDetailsStep/RoleSelectSection.tsx
"use client";

import * as React from "react";
import { getRoles } from "@/services/roles";
import { Autocomplete, TextField } from "@mui/material";

interface Role {
	id: string;
	name: string;
}

interface RoleSelectSectionProps {
	selectedRoleIds: string[];
	onChange: (newIds: string[]) => void;
}

export function RoleSelectSection({ selectedRoleIds, onChange }: RoleSelectSectionProps) {
	const [roles, setRoles] = React.useState<Role[]>([]);

	// Rollen laden
	React.useEffect(() => {
		getRoles()
			.then((data) => {
				// data = { roles: [...] } oder nur [...]
				const roleArray = data.roles ?? data; // je nach API
				setRoles(roleArray);
			})
			.catch((err) => console.error("Rollen laden error:", err));
	}, []);

	// Ausgewählte Roles als Objekte
	const selectedObjects = React.useMemo(
		() => roles.filter((r) => selectedRoleIds.includes(r.id)),
		[roles, selectedRoleIds]
	);

	return (
		<Autocomplete
			multiple
			options={roles}
			value={selectedObjects}
			getOptionLabel={(r) => r.name}
			isOptionEqualToValue={(opt, val) => opt.id === val.id}
			onChange={(_evt, newObjs) => {
				const newIds = newObjs.map((o) => o.id);
				onChange(newIds);
			}}
			renderInput={(params) => (
				<TextField {...params} variant="outlined" label="Welche Rollen werden getrackt?" placeholder="Wähle aus..." />
			)}
		/>
	);
}
