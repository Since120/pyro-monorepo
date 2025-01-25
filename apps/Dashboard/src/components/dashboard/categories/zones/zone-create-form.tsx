"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "next/navigation";

interface CategoryOption {
  id: string;
  name: string;
}

export function ZoneCreateForm() {
  const router = useRouter();

  // Kategorieliste
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [categoryId, setCategoryId] = useState("");

  // Pflichtfelder
  const [zoneKey, setZoneKey] = useState("");
  const [zoneName, setZoneName] = useState("");
  const [minutesRequired, setMinutesRequired] = useState<number>(60);
  const [pointsGranted, setPointsGranted] = useState<number>(1);

  // Fehlerzustände
  const [errorCategory, setErrorCategory] = useState("");
  const [errorZoneKey, setErrorZoneKey] = useState("");
  const [errorZoneName, setErrorZoneName] = useState("");
  const [errorMinutes, setErrorMinutes] = useState("");
  const [errorPoints, setErrorPoints] = useState("");

  // Kategorien laden
  useEffect(() => {
    async function loadCategories() {
      try {
        // In Nest.js-Fall: fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
        const res = await fetch("/api/categories");
        if (!res.ok) {
          throw new Error(`Error ${res.status} ${res.statusText}`);
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

  // Speichern mit Validierung
  const handleSave = useCallback(async () => {
    // 1) Reset aller Errorstates
    setErrorCategory("");
    setErrorZoneKey("");
    setErrorZoneName("");
    setErrorMinutes("");
    setErrorPoints("");

    let isValid = true;

    // 2) Check: Kategorie (Pflicht)
    if (!categoryId) {
      setErrorCategory("Bitte eine Kategorie auswählen");
      isValid = false;
    }

    // 3) Check: zoneKey
    if (!zoneKey.trim()) {
      setErrorZoneKey("Zone Key ist erforderlich");
      isValid = false;
    }

    // 4) Check: zoneName
    if (!zoneName.trim()) {
      setErrorZoneName("Zonen-Name ist erforderlich");
      isValid = false;
    }

    // 5) Check: Minuten
    if (minutesRequired <= 0) {
      setErrorMinutes("Minuten > 0 erforderlich");
      isValid = false;
    }

    // 6) Check: Punkte
    if (pointsGranted <= 0) {
      setErrorPoints("Punkte > 0 erforderlich");
      isValid = false;
    }

    // Abbrechen, wenn Fehler
    if (!isValid) return;

    // 7) POST-Request
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${baseUrl}/zones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId,
          zoneKey,
          zoneName,
          minutesRequired,
          pointsGranted,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(`Fehler beim Erstellen: ${errData.error ?? response.statusText}`);
        return;
      }

      // Erfolg
      router.push("/dashboard/categories");
    } catch (error) {
      console.error("handleSave error:", error);
      alert(`Unerwarteter Fehler: ${String(error)}`);
    }
  }, [
    categoryId,
    zoneKey,
    zoneName,
    minutesRequired,
    pointsGranted,
    router,
  ]);

  return (
    <Stack spacing={2}>
      {/* Kategorie-Dropdown als Pflichtfeld */}
      <TextField
        select
        required
        label="Kategorie"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        helperText={errorCategory || "Wähle eine Kategorie (Pflichtfeld)"}
        error={!!errorCategory}
      >
        <MenuItem value="">
          <em>Keine Auswahl</em>
        </MenuItem>
        {categories.map((cat) => (
          <MenuItem key={cat.id} value={cat.id}>
            {cat.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        required
        label="Zone Key"
        value={zoneKey}
        onChange={(e) => setZoneKey(e.target.value)}
        error={!!errorZoneKey}
        helperText={errorZoneKey}
      />

      <TextField
        required
        label="Zone Name"
        value={zoneName}
        onChange={(e) => setZoneName(e.target.value)}
        error={!!errorZoneName}
        helperText={errorZoneName}
      />

      <TextField
        required
        label="Benötigte Minuten"
        type="number"
        value={minutesRequired}
        onChange={(e) => setMinutesRequired(Number(e.target.value))}
        error={!!errorMinutes}
        helperText={errorMinutes}
      />

      <TextField
        required
        label="Punkte"
        type="number"
        value={pointsGranted}
        onChange={(e) => setPointsGranted(Number(e.target.value))}
        error={!!errorPoints}
        helperText={errorPoints}
      />

      <Button variant="contained" onClick={handleSave}>
        Speichern
      </Button>
    </Stack>
  );
}
