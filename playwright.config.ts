import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  reporter: 'html',  // <-- esto genera la carpeta playwright-report/
  use: {
    //baseURL: process.env.BASE_URL || 'https://api.example.com',
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
});
