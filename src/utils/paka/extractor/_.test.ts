import { Dir } from '#dir'
import { Fs } from '#fs'
import { Test } from '#test'
import { beforeEach, describe, expect, test, vi } from 'vitest'
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
  .snapshotSchemas([Fs.Path.Schema])
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
    // Drillable namespace: shadow namespace with @category (preferred pattern)
    {
      files: project
        .add('package.json', {
          name: 'x',
          version: '0.0.0',
          exports: {
            '.': './i.js',
            './arr': './arr/__.js',
          },
        })
        .add(
          'i.ts',
          `// @ts-expect-error Duplicate identifier
          export * as Arr from './arr/__.js'
          /** Array utilities @category Domains */
          export namespace Arr {}`,
        )
        .add(
          'arr/$.ts',
          `// @ts-expect-error Duplicate identifier
          export * as Arr from './__.js'
          /** Array utilities @category Domains */
          export namespace Arr {}`,
        )
        .add('arr/$$.ts', `export const map = 1`)
        .toLayout(),
    },
    // Drillable namespace: JSDoc on export declaration (fallback pattern)
    {
      files: project
        .add('package.json', {
          name: 'x',
          version: '0.0.0',
          exports: {
            '.': './i.js',
            './str': './str/__.js',
          },
        })
        .add(
          'i.ts',
          `/** String utilities @category Domains */
          export * as Str from './str/__.js'`,
        )
        .add(
          'str/$.ts',
          `/** String utilities @category Domains */
          export * as Str from './__.js'`,
        )
        .add('str/$$.ts', `export const trim = 1`)
        .toLayout(),
    },
    // Drillable namespace: shadow takes precedence over export JSDoc
    {
      files: project
        .add('package.json', {
          name: 'x',
          version: '0.0.0',
          exports: {
            '.': './i.js',
            './num': './num/__.js',
          },
        })
        .add(
          'i.ts',
          `/** Export doc @category Wrong */
          export * as Num from './num/__.js'
          /** Shadow doc @category Domains */
          export namespace Num {}`,
        )
        .add(
          'num/$.ts',
          `/** Export doc @category Wrong */
          export * as Num from './__.js'
          /** Shadow doc @category Domains */
          export namespace Num {}`,
        )
        .add('num/$$.ts', `export const add = 1`)
        .toLayout(),
    },
  )
  .test()

describe('Path transformation with tsconfig', () => {
  test('uses outDir/rootDir from tsconfig.build.json when present', () => {
    const layout = Dir
      .spec('/')
      .add('package.json', {
        name: 'test-pkg',
        version: '1.0.0',
        exports: {
          './foo': './build/foo/__.js', // Points to BUILD path
        },
      })
      .add('tsconfig.build.json', {
        compilerOptions: {
          outDir: './build',
          rootDir: './src',
        },
      })
      .add(
        'src/foo/__.ts',
        `
        /** Foo function */
        export const foo = () => 'foo'
      `,
      )
      .toLayout()

    const model = extractFromFiles({
      projectRoot: '/',
      files: layout,
    })

    // Should successfully extract from ./src/foo/__.ts
    // (transformed from ./build/foo/__.js)
    expect(model.entrypoints).toHaveLength(1)

    const entrypoint = model.entrypoints[0]
    expect(entrypoint).toBeDefined()

    // Check it's a SimpleEntrypoint and has the module
    if (entrypoint?._tag === 'SimpleEntrypoint') {
      expect(entrypoint.module.exports).toContainEqual(
        expect.objectContaining({ name: 'foo' }),
      )
    } else {
      throw new Error('Expected SimpleEntrypoint')
    }
  })
})
