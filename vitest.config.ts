import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/lib/math/**', 'src/machines/**'],
      thresholds: { lines: 85, functions: 85, branches: 80 },
    },
  },
  resolve: {
    alias: { '@': resolve(__dirname, './src') },
  },
})
