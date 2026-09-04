// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

export default tseslint.config(
  {
    ignores: ["dist/**", "node_modules/**", "Releases/**", "tmp/**", "src/dev/**"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.mjs", "**/*.cjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
    rules: {
      "no-this-alias": "off",
      "@typescript-eslint/no-this-alias": [
        "error",
        {
          allowDestructuring: false, // Disallow `const { props, state } = this`; true by default
          allowedNames: ["self"], // Allow `const self = this`; `[]` by default
        },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          vars: "all",
          args: "none",
        },
      ],
      "@typescript-eslint/triple-slash-reference": "warn",
    },
  },
  prettierConfig
);
