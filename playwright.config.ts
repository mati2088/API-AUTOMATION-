import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });
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
