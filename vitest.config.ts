import { cleanup, setup } from '@ark/attest'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

setup()

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: false,
    globalSetup: ['./vitest.global-setup.ts'],
  },
})
