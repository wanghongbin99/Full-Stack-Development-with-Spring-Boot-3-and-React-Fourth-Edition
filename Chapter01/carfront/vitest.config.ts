import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: {
      modules: {
        classNameStrategy: 'non-scoped'
      }
    },
    deps: {
      inline: [
        /@mui\/x-data-grid/,
        /@mui\/material/
      ],
      external: [
        /node_modules/
      ]
    }
  },
  resolve: {
    alias: [
      {
        find: /\.(css|scss)$/,
        replacement: path.resolve(__dirname, 'src/test/styleMock.ts')
      },
      {
        find: '@mui/x-data-grid',
        replacement: '@mui/x-data-grid/dist/index.js'
      }
    ]
  }
});