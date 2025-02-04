// eslint.config.js (Flat Config Beispiel)

import javascript from "@eslint/js";
// @eslint/js enthält "eslint:recommended" usw.

import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

import prettier from "eslint-config-prettier";
import globals from "globals";
// ACHTUNG: eslint-config-prettier ist kein Plugin,
// sondern nur eine Config-Sammlung zum Abschalten von Format-Regeln.
// Du kannst sie optional integrieren, vgl. unten.

export default [
  // 1) Ignoriere z.B. node_modules:
  {
    ignores: ["**/node_modules/**", "**/dist/**"],
  },
  // 2) Haupt-Config für dein Projekt:
  {
    files: ["**/*.ts", "**/*.js"],
    // (nur TS, falls du reine TS-Repos hast => ["**/*.ts"])

    languageOptions: {
      parser: tsParser, // TypeScript-Parser
      ecmaVersion: "latest", // ECMA
      sourceType: "module", // Falls du ES-Modul nutzt
      globals: {
        // Hier statt "env: {node:true}" in .eslintrc
        // Falls du Node-spezifische globale Variablen willst:
        ...globals.node,
        // etc.
      },
    },

    plugins: {
      // Hier bindest du deine Plugins ein
      "@typescript-eslint": tsPlugin,
    },

    rules: {
      // ESLint-eigene "eslint:recommended" bekommst du via `javascript.configs.recommended`
      ...javascript.configs.recommended.rules,

      // @typescript-eslint/recommended
      ...tsPlugin.configs.recommended.rules,

      // Prettier - indem wir Prettier-Regeln überschreiben oder nullen
      // Man kann "prettier" importieren und mergen.
      ...prettier.rules,

      // Jetzt eigene Projektregeln:
      "no-console": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
