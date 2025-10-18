import { FsLoc } from '#fs-loc'
import { Test } from '@wollybeard/kit/test'
import { Schema as S } from 'effect'
import { expect } from 'vitest'
import { DrillableNamespaceEntrypoint, type ImportExample, Module, SimpleEntrypoint } from './schema.js'

// ============================================================================
// DrillableNamespaceEntrypoint.getImportExamples()
// ============================================================================

Test.describe('DrillableNamespaceEntrypoint.getImportExamples > top-level (single breadcrumb)')
  .inputType<{ packageName: string; breadcrumbs: string[] }>()
  .outputType<ImportExample[]>()
  .cases(
    [
      { packageName: '@wollybeard/kit', breadcrumbs: ['Ts'] },
      [
        { label: 'Namespace', content: `import { Ts } from '@wollybeard/kit'` },
        { label: 'Barrel', content: `import * as Ts from '@wollybeard/kit/ts'` },
      ],
    ],
    [
      { packageName: '@wollybeard/kit', breadcrumbs: ['Str'] },
      [
        { label: 'Namespace', content: `import { Str } from '@wollybeard/kit'` },
        { label: 'Barrel', content: `import * as Str from '@wollybeard/kit/str'` },
      ],
    ],
  )
  .test(({ input, output }) => {
    const entrypoint = DrillableNamespaceEntrypoint.make({
      path: '.',
      module: Module.make({
        location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        exports: [],
      }),
    })

    const result = entrypoint.getImportExamples(input.packageName, input.breadcrumbs)
    expect(result.length).toBe(2)
    expect(result[0]!.label).toBe(output[0]!.label)
    expect(result[0]!.content).toBe(output[0]!.content)
    expect(result[1]!.label).toBe(output[1]!.label)
    expect(result[1]!.content).toBe(output[1]!.content)
  })

Test.describe('DrillableNamespaceEntrypoint.getImportExamples > 2-level nested')
  .inputType<{ packageName: string; breadcrumbs: string[] }>()
  .outputType<ImportExample[]>()
  .cases(
    [
      { packageName: '@wollybeard/kit', breadcrumbs: ['Ts', 'Union'] },
      [
        {
          label: 'Namespace',
          content: `import { Ts } from '@wollybeard/kit'\n\n// Access via namespace\nTs.Union`,
        },
        { label: 'Barrel', content: `import { Union } from '@wollybeard/kit/ts'` },
      ],
    ],
    [
      { packageName: '@wollybeard/kit', breadcrumbs: ['Str', 'Case'] },
      [
        {
          label: 'Namespace',
          content: `import { Str } from '@wollybeard/kit'\n\n// Access via namespace\nStr.Case`,
        },
        { label: 'Barrel', content: `import { Case } from '@wollybeard/kit/str'` },
      ],
    ],
  )
  .test(({ input, output }) => {
    const entrypoint = DrillableNamespaceEntrypoint.make({
      path: '.',
      module: Module.make({
        location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        exports: [],
      }),
    })

    const result = entrypoint.getImportExamples(input.packageName, input.breadcrumbs)
    expect(result.length).toBe(2)
    expect(result[0]!.label).toBe(output[0]!.label)
    expect(result[0]!.content).toBe(output[0]!.content)
    expect(result[1]!.label).toBe(output[1]!.label)
    expect(result[1]!.content).toBe(output[1]!.content)
  })

Test.describe('DrillableNamespaceEntrypoint.getImportExamples > 3-level nested')
  .inputType<{ packageName: string; breadcrumbs: string[] }>()
  .outputType<ImportExample[]>()
  .cases([
    { packageName: '@wollybeard/kit', breadcrumbs: ['Ts', 'Union', 'Kind'] },
    [
      {
        label: 'Namespace',
        content: `import { Ts } from '@wollybeard/kit'\n\n// Access via namespace\nTs.Union.Kind`,
      },
      { label: 'Barrel', content: `import { Kind } from '@wollybeard/kit/ts'` },
    ],
  ])
  .test(({ input, output }) => {
    const entrypoint = DrillableNamespaceEntrypoint.make({
      path: '.',
      module: Module.make({
        location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        exports: [],
      }),
    })

    const result = entrypoint.getImportExamples(input.packageName, input.breadcrumbs)
    expect(result.length).toBe(2)
    expect(result[0]!.label).toBe(output[0]!.label)
    expect(result[0]!.content).toBe(output[0]!.content)
    expect(result[1]!.label).toBe(output[1]!.label)
    expect(result[1]!.content).toBe(output[1]!.content)
  })

Test.describe('DrillableNamespaceEntrypoint.getImportExamples > edge cases')
  .inputType<{ description: string; packageName: string; breadcrumbs: string[] }>()
  .outputType<ImportExample[]>()
  .cases([{ description: 'empty breadcrumbs', packageName: '@wollybeard/kit', breadcrumbs: [] }, []])
  .test(({ input, output }) => {
    const entrypoint = DrillableNamespaceEntrypoint.make({
      path: '.',
      module: Module.make({
        location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        exports: [],
      }),
    })

    const result = entrypoint.getImportExamples(input.packageName, input.breadcrumbs)
    expect(result).toEqual(output)
  })

// ============================================================================
// SimpleEntrypoint.getImportExamples()
// ============================================================================

Test.describe('SimpleEntrypoint.getImportExamples > simple entrypoints')
  .inputType<{ packageName: string; path: string }>()
  .outputType<ImportExample[]>()
  .cases(
    [
      { packageName: '@wollybeard/kit', path: './arr' },
      [{ label: 'Import', content: `import * as arr from '@wollybeard/kit/arr'` }],
    ],
    [
      { packageName: '@wollybeard/kit', path: './str' },
      [{ label: 'Import', content: `import * as str from '@wollybeard/kit/str'` }],
    ],
    [
      { packageName: 'my-package', path: './utils' },
      [{ label: 'Import', content: `import * as utils from 'my-package/utils'` }],
    ],
  )
  .test(({ input, output }) => {
    const entrypoint = SimpleEntrypoint.make({
      path: input.path,
      module: Module.make({
        location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        exports: [],
      }),
    })

    const result = entrypoint.getImportExamples(input.packageName, input.path)
    expect(result.length).toBe(1)
    expect(result[0]!.label).toBe(output[0]!.label)
    expect(result[0]!.content).toBe(output[0]!.content)
  })
