import { setup } from '@ark/attest'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Run attest type checking only when explicitly requested via ATTEST env var
if (process.env[`ATTEST`] === `true`) {
  setup()
}

export default defineConfig({
  // TODO: Remove cast when fixed: https://github.com/vitest-dev/vitest/issues/9126
  plugins: [tsconfigPaths() as any],
  test: {
    globals: false,
    globalSetup: ['./vitest.global-setup.ts'],
  },
})
