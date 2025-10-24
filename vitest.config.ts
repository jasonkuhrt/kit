import { setup } from '@ark/attest'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Run attest type checking only when explicitly requested via ATTEST env var
if (process.env[`ATTEST`] === `true`) {
  setup()
}

export default defineConfig({
  // @ts-expect-error
  plugins: [tsconfigPaths()],
  test: {
    globals: false,
    globalSetup: ['./vitest.global-setup.ts'],
  },
})
