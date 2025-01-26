"use client"; 
// <-- Ganz wichtig, damit du clientseitige Hooks & State nutzen kannst

import RuleConfigurator from "./rule-configurator"; 
// (1) wir importieren unsere Komponente gleich hier
// Du kannst sie auch direkt in diese Datei schreiben, aber der Code wird riesig.
// Besser in eine separate Datei packen.

export default function Page() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Rule Test Page</h1>
      <RuleConfigurator />
    </div>
  );
}
