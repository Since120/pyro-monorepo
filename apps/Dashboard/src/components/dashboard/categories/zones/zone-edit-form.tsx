// apps/Dashboard/src/components/dashboard/categories/zones/zone-edit-form.tsx
"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";

interface ZoneData {
  id: string;
  zoneKey: string;
  zoneName: string;
  minutesRequired: number;
  pointsGranted: number;
  categoryId?: string | null;
}

interface CategoryOption {
  id: string;
  name: string;
}

export function ZoneEditForm({ zone }: { zone: ZoneData }) {
  const router = useRouter();

  // Kategorien-States
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState(zone.categoryId ?? "");

  // Restliche States
  const [zoneKey, setZoneKey] = useState(zone.zoneKey);
  const [zoneName, setZoneName] = useState(zone.zoneName);
  const [minutesRequired, setMinutesRequired] = useState(zone.minutesRequired);
  const [pointsGranted, setPointsGranted] = useState(zone.pointsGranted);

  // 1) Kategorien laden (von NestJS)
  useEffect(() => {
    async function loadCategories() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";
        const res = await fetch(`${baseUrl}/categories`);
        if (!res.ok) {
          throw new Error(`Fehler beim Laden der Kategorien: ${res.status} ${res.statusText}`);
        }
        const data = await res.json();
        const mapped = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error("loadCategories error:", err);
      }
    }
    loadCategories();
  }, []);

  // 2) Speichern => PATCH /zones/:id (NestJS)
  const handleSave = useCallback(async () => {
    try {
      const payload = {
        zoneKey,
        zoneName,
        minutesRequired,
        pointsGranted,
        categoryId,
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";
      const res = await fetch(`${baseUrl}/zones/${zone.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.message || errData?.error || res.statusText;
        alert(`Fehler beim Update: ${msg}`);
        return;
      }

      router.push("/dashboard/categories");
    } catch (error) {
      console.error("handleSave error:", error);
      alert("Unerwarteter Fehler beim Update: " + String(error));
    }
  }, [
    zone.id,
    zoneKey,
    zoneName,
    minutesRequired,
    pointsGranted,
    categoryId,
    router,
  ]);

  // 3) Löschen => DELETE /zones/:id (NestJS)
  const handleDelete = useCallback(async () => {
    const confirmed = window.confirm("Wirklich löschen?");
    if (!confirmed) return;

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3004";
      const res = await fetch(`${baseUrl}/zones/${zone.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        const msg = errData?.message || errData?.error || res.statusText;
        alert(`Fehler beim Löschen: ${msg}`);
        return;
      }

      router.push("/dashboard/categories");
    } catch (error) {
      console.error("handleDelete error:", error);
      alert("Unerwarteter Fehler beim Löschen: " + String(error));
    }
  }, [zone.id, router]);

  return (
    <Stack spacing={2}>
      {/* Kategorie-Dropdown */}
      <TextField
        select
        label="Kategorie"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        helperText="Wähle die Kategorie, in der diese Zone liegt"
      >
        <MenuItem value="">
          <em>Keine Kategorie</em>
        </MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Zone Key"
        value={zoneKey}
        onChange={(e) => setZoneKey(e.target.value)}
      />
      <TextField
        label="Zone Name"
        value={zoneName}
        onChange={(e) => setZoneName(e.target.value)}
      />
      <TextField
        label="Benötigte Minuten"
        type="number"
        value={minutesRequired}
        onChange={(e) => setMinutesRequired(Number(e.target.value))}
      />
      <TextField
        label="Punkte"
        type="number"
        value={pointsGranted}
        onChange={(e) => setPointsGranted(Number(e.target.value))}
      />

      {/* Footer-Buttons: Löschen/Speichern */}
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button color="error" variant="outlined" onClick={handleDelete}>
          Löschen
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Änderungen Speichern
        </Button>
      </Stack>
    </Stack>
  );
}
