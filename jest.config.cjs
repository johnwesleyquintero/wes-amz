/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    "jest-environment": "jsdom",
  },
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
