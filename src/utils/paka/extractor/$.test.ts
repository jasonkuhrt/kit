import { Dir } from '#dir'
import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import { beforeEach, vi } from 'vitest'
import { extractFromFiles } from './extract.js'

// Mock Date to ensure consistent snapshots
beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2025-10-12T10:00:00.000Z'))
})

const packageJson = {
  name: 'x',
  version: '0.0.0',
  exports: {
    '.': './i.js',
  },
}

const project = Dir
  .spec('/')
  .add('package.json', packageJson)
  .add('i.ts', ``)

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
            './a': './a.js',
          },
        })
        .add('a.ts', `export const _ = 0`)
        .toLayout(),
      entrypoints: ['.'], // ignores ./a
    },
    // Simple Entrypoint
    { files: project.add('i.ts', `export const _ = 0`).toLayout() },
    // Drillable Namespace Entrypoints
    {
      files: project
        .add('package.json', {
          name: 'x',
          version: '0.0.0',
          exports: {
            '.': './i.js',
            './a': './a.js',
          },
        })
        .add('i.ts', `export * as A from './a.js'`)
        .add('a.ts', `export const _ = 0`)
        .toLayout(),
    },
    // Filter @internal exports
    { files: project.add('i.ts', `export const a = 1\n/** @internal */\nexport const b = 2`).toLayout() },
    // Filter underscore exports when option enabled
    { files: project.add('i.ts', `export const a = 1\nexport const _b = 2`).toLayout(), filterUnderscoreExports: true },
    // Don't filter underscore exports by default
    { files: project.add('i.ts', `export const a = 1\nexport const _b = 2`).toLayout() },
    // Mixed: @internal and underscore filtering
    {
      files: project.add(
        'i.ts',
        `export const a = 1
          /** @internal */
          export const b = 2
          export const _c = 3
          /** @internal */
          export const _d = 4`,
      ).toLayout(),
      filterUnderscoreExports: true,
    },
    // ESM namespace with TypeScript shadow - JSDoc from shadow is used
    {
      files: project
        .add(
          'i.ts',
          `// @ts-expect-error Duplicate identifier
          export * as U from './u.js'
          /** Shadow @category C */
          export namespace U {}`,
        )
        .add('u.ts', `/** Nested */\nexport const a = 1`)
        .toLayout(),
    },
    // ESM namespace without TypeScript shadow - falls back to module-level JSDoc
    {
      files: project
        .add('i.ts', `export * as U from './u.js'`)
        .add('u.ts', `/** Nested */\nexport const a = 1`)
        .toLayout(),
    },
    // TypeScript namespace shadow is not added as a separate export
    {
      files: project
        .add(
          'i.ts',
          `// @ts-expect-error Duplicate identifier
          export * as U from './u.js'
          /** Shadow @category C */
          export namespace U {}
          export const b = 1`,
        )
        .add('u.ts', `/** Nested */\nexport const a = 1`)
        .toLayout(),
    },
    // Module-level README: Sibling .md file
    { files: project.add('i.ts', `export const a = () => 1`).add('i.md', 'M').toLayout() },
    // Module-level README: README.md in directory
    { files: project.add('i.ts', `export const a = () => 1`).add('README.md', 'R').toLayout() },
    // Module-level README: Sibling .md takes precedence over README.md
    { files: project.add('i.ts', `export const a = () => 1`).add('i.md', 'M').add('README.md', 'R').toLayout() },
    // Namespace wrapper with .md (pure wrapper) - overrides nested module
    {
      files: project
        .add('i.ts', `export * as U from './u.js'`)
        .add('i.md', 'W')
        .add('u.ts', `/** N */\nexport const a = 1`)
        .toLayout(),
    },
    // Namespace wrapper with other exports - .md NOT used as override
    {
      files: project
        .add('i.ts', `export * as U from './u.js'\nexport const b = 2`)
        .add('i.md', 'M')
        .add('u.ts', `/** N */\nexport const a = 1`)
        .toLayout(),
    },
    // TypeScript shadow + wrapper .md - shadow wins
    {
      files: project
        .add(
          'i.ts',
          `// @ts-expect-error Duplicate identifier
          export * as U from './u.js'
          /** S @category C */
          export namespace U {}`,
        )
        .add('i.md', 'M')
        .add('u.ts', `/** N */\nexport const a = 1`)
        .toLayout(),
    },
    // Preserve backticks in JSDoc inline code examples
    { files: project.add('i.ts', `/** foo \`bar\` */\nexport type T = string`).toLayout() },
    // Interface + const with same name - should extract both
    { files: project.add('i.ts', `export interface foo { (): number }\nexport const foo = 1`).toLayout() },
  )
  .test()
