import { setup } from '@ark/attest'
import path from 'node:path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

// Run attest type checking only when explicitly requested via ATTEST env var
if (process.env[`ATTEST`] === `true`) {
  setup()
}

export default defineConfig({
  // TODO: Remove cast when fixed: https://github.com/vitest-dev/vitest/issues/9126
  plugins: [tsconfigPaths() as any],
  resolve: {
    alias: {
      // Map cross-package imports for tests (these can't be devDependencies due to cycles)
      '#test/test': path.resolve(__dirname, 'packages/test/src/__.ts'),
      '#test': path.resolve(__dirname, 'packages/test/src/_.ts'),
      '#assert/assert': path.resolve(__dirname, 'packages/assert/src/__.ts'),
      '#assert': path.resolve(__dirname, 'packages/assert/src/_.ts'),
    },
  },
  test: {
    globals: false,
    globalSetup: ['./vitest.global-setup.ts'],
  },
})
