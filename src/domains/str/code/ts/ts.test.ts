import { Test } from '#test'
import { expect, test as vtTest } from 'vitest'
import * as TS from './ts.js'

// ============================================================================
// Literals
// ============================================================================

// dprint-ignore
Test.describe('TS.string > quote string')
  .on(TS.string)
  .cases(
    [['hello'],                                     '"hello"'],
    [['world'],                                     '"world"'],
    [['path/to/file'],                              '"path/to/file"'],
  )
  .test()

vtTest('TS.list > array literal', () => {
  expect(TS.list(['a', 'b', 'c'])).toBe('[a, b, c]')
  expect(TS.list(['foo'])).toBe('[foo]')
  expect(TS.list([])).toBe('[]')
})

// dprint-ignore
Test.describe('TS.block > wrap in braces')
  .on(TS.block)
  .cases(
    [['foo: string'],                               '{\nfoo: string\n}'],
    [['a: number\nb: boolean'],                     '{\na: number\nb: boolean\n}'],
  )
  .test()

vtTest('TS.object > generate object literal', () => {
  const result = TS.object([
    ['name', '"Alice"'],
    ['age', '30'],
  ])
  expect(result).toBe('{\nname: "Alice",\nage: 30\n}')
})

vtTest('TS.object > empty object', () => {
  const result = TS.object([])
  expect(result).toBe('{}')
})

// dprint-ignore
Test.describe('TS.boolean > boolean literal')
  .on(TS.boolean)
  .cases(
    [[true],                                            'true'],
    [[false],                                           'false'],
  )
  .test()

// ============================================================================
// Type Definitions
// ============================================================================

// dprint-ignore
Test.describe('TS.typeAlias > basic type alias')
  .on(TS.typeAlias)
  .cases(
    [['UserId', 'string'],                          'type UserId = string'],
    [['Point', '{ x: number; y: number }'],         'type Point = { x: number; y: number }'],
  )
  .test()

vtTest('TS.typeAliasWithOptions > with all options', () => {
  const result = TS.typeAliasWithOptions({
    name: 'Result',
    type: 'T | Error',
    parameters: ['T'],
    tsDoc: 'A result type',
    export: true,
  })
  expect(result).toContain('/**')
  expect(result).toContain('* A result type')
  expect(result).toContain('export type Result<T> = T | Error')
})

vtTest('TS.typeAliasWithOptions > minimal options', () => {
  const result = TS.typeAliasWithOptions({
    name: 'Foo',
    type: 'string',
  })
  expect(result).toBe('export type Foo = string')
})

vtTest('TS.typeAliasWithOptions > no export', () => {
  const result = TS.typeAliasWithOptions({
    name: 'Private',
    type: 'number',
    export: false,
  })
  expect(result).toBe('type Private = number')
})

vtTest('TS.interfaceDecl > basic interface', () => {
  const result = TS.interfaceDecl({
    name: 'User',
    block: 'id: string\nname: string',
  })
  expect(result).toContain('export interface User {')
  expect(result).toContain('id: string')
  expect(result).toContain('name: string')
})

vtTest('TS.interfaceDecl > with extends', () => {
  const result = TS.interfaceDecl({
    name: 'Admin',
    block: 'role: string',
    extends: ['User', 'Permissions'],
  })
  expect(result).toContain('export interface Admin extends User, Permissions {')
})

vtTest('TS.interfaceDecl > with type parameters', () => {
  const result = TS.interfaceDecl({
    name: 'Container',
    block: 'value: T',
    parameters: ['T'],
  })
  expect(result).toContain('export interface Container<T> {')
})

vtTest('TS.interfaceDecl > with TSDoc', () => {
  const result = TS.interfaceDecl({
    name: 'Config',
    block: 'port: number',
    tsDoc: 'Application configuration',
  })
  expect(result).toContain('/**')
  expect(result).toContain('* Application configuration')
  expect(result).toContain('export interface Config {')
})

vtTest('TS.interfaceDecl > empty interface', () => {
  const result = TS.interfaceDecl({
    name: 'Empty',
  })
  expect(result).toBe('export interface Empty {}')
})

vtTest('TS.union > union type alias', () => {
  const result = TS.union('Status', ['Active', 'Inactive', 'Pending'])
  expect(result).toBe('type Status =\n| Active\n| Inactive\n| Pending')
})

vtTest('TS.union > filters falsy values', () => {
  const result = TS.union('Result', ['Success', '', 'Failure'])
  expect(result).toBe('type Result =\n| Success\n| Failure')
})

vtTest('TS.unionItems > union items without type wrapper', () => {
  const result = TS.unionItems(['string', 'number', null])
  expect(result).toBe('string\n| number')
})

vtTest('TS.unionItems > filters null values', () => {
  const result = TS.unionItems(['string', null, 'boolean'])
  expect(result).toBe('string\n| boolean')
})

// dprint-ignore
Test.describe('TS.tuple > tuple type')
  .on(TS.tuple)
  .cases(
    [[['string', 'number', 'boolean']],                 '[string, number, boolean]'],
    [[['string']],                                      '[string]'],
    [[[]]  ,                                            '[]'],
  )
  .test()

// dprint-ignore
Test.describe('TS.nullable > nullable type')
  .on(TS.nullable)
  .cases(
    [['string'],                                        'string | null'],
    [['User'],                                          'User | null'],
  )
  .test()

// dprint-ignore
Test.describe('TS.intersection > intersection type')
  .on(TS.intersection)
  .cases(
    [['Base', 'Mixin'],                                 'Base & Mixin'],
    [['User', 'Permissions'],                           'User & Permissions'],
  )
  .test()

// ============================================================================
// Exports
// ============================================================================

// dprint-ignore
Test.describe('TS.exportDecl > export declaration')
  .on(TS.exportDecl)
  .cases(
    [['const foo = 1'],                             'export const foo = 1'],
    [['function bar() {}'],                         'export function bar() {}'],
  )
  .test()

// dprint-ignore
Test.describe('TS.reexportAll > export star')
  .on(TS.reexportAll)
  .cases(
    [[{ from: './path' }],                          "export * from './path'"],
    [[{ from: './types', type: true }],             "export type * from './types'"],
  )
  .test()

// dprint-ignore
Test.describe('TS.reexportNamespace > export star as')
  .on(TS.reexportNamespace)
  .cases(
    [[{ as: 'Name', from: './path' }],              "export * as Name from './path'"],
    [[{ as: 'Types', from: './types', type: true }], "export type * as Types from './types'"],
  )
  .test()

vtTest('TS.reexportNamed > simple name', () => {
  const result = TS.reexportNamed({ names: 'Foo', from: './foo' })
  expect(result).toBe("export { Foo } from './foo'")
})

vtTest('TS.reexportNamed > array of names', () => {
  const result = TS.reexportNamed({ names: ['a', 'b', 'c'], from: './abc' })
  expect(result).toBe("export { a, b, c } from './abc'")
})

vtTest('TS.reexportNamed > aliased names', () => {
  const result = TS.reexportNamed({
    names: { oldName: 'newName', foo: 'bar' },
    from: './module',
  })
  expect(result).toBe("export { oldName as newName, foo as bar } from './module'")
})

vtTest('TS.reexportNamed > with type', () => {
  const result = TS.reexportNamed({ names: 'Type', from: './types', type: true })
  expect(result).toBe("export type { Type } from './types'")
})

// ============================================================================
// Imports
// ============================================================================

// dprint-ignore
Test.describe('TS.importAll > import star')
  .on(TS.importAll)
  .cases(
    [[{ as: 'Name', from: './path' }],              "import * as Name from './path'"],
    [[{ as: 'Types', from: './types', type: true }], "import type * as Types from './types'"],
  )
  .test()

vtTest('TS.importNamed > simple name', () => {
  const result = TS.importNamed({ names: 'Foo', from: './foo' })
  expect(result).toBe("import { Foo } from './foo'")
})

vtTest('TS.importNamed > array of names', () => {
  const result = TS.importNamed({ names: ['a', 'b', 'c'], from: './abc' })
  expect(result).toBe("import { a, b, c } from './abc'")
})

vtTest('TS.importNamed > aliased names', () => {
  const result = TS.importNamed({
    names: { oldName: 'newName', foo: 'bar' },
    from: './module',
  })
  expect(result).toBe("import { oldName as newName, foo as bar } from './module'")
})

vtTest('TS.importNamed > with type', () => {
  const result = TS.importNamed({ names: 'Type', from: './types', type: true })
  expect(result).toBe("import type { Type } from './types'")
})

// ============================================================================
// Namespaces
// ============================================================================

// dprint-ignore
Test.describe('TS.namespace > namespace declaration')
  .on(TS.namespace)
  .cases(
    [['Utils', 'export const foo = 1'],                 'namespace Utils {\nexport const foo = 1\n}'],
    [['Types', 'export type T = string'],               'namespace Types {\nexport type T = string\n}'],
  )
  .test()

// ============================================================================
// Expressions
// ============================================================================

// dprint-ignore
Test.describe('TS.propertyAccess > property access expression')
  .on(TS.propertyAccess)
  .cases(
    [['Math', 'PI'],                                    'Math.PI'],
    [['console', 'log'],                                'console.log'],
    [['obj', 'property'],                               'obj.property'],
  )
  .test()

// ============================================================================
// Variable Declarations
// ============================================================================

// dprint-ignore
Test.describe('TS.constDecl > const declaration')
  .on(TS.constDecl)
  .cases(
    [['foo', '1'],                                      'const foo = 1'],
    [['name', '"Alice"'],                               'const name = "Alice"'],
    [['items', '[1, 2, 3]'],                            'const items = [1, 2, 3]'],
  )
  .test()

// dprint-ignore
Test.describe('TS.constDeclTyped > typed const declaration')
  .on(TS.constDeclTyped)
  .cases(
    [['foo', 'number', '1'],                            'const foo: number = 1'],
    [['name', 'string', '"Alice"'],                     'const name: string = "Alice"'],
    [['items', 'number[]', '[1, 2, 3]'],                'const items: number[] = [1, 2, 3]'],
  )
  .test()

// ============================================================================
// Object Members
// ============================================================================

// dprint-ignore
Test.describe('TS.objectFromFields > wrap fields in object braces')
  .on(TS.objectFromFields)
  .cases(
    [['a: string'],                                     '{\na: string\n}'],
    [['a: string\nb: number'],                          '{\na: string\nb: number\n}'],
  )
  .test()

// dprint-ignore
Test.describe('TS.fields > join field declarations')
  .on(TS.fields)
  .cases(
    [[['a: string', 'b: number']],                      'a: string\nb: number'],
    [[['id: string']],                                  'id: string'],
    [[[]]  ,                                            ''],
  )
  .test()
