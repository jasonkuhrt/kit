import { setup } from '@ark/attest'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Run attest type checking in CI or when explicitly requested via VITEST_TYPE_CHECK env var
if (process.env[`CI`] || process.env[`VITEST_TYPE_CHECK`] === `true`) {
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
