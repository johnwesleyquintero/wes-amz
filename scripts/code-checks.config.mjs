/**
 * Configuration for the code-checker script.
 * Define the commands to run and their descriptive names.
 */
export const CHECKS = [
  { command: "npx prettier --write . --log-level warn", name: "Format Check" },
  { command: "eslint . --fix", name: "Lint Check" },
  { command: "tsc -b && tsc --noEmit", name: "Type Check" },
  //{ command: "npm test", name: "Unit Tests" },
  //{ command: "npm run build", name: "Build Check" },
];
