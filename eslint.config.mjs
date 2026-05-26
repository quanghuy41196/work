import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disabled because some UI component libraries use expression-statement
      // patterns like `condition && sideEffect()` for event handling.
      // If this was added for a specific file, prefer inline eslint-disable comments
      // in that file and remove this global override.
      "@typescript-eslint/no-unused-expressions": "off",

      // Project intentionally uses <img> tags in some places (e.g. SVG assets,
      // third-party embeds) where Next.js <Image> optimisation is not applicable.
      "@next/next/no-img-element": "off",
    },
  },
];

export default eslintConfig;
