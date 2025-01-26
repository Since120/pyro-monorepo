/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,

  // Auf Node-Umgebung einstellen
  env: {
    node: true,
    es2022: true, // z.B. ES2022
  },

  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },

  extends: [
    // Basis-Regeln
    "eslint:recommended",
    // TypeScript-Empfehlungen
    "plugin:@typescript-eslint/recommended",
    // Prettier ganz am Ende
    "prettier",
  ],

  plugins: ["@typescript-eslint"],

  rules: {
    // Beispiel: keine zusätzlichen Regeln
    // Falls du z. B. 'no-console' aktivieren möchtest:
    // 'no-console': 'warn',
  },
};
