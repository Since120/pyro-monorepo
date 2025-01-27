"use client";

import * as React from "react";
import dynamic from "next/dynamic";
// Beispiel-Icons (kannst du natürlich ersetzen)
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { IconButton, List, ListItem, ListItemButton, ListItemText, Popover } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ArrowLeft as ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr/ArrowLeft";
import { ArrowRight as ArrowRightIcon } from "@phosphor-icons/react/dist/ssr/ArrowRight";
import type { Dayjs } from "dayjs";

import { dayjs } from "@/lib/dayjs";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

// Beispiel-Linien/Sonderzeichen
const LINES = [
	"─",
	"──",
	"───",
	"────",
	"─────",
	"═",
	"══",
	"═══",
	"════",
	"═════",
	"══════",
	"════════",
	"╔",
	"╗",
	"╚",
	"╝",
	"╠",
	"╣",
	"╬",
	"╔══",
	"══╗",
	"╚══",
	"══╝",
	"╠══",
	"══╣",
	"█",
	"██",
	"███",
	"▓",
	"▒",
	"░",
	"〓〓〓",
	"〓〓〓〓〓",
	"〓〓〓〓〓〓〓",
	"━",
	"━━",
	"━━━━",
	"━━━━━",
	"┃",
	"～",
	"〜",
	"〰",
	"﹏",
	"꧁",
	"꧂",
	"◆",
	"◇",
	"■",
	"□",
	"●",
	"○",
	"◎",
	"◉",
	"△",
	"▽",
	"★",
	"☆",
	"✦",
	"✧",
	"✪",
	"✯",
	"✰",
	"→",
	"⇒",
	"➜",
	"➤",
	"➔",
	"►",
	"➢",
	"➠",
	"←",
	"⇐",
	"◄",
	"⬅",
	"❀",
	"✿",
	"❃",
	"♥",
	"❤",
	"♡",
	"❥",
	"♪",
	"♫",
	"♬",
	"♭",
	"♯",
	"━━━━━━━━",
	"━━━━━━━━━━",
	"━━━━━━━━━━━━",
];

interface CategoryDetailsStepProps {
	// Bisherige Felder:
	name: string;
	tags: string[];
	isVisible: boolean;

	// NEU: Zwei Felder für die Switches
	trackingActive: boolean;
	sendSetup: boolean;

	// OnChange => Partial kann nun auch trackingActive / sendSetup enthalten
	onChange: (
		partial: Partial<{
			name: string;
			tags: string[];
			isVisible: boolean;
			trackingActive: boolean;
			sendSetup: boolean;
		}>
	) => void;

	onBack?: () => void;
	onNext?: () => void;
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
	// (Optional) Datum-Felder
	const [startDate, setStartDate] = React.useState<Date | null>(dayjs().toDate());
	const [endDate, setEndDate] = React.useState<Date | null>(dayjs().add(1, "month").toDate());

	const handleStartDateChange = React.useCallback((newValue: Dayjs | null) => {
		setStartDate(newValue?.toDate() ?? null);
	}, []);
	const handleEndDateChange = React.useCallback((newValue: Dayjs | null) => {
		setEndDate(newValue?.toDate() ?? null);
	}, []);

	// Ref fürs Kategorie-Name-Feld
	const categoryTitleRef = React.useRef<HTMLInputElement | null>(null);

	// Popover: Emoji & Lines
	const [emojiAnchor, setEmojiAnchor] = React.useState<HTMLButtonElement | null>(null);
	const [linesAnchor, setLinesAnchor] = React.useState<HTMLButtonElement | null>(null);

	const openEmojiPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
		setEmojiAnchor(event.currentTarget);
	};
	const closeEmojiPopover = () => setEmojiAnchor(null);

	const openLinesPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
		setLinesAnchor(event.currentTarget);
	};
	const closeLinesPopover = () => setLinesAnchor(null);

	const handleEmojiClick = (emojiData: { emoji: string }) => {
		if (!categoryTitleRef.current) return;
		const currentValue = categoryTitleRef.current.value;
		categoryTitleRef.current.value = currentValue + " " + emojiData.emoji;
		onChange({ name: categoryTitleRef.current.value.toUpperCase() });
	};

	const handleLineInsert = (line: string) => {
		if (!categoryTitleRef.current) return;
		const currentValue = categoryTitleRef.current.value;
		categoryTitleRef.current.value = currentValue + " " + line;
		closeLinesPopover();
		onChange({ name: categoryTitleRef.current.value.toUpperCase() });
	};

	// Name-Änderung => uppercase
	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ name: e.target.value.toUpperCase() });
	};

	// Switch: isVisible
	const handleVisibleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ isVisible: e.target.checked });
	};

	// NEUE Switches:
	const handleTrackingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ trackingActive: e.target.checked });
	};

	const handleSendSetupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange({ sendSetup: e.target.checked });
	};

	// 7) NEU: ROLES HOCHZIEHEN
	//    Wir laden die Rollen aus /roles (deine Nest.js).
	const [roles, setRoles] = React.useState<{ id: string; name: string }[]>([]);

	React.useEffect(() => {
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/roles`)
			.then((res) => res.json())
			.then((data) => {
				// data = { roles: [...] }
				setRoles(data.roles || []);
			})
			.catch((err) => console.error("Error loading Discord roles:", err));
	}, []);

	// 8) handleTagsChange => Du hattest "freeSolo" = true
	//    => wir wollen NUR noch existierende Rollen => freeSolo = false
	//    => in `value` wandeln wir tags -> Role[] und vice versa
	const handleRolesChange = (_event: unknown, newRoleObjects: { id: string; name: string }[]) => {
		// newRoleObjects ist das array der ausgewählten Rollen (Objekte)
		// wir speichern nur die IDs in "tags".
		const newIds = newRoleObjects.map((r) => r.id);
		onChange({ tags: newIds });
	};

	// => in `value` müssen wir die "aktuellen" Role-Objekte wiederherstellen
	//    sprich: role => tags.includes(role.id)
	const selectedRoleObjects = roles.filter((role) => tags.includes(role.id));

	// Tags
	const handleTagsChange = (event: unknown, newValue: string[]) => {
		onChange({ tags: newValue });
	};

	// Falls name != "" => ins Textfeld
	React.useEffect(() => {
		if (categoryTitleRef.current) {
			categoryTitleRef.current.value = name;
		}
	}, [name]);

	return (
		<Stack spacing={4}>
			{/* 1) Kategorie-Name + Tags */}
			<Stack spacing={3}>
				<div>
					<Typography variant="h6">Kategorie Details</Typography>
				</div>

				{/* Name-Feld + Emojis / Lines */}
				<Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "stretch", sm: "flex-end" }}>
					<TextField
						variant="outlined"
						label="Kategorie Name"
						name="categoryTitle"
						placeholder="z.B. '═══ Mining 🛠️ ═════════'"
						inputRef={categoryTitleRef}
						defaultValue={name}
						onChange={handleNameChange}
						helperText="Maximal 25 Zeichen. Wird in Discord GROSS geschrieben."
						inputProps={{
							style: { textTransform: "uppercase" },
							maxLength: 25,
						}}
						sx={{ flex: 1 }}
					/>

					<Stack direction="row" spacing={1}>
						<IconButton onClick={openEmojiPopover}>
							<EmojiEmotionsIcon />
						</IconButton>
						<Popover
							open={Boolean(emojiAnchor)}
							anchorEl={emojiAnchor}
							onClose={closeEmojiPopover}
							anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
						>
							<Box sx={{ p: 1 }}>
								{/* SSR-freundlich importierter EmojiPicker */}
								<EmojiPicker onEmojiClick={handleEmojiClick} />
							</Box>
						</Popover>

						<IconButton onClick={openLinesPopover}>
							<MoreHorizIcon />
						</IconButton>
						<Popover
							open={Boolean(linesAnchor)}
							anchorEl={linesAnchor}
							onClose={closeLinesPopover}
							anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
						>
							<List dense sx={{ minWidth: 100 }}>
								{LINES.map((line) => (
									<ListItem key={line} disablePadding>
										<ListItemButton onClick={() => handleLineInsert(line)}>
											<ListItemText primary={line} />
										</ListItemButton>
									</ListItem>
								))}
							</List>
						</Popover>
					</Stack>
				</Stack>

				{/* 2) Roles-Dropdown statt tags[]-freeSolo */}
				<Autocomplete
					multiple
					// Hier die Roles aus dem State
					options={roles}
					// So zeigst du "r.name" im Dropdown
					getOptionLabel={(r) => r.name}
					// Dein aktueller Wert => array von Role-Objekten
					value={selectedRoleObjects}
					// user wählt => wandeln in IDs
					onChange={handleRolesChange}
					// Sag Autocomplete, wann 2 objekte identisch sind
					isOptionEqualToValue={(option, value) => option.id === value.id}
					// KEIN freeSolo => user kann NICHT selbst was eintippen
					freeSolo={false}
					renderInput={(params) => (
						<TextField {...params} variant="outlined" label="Discord Rollen" placeholder="Wähle aus..." />
					)}
				/>
			</Stack>

			{/* 2) Switches */}
			<Stack spacing={2}>
				<Typography variant="h6">Optionen</Typography>
				<Stack direction="row" spacing={3} sx={{ flexWrap: "wrap" }}>
					<FormControlLabel
						control={<Switch checked={isVisible} onChange={handleVisibleChange} />}
						label="Kategorie Sichtbar?"
					/>

					{/* NEU: Tracking-Switch */}
					<FormControlLabel
						control={<Switch checked={trackingActive} onChange={handleTrackingChange} />}
						label="Tracking aktivieren?"
					/>

					{/* NEU: Setup-Switch => nur sichtbar, wenn trackingActive */}
					{trackingActive && (
						<FormControlLabel
							control={<Switch checked={sendSetup} onChange={handleSendSetupChange} />}
							label="Setup senden?"
						/>
					)}
				</Stack>
			</Stack>

			{/* 3) Buttons */}
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
