import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // mock CSS imports
    setupFiles: ['./src/test/setup.ts'],
  }
});