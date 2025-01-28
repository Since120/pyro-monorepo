// apps/Dashboard/src/components/dashboard/categories/create-wizard/steps/CategoryDetailsStep/NameFieldSection.tsx
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Box, IconButton, List, ListItem, ListItemButton, ListItemText, Popover, TextField } from "@mui/material";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

interface NameFieldSectionProps {
	nameValue: string;
	onNameChange: (newVal: string) => void;
	maxLength?: number;
}

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

export function NameFieldSection({ nameValue, onNameChange, maxLength = 25 }: NameFieldSectionProps) {
	// STATE: Popover
	const [emojiAnchor, setEmojiAnchor] = React.useState<HTMLButtonElement | null>(null);
	const [linesAnchor, setLinesAnchor] = React.useState<HTMLButtonElement | null>(null);

	// Handlers für Popover
	const openEmojiPopover = (e: React.MouseEvent<HTMLButtonElement>) => {
		setEmojiAnchor(e.currentTarget);
	};
	const closeEmojiPopover = () => setEmojiAnchor(null);

	const openLinesPopover = (e: React.MouseEvent<HTMLButtonElement>) => {
		setLinesAnchor(e.currentTarget);
	};
	const closeLinesPopover = () => setLinesAnchor(null);

	// Emoji auswählen und einfügen
	const handleEmojiClick = (emojiData: { emoji: string }) => {
		const newVal = (nameValue + " " + emojiData.emoji).toUpperCase();
		onNameChange(newVal.slice(0, maxLength)); // Länge beschränken
	};

	// Linie einfügen
	const handleLineInsert = (line: string) => {
		const newVal = (nameValue + " " + line).toUpperCase();
		onNameChange(newVal.slice(0, maxLength));
		closeLinesPopover();
	};

	return (
		<TextField
			variant="outlined"
			label="Kategorie Name"
			placeholder="z.B. '═══ Mining 🛠️ ═════════'"
			value={nameValue}
			onChange={(e) => {
				let val = e.target.value.toUpperCase();
				if (val.length > maxLength) val = val.slice(0, maxLength);
				onNameChange(val);
			}}
			helperText={`Maximal ${maxLength} Zeichen. Wird in Discord GROSS geschrieben.`}
			inputProps={{
				style: { textTransform: "uppercase" },
				maxLength,
			}}
			sx={{ flex: 1 }}
			// <<---- HIER: endAdornment, damit die Icons auf Höhe des Eingabefelds bleiben
			InputProps={{
				endAdornment: (
					<>
						{/* Emoji-Picker-Icon + Popover */}
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
								<EmojiPicker onEmojiClick={handleEmojiClick} />
							</Box>
						</Popover>

						{/* Lines-Picker-Icon + Popover */}
						<IconButton onClick={openLinesPopover}>
							<MoreHorizIcon />
						</IconButton>
						<Popover
							open={Boolean(linesAnchor)}
							anchorEl={linesAnchor}
							onClose={closeLinesPopover}
							anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
						>
							<List dense sx={{ minWidth: 80 }}>
								{LINES.map((line) => (
									<ListItem key={line} disablePadding>
										<ListItemButton onClick={() => handleLineInsert(line)}>
											<ListItemText primary={line} />
										</ListItemButton>
									</ListItem>
								))}
							</List>
						</Popover>
					</>
				),
			}}
		/>
	);
}
