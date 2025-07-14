import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import react from "eslint-plugin-react";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    plugins: {
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...react.configs.recommended.rules, // Add react recommended rules here
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "react/react-in-jsx-scope": "off", // Disable the rule for React 17+
      "react/no-unescaped-entities": "off", // Disable the rule for unescaped entities
      "react/prop-types": "off", // Disable prop-types validation for TypeScript projects
      "react/no-unknown-property": "warn", // Re-enable as a warning to catch typos
      "max-lines-per-function": [
        "warn",
        { max: 100, skipBlankLines: true, skipComments: true },
      ], // Warn for functions over 100 lines
      complexity: ["warn", 15], // Warn for functions with cyclomatic complexity over 15
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
);
