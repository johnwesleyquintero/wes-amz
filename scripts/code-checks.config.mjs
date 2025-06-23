/**
 * Configuration for the code-checker script.
 * Define the commands to run and their descriptive names.
 */
export const CHECKS = [
  { command: "npx prettier --write . --log-level warn", name: "Format Check" },
  { command: "npx eslint . --ext .ts,.tsx,.js,.jsx", name: "Lint Check" },
  { command: "npx tsc --noEmit", name: "Type Check" },
  //{ command: "npm run test", name: "Unit Tests" },
];
