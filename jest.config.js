/** @type {import('jest').Config} */
const config = {
  clearMocks: true,
  collectCoverage: false,
  collectCoverageFrom: ["src/**/*.js", "!src/**/__tests__/**"],
  coverageDirectory: "coverage",
  verbose: true,
};

export default config;
