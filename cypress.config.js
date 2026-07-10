import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:9090',
    supportFile: false,
    specPattern: 'tests/cypress/e2e/**/*.cy.js',
    fixturesFolder: 'tests/cypress/fixtures',
    screenshotsFolder: 'tests/cypress/screenshots',
    videosFolder: 'tests/cypress/videos',
    downloadsFolder: 'tests/cypress/downloads',
  },
});
