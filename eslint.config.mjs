import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Social cards render through Satori, which only understands plain <img>.
  // no-img-element already exempts these files, but its path check only
  // converts the first "\" in a Windows path, so the exemption fails there and
  // an inline disable is then "unused" on Linux CI. Turning it off here
  // behaves the same on both.
  {
    files: ["src/app/**/opengraph-image.tsx"],
    rules: { "@next/next/no-img-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
