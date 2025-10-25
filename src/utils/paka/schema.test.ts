import { FsLoc } from '#fs-loc'
import { Test } from '#test'
import { Schema as S } from 'effect'
import { expect } from 'vitest'
import {
  DocsProvenance,
  DrillableNamespaceEntrypoint,
  FunctionSignatureModel,
  type ImportExample,
  MdFileProvenance,
  Module,
  SimpleEntrypoint,
  SourceLocation,
  TypeExport,
  TypeSignatureModel,
  ValueExport,
} from './schema.js'

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

// ============================================================================
// SimpleEntrypoint path derivation getters
// ============================================================================

Test.describe('SimpleEntrypoint.moduleName')
  .inputType<{ path: string }>()
  .outputType<string>()
  .cases(
    [{ path: './arr' }, 'Arr'],
    [{ path: './str' }, 'Str'],
    [{ path: './package-manager' }, 'PackageManager'],
    [{ path: './multi-word-name' }, 'MultiWordName'],
  )
  .test(({ input, output }) => {
    const entrypoint = SimpleEntrypoint.make({
      path: input.path,
      module: Module.make({
        location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        exports: [],
      }),
    })

    expect(entrypoint.moduleName).toBe(output)
  })

Test.describe('SimpleEntrypoint.kebabName')
  .inputType<{ path: string }>()
  .outputType<string>()
  .cases(
    [{ path: './arr' }, 'arr'],
    [{ path: './str' }, 'str'],
    [{ path: './package-manager' }, 'package-manager'],
  )
  .test(({ input, output }) => {
    const entrypoint = SimpleEntrypoint.make({
      path: input.path,
      module: Module.make({
        location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        exports: [],
      }),
    })

    expect(entrypoint.kebabName).toBe(output)
  })

// ============================================================================
// Module export filtering getters
// ============================================================================

Test.describe('Module export filtering getters')
  .inputType<{ description: string }>()
  .outputType<void>()
  .cases([{ description: 'filters exports by type correctly' }, undefined])
  .test(() => {
    // Create test exports
    const functionExport = ValueExport.make({
      name: 'testFn',
      type: 'function',
      signature: FunctionSignatureModel.make({ overloads: [] }),
      examples: [],
      tags: {},
      sourceLocation: SourceLocation.make({
        file: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        line: 1,
      }),
    })

    const constantExport = ValueExport.make({
      name: 'testConst',
      type: 'const',
      signature: FunctionSignatureModel.make({ overloads: [] }),
      examples: [],
      tags: {},
      sourceLocation: SourceLocation.make({
        file: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        line: 2,
      }),
    })

    const classExport = ValueExport.make({
      name: 'TestClass',
      type: 'class',
      signature: FunctionSignatureModel.make({ overloads: [] }),
      examples: [],
      tags: {},
      sourceLocation: SourceLocation.make({
        file: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        line: 3,
      }),
    })

    const namespaceExport = ValueExport.make({
      name: 'TestNS',
      type: 'namespace',
      signature: FunctionSignatureModel.make({ overloads: [] }),
      examples: [],
      tags: {},
      module: Module.make({
        location: S.decodeSync(FsLoc.RelFile.String)('./test-ns.ts'),
        exports: [],
      }),
      sourceLocation: SourceLocation.make({
        file: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        line: 4,
      }),
    })

    const typeExport = TypeExport.make({
      name: 'TestType',
      type: 'type-alias',
      signature: TypeSignatureModel.make({ text: 'type TestType = string' }),
      examples: [],
      tags: {},
      sourceLocation: SourceLocation.make({
        file: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        line: 5,
      }),
    })

    const module = Module.make({
      location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
      exports: [functionExport, constantExport, classExport, namespaceExport, typeExport],
    })

    // Test getters
    expect(module.namespaceExports).toEqual([namespaceExport])
    expect(module.regularExports).toEqual([functionExport, constantExport, classExport, typeExport])
    expect(module.functionExports).toEqual([functionExport])
    expect(module.constantExports).toEqual([constantExport])
    expect(module.classExports).toEqual([classExport])
    expect(module.typeExports).toEqual([typeExport])
  })

Test.describe('Module.hasCategories')
  .inputType<{ description: string; exports: any[]; expected: boolean }>()
  .outputType<boolean>()
  .cases(
    [{ description: 'no categories', exports: [], expected: false }, false],
    [
      {
        description: 'has categories',
        exports: [{ category: 'Utils' }],
        expected: true,
      },
      true,
    ],
  )
  .test(({ input, output }) => {
    const exports = input.exports.map((exp) =>
      ValueExport.make({
        name: 'test',
        type: 'function',
        signature: FunctionSignatureModel.make({ overloads: [] }),
        examples: [],
        tags: {},
        category: exp.category,
        sourceLocation: SourceLocation.make({
          file: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
          line: 1,
        }),
      })
    )

    const module = Module.make({
      location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
      exports,
    })

    expect(module.hasCategories).toBe(output)
  })

Test.describe('Module.hasExternalReadme')
  .inputType<{ description: string; hasExternal: boolean }>()
  .outputType<boolean>()
  .cases(
    [{ description: 'no external readme', hasExternal: false }, false],
    [{ description: 'has external readme', hasExternal: true }, true],
  )
  .test(({ input, output }) => {
    const module = Module.make({
      location: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
      exports: [],
      docsProvenance: input.hasExternal
        ? DocsProvenance.make({
          description: MdFileProvenance.make({
            filePath: S.decodeSync(FsLoc.RelFile.String)('./README.md'),
          }),
        })
        : undefined,
    })

    expect(module.hasExternalReadme).toBe(output)
  })

// ============================================================================
// Export.typeIcon getter
// ============================================================================

Test.describe('ValueExport.typeIcon')
  .inputType<{ type: 'function' | 'const' | 'class' | 'namespace' }>()
  .outputType<string>()
  .cases(
    [{ type: 'function' }, 'F'],
    [{ type: 'const' }, 'C'],
    [{ type: 'class' }, 'Class'],
    [{ type: 'namespace' }, 'NS'],
  )
  .test(({ input, output }) => {
    const exp = ValueExport.make({
      name: 'test',
      type: input.type,
      signature: FunctionSignatureModel.make({ overloads: [] }),
      examples: [],
      tags: {},
      sourceLocation: SourceLocation.make({
        file: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        line: 1,
      }),
    })

    expect(exp.typeIcon).toBe(output)
  })

Test.describe('TypeExport.typeIcon')
  .inputType<{ type: 'interface' | 'type-alias' | 'enum' | 'union' | 'intersection' }>()
  .outputType<string>()
  .cases(
    [{ type: 'interface' }, 'I'],
    [{ type: 'type-alias' }, 'T'],
    [{ type: 'enum' }, 'E'],
    [{ type: 'union' }, 'U'],
    [{ type: 'intersection' }, '∩'],
  )
  .test(({ input, output }) => {
    const exp = TypeExport.make({
      name: 'test',
      type: input.type,
      signature: TypeSignatureModel.make({ text: 'type test = string' }),
      examples: [],
      tags: {},
      sourceLocation: SourceLocation.make({
        file: S.decodeSync(FsLoc.RelFile.String)('./test.ts'),
        line: 1,
      }),
    })

    expect(exp.typeIcon).toBe(output)
  })
