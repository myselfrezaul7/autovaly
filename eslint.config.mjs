import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/app/about/page.tsx",
      "src/app/compare{,/**}/page.tsx",
      "src/app/contact/page.tsx",
      "src/app/search/page.tsx",
      "src/components/ArticleBody.tsx",
      "src/components/ui/SearchResults.tsx",
    ],
    rules: {
      "react/no-unescaped-entities": "warn",
    },
  },
  {
    files: [
      "src/components/Navbar.tsx",
      "src/components/SpecsPromo.tsx",
      "src/components/ui/TiltCard.tsx",
      "src/lib/currency-context.tsx",
      "src/lib/theme-context.tsx",
      "src/lib/useGarage.ts",
      "src/lib/useRecentlyViewed.ts",
    ],
    rules: {
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  {
    files: ["src/sanity/schemas/vehicle.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "public/sw.js",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
