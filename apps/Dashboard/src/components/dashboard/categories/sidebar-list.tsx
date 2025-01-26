// apps/dashboard/src/components/dashboard/categories/sidebar-list.tsx
"use client";

import * as React from "react";
import { Box, Typography, Stack, Collapse, Divider, IconButton } from "@mui/material";
import type { CategoryItem } from "./types";
import { NotePencil as NotePencilIcon } from "@phosphor-icons/react/dist/ssr/NotePencil";
import Link from "next/link";

interface SidebarListProps {
  categories: CategoryItem[];
  selectedCatId: string | null;
  onSelectCategory: (catId: string | null) => void;
}

export function SidebarList({
  categories,
  selectedCatId,
  onSelectCategory,
}: SidebarListProps) {
  return (
    <Box sx={{ py: 1 }}>
      {categories.map((cat) => {
        const isSelected = cat.id === selectedCatId;

        // Toggle: Falls schon selbes => schließe (null), sonst => cat.id
        const handleToggle = () => {
          if (isSelected) {
            onSelectCategory(null);
          } else {
            onSelectCategory(cat.id);
          }
        };

        return (
          <SidebarListItem
            key={cat.id}
            category={cat}
            selected={isSelected}
            onToggle={handleToggle}
          />
        );
      })}
    </Box>
  );
}

/** Ein einzelnes List-Item */
interface SidebarListItemProps {
  category: CategoryItem;
  selected: boolean;
  onToggle: () => void;
}

function SidebarListItem({ category, selected, onToggle }: SidebarListItemProps) {
  // NEU: Prüfen, ob in Discord gelöscht
  const isDeletedInDiscord = category.deletedInDiscord === true;

  return (
    <Box
      // NEU: falls `deletedInDiscord` => roten Hintergrund
      sx={{
        // Eine leichte rote Tönung
        backgroundColor: isDeletedInDiscord ? "rgba(255, 0, 0, 0.08)" : "inherit",
        "&:hover": {
          // Bei Hover etwas stärker
          backgroundColor: isDeletedInDiscord ? "rgba(255, 0, 0, 0.12)" : "transparent",
        },
      }}
    >
      {/* Header-Bereich */}
      <Box
        sx={{
          px: 2,
          py: 1,
          borderBottom: "1px solid var(--mui-palette-divider)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
        onClick={onToggle}
      >
        {/* Links: Category Name + Last Used */}
        <Box>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {category.name}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {category.lastUsedAt
              ? `Last used: ${category.lastUsedAt.toLocaleTimeString()}`
              : "No usage"}
          </Typography>

          {/* NEU: Info-Text, wenn deletedInDiscord */}
          {isDeletedInDiscord && (
            <Typography
              variant="caption"
              sx={{ color: "error.main", display: "block", fontWeight: "bold" }}
            >
              Gelöscht im Discord
            </Typography>
          )}
        </Box>

        {/* Rechts: Edit-Icon */}
        <IconButton
          component={Link}
          href={`/dashboard/categories/edit/${category.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <NotePencilIcon />
        </IconButton>
      </Box>

      {/* Detail/Collapse */}
      <Collapse in={selected} unmountOnExit>
        <Box sx={{ px: 2, py: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Temperature (good)
          </Typography>
          <Typography variant="body2">6°C</Typography>

          <Box sx={{ mt: 1 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Timeline
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <EventLine label="Arrived" time="Jan 22, 2025 8:57 PM" />
              <EventLine label="Out for delivery" time="Jan 22, 2025 8:32 PM" />
              <EventLine label="Tracking number created" time="Jan 22, 2025 6:45 PM" />
            </Stack>
          </Box>
        </Box>
        <Divider />
      </Collapse>
    </Box>
  );
}

/** Timeline-Helfer */
function EventLine({ label, time }: { label: string; time: string }) {
  return (
    <Stack spacing={0.5}>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
      <Typography variant="caption" sx={{ color: "text.secondary" }}>
        {time}
      </Typography>
    </Stack>
  );
}
