/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: ["@zomink/eslint-config"], // uses the config in `packages/config/eslint`
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    tsconfigRootDir: __dirname,
    project: [
      "./tsconfig.json",
      "./apps/*/tsconfig.json",
      "./packages/*/tsconfig.json",
    ],
  },
  ignorePatterns: [
    "tsup.config.ts",
    "dist",
    "build",
    ".next",
    ".turbo",
    "node_modules",
  ],
  settings: {
    next: {
      rootDir: ["apps/web"],
    },
  },
};

module.exports = config;
