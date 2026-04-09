import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  reporter: 'html',  // <-- esto genera la carpeta playwright-report/
  use: {
    baseURL: process.env.BASE_URL,
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
});
