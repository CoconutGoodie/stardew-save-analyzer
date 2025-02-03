// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import globals from "globals";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,

  { ignores: ["node_modules", "dist", "eslint.config.mjs"] },

  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
  },

  // TODO: Simplify when https://github.com/facebook/react/issues/28313 is resolved
  {
    // @ts-ignore
    plugins: { "react-hooks": reactHooks },
    // @ts-ignore
    rules: { ...reactHooks.configs.recommended.rules },
  },

  {
    files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
    plugins: {
      react,
      "react-refresh": reactRefresh,
    },
    rules: {
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-object-type": "off",

      "react/react-in-jsx-scope": "off",
      "react/jsx-key": ["error", { checkFragmentShorthand: true }],

      "react-hooks/exhaustive-deps": "off",

      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  }
);
