// @ts-check

import tsESLint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
// import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

/**
 * @type {import("eslint").Linter.Config[]}
 */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      parser: tsParser,
    },
    plugins: {
      react,
      // "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...tsESLint.configs.recommended.rules,
      ...react.configs.recommended.rules,
      // ...reactHooks.configs.recommended.rules,
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-namespace": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],
      "react-hooks/exhaustive-deps": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
];
