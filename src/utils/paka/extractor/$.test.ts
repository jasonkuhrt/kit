import { Dir } from '#dir'
import { FsLoc } from '#fs-loc'
import { Str } from '#str'
import { Test } from '#test'
import { beforeEach, vi } from 'vitest'
import { extractFromFiles } from './extract.js'

// Mock Date to ensure consistent snapshots
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-10-12T10:00:00.000Z'))
})

const { ts } = Str.Tpl.highlight

const packageJson = {
  name: 'x',
  version: '0.0.0',
  exports: {
    '.': './build/index.js',
  },
}

const project = Dir
  .spec('/')
  .add('package.json', packageJson)
  .add('src/index.ts', ts``)

Test
  .on(extractFromFiles)
  .snapshotSchemas([FsLoc.FsLoc])
  .casesInput(
    // Entrypoint filtering
    {
      files: project
        .add('package.json', {
          ...packageJson,
          exports: {
            ...packageJson.exports,
            './a': './build/a.js',
          },
        })
        .add('src/a.ts', ts`export const _ = 0`)
        .toLayout(),
      entrypoints: ['.'], // ignores ./a
    },
    // Simple Entrypoint
    {
      files: project
        .add('src/index.ts', ts`/** EX _ doc */ export const _ = () => 0`)
        .toLayout(),
    },
    // Drillable Namespace Entrypoints
    {
      files: project
        .add('package.json', {
          name: 'x',
          version: '0.0.0',
          exports: {
            '.': './build/index.js',
            './a': './build/a.js',
          },
        })
        .add('src/index.ts', ts`/** P doc */ export * as A from './a.js'`)
        .add('src/a.ts', ts`/** NS doc */ /** _ doc **/ export const _ = 0`)
        .toLayout(),
    },
    // Filter @internal exports
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** a */
          export const a = () => 1

          /** b @internal */
          export const b = () => 2
        `,
        )
        .toLayout(),
    },
    // Filter underscore exports when option enabled
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** a */
          export const a = () => 1

          /** b */
          export const _b = () => 2
        `,
        )
        .toLayout(),
      filterUnderscoreExports: true,
    },
    // Don't filter underscore exports by default
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** a */
          export const a = () => 1

          /** b */
          export const _b = () => 2
        `,
        )
        .toLayout(),
    },
    // Mixed: @internal and underscore filtering
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** a */
          export const a = () => 1

          /** b @internal */
          export const b = () => 2

          /** c */
          export const _c = () => 3

          /** d @internal */
          export const _d = () => 4
        `,
        )
        .toLayout(),
      filterUnderscoreExports: true,
    },
    // ESM namespace with TypeScript shadow - JSDoc from shadow is used
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          // @ts-expect-error Duplicate identifier
          export * as U from './u.js'
          /** Shadow @category C */
          export namespace U {}
        `,
        )
        .add(
          'src/u.ts',
          ts`
          /** Nested */

          /** a */
          export const a = () => 1
        `,
        )
        .toLayout(),
    },
    // ESM namespace without TypeScript shadow - falls back to module-level JSDoc
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          export * as U from './u.js'
        `,
        )
        .add(
          'src/u.ts',
          ts`
          /** Nested */

          /** a */
          export const a = () => 1
        `,
        )
        .toLayout(),
    },
    // TypeScript namespace shadow is not added as a separate export
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          // @ts-expect-error Duplicate identifier
          export * as U from './u.js'
          /** Shadow @category C */
          export namespace U {}

          /** b */
          export const b = () => 1
        `,
        )
        .add(
          'src/u.ts',
          ts`
          /** Nested */

          /** a */
          export const a = () => 1
        `,
        )
        .toLayout(),
    },
    // Module-level README: Sibling .md file
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** JSDoc */
          export const a = () => 1
        `,
        )
        .add('src/index.md', 'M')
        .toLayout(),
    },
    // Module-level README: README.md in directory
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /** JSDoc */
          export const a = () => 1
        `,
        )
        .add('src/README.md', 'R')
        .toLayout(),
    },
    // Module-level README: Sibling .md takes precedence over README.md
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          export const a = () => 1
        `,
        )
        .add('src/index.md', 'M')
        .add('src/README.md', 'R')
        .toLayout(),
    },
    // Namespace wrapper with .md (pure wrapper) - overrides nested module
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          export * as U from './u.js'
        `,
        )
        .add('src/index.md', 'W')
        .add(
          'src/u.ts',
          ts`
          /** N */
          export const a = () => 1
        `,
        )
        .toLayout(),
    },
    // Namespace wrapper with other exports - .md NOT used as override
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          export * as U from './u.js'

          /** b */
          export const b = () => 2
        `,
        )
        .add('src/index.md', 'M')
        .add(
          'src/u.ts',
          ts`
          /** N */
          export const a = () => 1
        `,
        )
        .toLayout(),
    },
    // TypeScript shadow + wrapper .md - shadow wins
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          // @ts-expect-error Duplicate identifier
          export * as U from './u.js'
          /** S @category C */
          export namespace U {}
        `,
        )
        .add('src/index.md', 'M')
        .add(
          'src/u.ts',
          ts`
          /** N */
          export const a = () => 1
        `,
        )
        .toLayout(),
    },
    // Preserve backticks in JSDoc inline code examples (including nested structures)
    {
      files: project
        .add(
          'src/index.ts',
          ts`
          /**
           * Input accepting various patterns:
           * - Simple value: \`2\`
           * - Simple object: \`{ foo: 1 }\`
           * - Nested with arrow function: \`{ main: { start: (ctx) => 2 } }\`
           * - Array: \`[1, 2, 3]\`
           */
          export type PaddingInput = string
        `,
        )
        .toLayout(),
    },
  )
  .test()
