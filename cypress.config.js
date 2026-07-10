import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: process.env.APP_BASE_URL || 'http://localhost:9090',
    supportFile: false,
  },
});
